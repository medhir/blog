package code

import (
	"context"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"gitlab.com/medhir/blog/server/auth"
	"gitlab.com/medhir/blog/server/code/dns"
	"gitlab.com/medhir/blog/server/code/k8s"
	appsv1 "k8s.io/api/apps/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"time"
)

const (
	ingressName        = "code"
	servicePort        = 3000
	containerImageName = "theiaide/theia-go:latest"
	dnsNameFormatter   = "code-%s.medhir.com"
	cnameFormatter     = "code-%s"
	urlFormatter       = "https://code-%s.medhir.com"
)

// Manager describes the methods for managing coder instances, given a user token
type Manager interface {
	HasInstance(token string) (bool, error)
	AddInstance(token string) (*Instance, error)
	StartInstance(token string) (*Instance, error)
	StopInstance(token string) error
	RemoveInstance(id string) error
}

type manager struct {
	dns  dns.Manager
	k8s  k8s.Manager
	auth auth.Auth
}

// NewManager instantiates a new coder manager
func NewManager(ctx context.Context, auth auth.Auth, dev bool) (Manager, error) {
	k8sManager, err := k8s.NewManager(ctx, dev)
	if err != nil {
		return nil, err
	}
	dnsManager, err := dns.NewManager()
	if err != nil {
		return nil, err
	}
	return &manager{
		dns:  dnsManager,
		k8s:  k8sManager,
		auth: auth,
	}, nil
}

// Instance describes properties of a coder instance
type Instance struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

func (m *manager) HasInstance(token string) (bool, error) {
	// check to ensure the user has an instance associated with them
	user, err := m.auth.GetUser(token)
	if err != nil {
		return false, errors.New("could not retrieve user for the provided token")
	}
	instanceAttribute := user.Attributes["instance_id"]
	if len(instanceAttribute) == 0 {
		return false, nil
	}
	return true, nil
}

func (m *manager) AddInstance(token string) (*Instance, error) {
	// check if user already has an instance associated with them
	user, err := m.auth.GetUser(token)
	if err != nil {
		return nil, fmt.Errorf("could not retrieve user for the provided token - %s", err.Error())
	}
	instanceID := user.Attributes["instance_id"]
	if len(instanceID) > 0 && instanceID[0] != "" {
		return nil, errors.New("user already has an instance")
	}
	// if not, create a new instance
	id := uuid.New().String()
	resources, err := makeCoderK8sResources(id)
	if err != nil {
		return nil, err
	}
	// add DNS record
	err = m.dns.AddCNAMERecord(resources.cname)
	if err != nil {
		return nil, err
	}
	// give a sec for DNS to register
	time.Sleep(2 * time.Second)
	// add persistent volume claim
	err = m.k8s.AddPersistentVolumeClaim(resources.projectPVC)
	if err != nil {
		return nil, err
	}
	// add service
	err = m.k8s.AddService(resources.service)
	if err != nil {
		return nil, err
	}
	// add ingress rule
	err = m.k8s.AddIngressRule(ingressName, resources.ingressRule)
	if err != nil {
		return nil, err
	}
	// add instance id to user attributes
	err = m.auth.AddAttributeToUser(token, "instance_id", []string{id})
	if err != nil {
		return nil, err
	}
	instance := &Instance{
		ID:  id,
		URL: resources.url,
	}
	return instance, nil
}

func (m *manager) StartInstance(token string) (*Instance, error) {
	// check to ensure the user has an instance associated with them
	user, err := m.auth.GetUser(token)
	if err != nil {
		return nil, errors.New("could not retrieve user for the provided token")
	}
	instanceAttribute := user.Attributes["instance_id"]
	if instanceAttribute == nil {
		return nil, errors.New("user does not have a registered instance")
	}
	instanceID := instanceAttribute[0]
	resources, err := makeCoderK8sResources(instanceID)
	if err != nil {
		return nil, err
	}
	err = m.k8s.AddDeployment(resources.deployment)
	if err != nil {
		return nil, err
	}
	// health check?
	return &Instance{
		ID:  instanceID,
		URL: resources.url,
	}, nil
}

func (m *manager) StopInstance(token string) error {
	// check to ensure the user has an instance associated with them
	user, err := m.auth.GetUser(token)
	if err != nil {
		return errors.New("could not retrieve user for the provided token")
	}
	instanceAttribute := user.Attributes["instance_id"]
	if instanceAttribute == nil {
		return errors.New("user does not have a registered instance")
	}
	instanceID := instanceAttribute[0]
	resources, err := makeCoderK8sResources(instanceID)
	if err != nil {
		return err
	}
	err = m.k8s.RemoveDeployment(resources.deployment)
	if err != nil {
		return err
	}
	// health check?
	return nil
}

func (m *manager) RemoveInstance(token string) error {
	// check to ensure the user has an instance associated with them
	user, err := m.auth.GetUser(token)
	if err != nil {
		return errors.New("could not retrieve user for the provided token")
	}
	instanceAttribute := user.Attributes["instance_id"]
	if instanceAttribute == nil {
		return errors.New("user does not have a registered instance")
	}
	instanceID := instanceAttribute[0]
	resources, err := makeCoderK8sResources(instanceID)
	if err != nil {
		return err
	}
	// remove persistent volume claim
	err = m.k8s.RemovePersistentVolumeClaim(resources.projectPVC)
	if err != nil {
		return err
	}
	// remove ingress rule
	err = m.k8s.RemoveIngressRule(ingressName, resources.ingressRule)
	if err != nil {
		return err
	}
	// remove service
	err = m.k8s.RemoveService(resources.service)
	if err != nil {
		// TODO - Make this part of a honeycomb event
		fmt.Println(fmt.Sprintf("error occured while removing service - %s", err.Error()))
	}
	// remove deployment
	err = m.k8s.RemoveDeployment(resources.deployment)
	if err != nil {
		// TODO - Make this part of a honeycomb event
		fmt.Println(fmt.Sprintf("error occured while removing deployment - %s", err.Error()))
	}
	// remove CNAME record
	err = m.dns.DeleteCNAMERecord(resources.cname)
	if err != nil {
		return err
	}
	return nil
}

type coderK8sResources struct {
	projectPVC  *apiv1.PersistentVolumeClaim
	deployment  *appsv1.Deployment
	service     *apiv1.Service
	ingressRule v1beta1.IngressRule

	projectPVCName string
	serviceName    string
	deploymentName string
	cname          string
	url            string
}

func makeCoderK8sResources(id string) (*coderK8sResources, error) {
	cname := fmt.Sprintf(cnameFormatter, id)
	url := fmt.Sprintf(urlFormatter, id)
	pvcName := fmt.Sprintf("coder-%s-project-data", id)
	svcName := fmt.Sprintf("coder-%s-service", id)
	deploymentName := fmt.Sprintf("coder-%s", id)
	hostName := fmt.Sprintf(dnsNameFormatter, id)
	projectPVC, err := makeProjectPVC(pvcName)
	if err != nil {
		return nil, err
	}
	svc := makeCoderService(svcName, deploymentName)
	ingressRule := makeCoderIngressRule(hostName, svcName)
	deployment := makeCoderDeployment(deploymentName, pvcName)
	return &coderK8sResources{
		projectPVC:     projectPVC,
		deployment:     deployment,
		service:        svc,
		ingressRule:    ingressRule,
		projectPVCName: pvcName,
		serviceName:    svcName,
		deploymentName: deploymentName,
		cname:          cname,
		url:            url,
	}, nil
}

func makeProjectPVC(name string) (*apiv1.PersistentVolumeClaim, error) {
	quantity, err := resource.ParseQuantity("1Gi")
	if err != nil {
		return nil, err
	}
	projectPVC := &apiv1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
		},
		Spec: apiv1.PersistentVolumeClaimSpec{
			AccessModes: []apiv1.PersistentVolumeAccessMode{
				apiv1.ReadWriteOnce,
			},
			Resources: apiv1.ResourceRequirements{
				Requests: apiv1.ResourceList{
					apiv1.ResourceStorage: quantity,
				},
			},
		},
		Status: apiv1.PersistentVolumeClaimStatus{},
	}
	return projectPVC, nil
}

func makeCoderService(svcName, deploymentName string) *apiv1.Service {
	svc := &apiv1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: svcName,
		},
		Spec: apiv1.ServiceSpec{
			Selector: map[string]string{
				"app": deploymentName,
			},
			Ports: []apiv1.ServicePort{
				{
					Port: servicePort,
				},
			},
		},
	}
	return svc
}

func makeCoderIngressRule(hostName, serviceName string) v1beta1.IngressRule {
	rule := v1beta1.IngressRule{
		Host: hostName,
		IngressRuleValue: v1beta1.IngressRuleValue{
			HTTP: &v1beta1.HTTPIngressRuleValue{
				Paths: []v1beta1.HTTPIngressPath{
					{
						Path: "/",
						Backend: v1beta1.IngressBackend{
							ServiceName: serviceName,
							ServicePort: intstr.IntOrString{
								IntVal: int32(servicePort),
							},
						},
					},
				},
			},
		},
	}
	return rule
}

func makeCoderDeployment(deploymentName, projectPVCName string) *appsv1.Deployment {
	return &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: deploymentName,
			Labels: map[string]string{
				"app":  deploymentName,
				"tier": "backend",
			},
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: int32Ptr(1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": deploymentName,
				},
			},
			Template: apiv1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Name: deploymentName,
					Labels: map[string]string{
						"app": deploymentName,
					},
				},
				Spec: apiv1.PodSpec{
					RestartPolicy: apiv1.RestartPolicyAlways,
					// default definitions for user permissions and mounting volumes inspired by
					// https://github.com/spring-projects/sts4/blob/master/theia-extensions/k8s-app-old/deploy.yml
					SecurityContext: &apiv1.PodSecurityContext{
						RunAsUser: int64Ptr(0),
					},
					NodeSelector: map[string]string{
						"coder": "true",
					},
					Containers: []apiv1.Container{
						{
							Name:  deploymentName,
							Image: containerImageName,
							Ports: []apiv1.ContainerPort{
								{
									Name:          "http",
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: servicePort,
								},
							},
							VolumeMounts: []apiv1.VolumeMount{
								{
									Name:      projectPVCName,
									MountPath: "/home/project",
								},
							},
						},
					},
					Volumes: []apiv1.Volume{
						{
							Name: projectPVCName,
							VolumeSource: apiv1.VolumeSource{
								PersistentVolumeClaim: &apiv1.PersistentVolumeClaimVolumeSource{
									ClaimName: projectPVCName,
								},
							},
						},
					},
				},
			},
		},
	}
}

func int32Ptr(i int32) *int32 { return &i }
func int64Ptr(i int64) *int64 { return &i }
