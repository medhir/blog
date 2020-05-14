package coder

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"gitlab.medhir.com/medhir/blog/server/dns"
	"gitlab.medhir.com/medhir/blog/server/k8s"
	appsv1 "k8s.io/api/apps/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"time"
)

const (
	ingressName        = "istio"
	servicePort        = 3000
	certName           = "ingress-cert"
	containerImageName = "theiaide/theia-go:latest"
	dnsNameFormatter   = "code-%s.medhir.com"
	cnameFormatter     = "code-%s"
	urlFormatter       = "https://code-%s.medhir.com"
)

// Manager describes the methods for managing coder instances
type Manager interface {
	AddInstance() (*Instance, error)
	RemoveInstance(id string) error
}

type manager struct {
	dns dns.Manager
	k8s k8s.Manager
}

// NewManager instantiates a new coder manager
func NewManager(ctx context.Context, dev bool) (Manager, error) {
	k8sManager, err := k8s.NewManager(ctx, dev)
	if err != nil {
		return nil, err
	}
	dnsManager, err := dns.NewManager()
	if err != nil {
		return nil, err
	}
	return &manager{
		dns: dnsManager,
		k8s: k8sManager,
	}, nil
}

// Instance describes properties of a coder instance
type Instance struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

func (m *manager) AddInstance() (*Instance, error) {
	id := uuid.New().String()
	// add DNS record
	err := m.dns.AddCNAMERecord(fmt.Sprintf(cnameFormatter, id))
	if err != nil {
		return nil, err
	}
	time.Sleep(2 * time.Second)
	resources, err := makeCoderK8sResources(id)
	if err != nil {
		return nil, err
	}
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
	// add certificate
	err = m.k8s.AddDNSNamesToCert(certName, []string{fmt.Sprintf(dnsNameFormatter, id)})
	// add ingress rule
	err = m.k8s.AddIngressRule(ingressName, resources.ingressRule)
	if err != nil {
		return nil, err
	}
	// add deployment
	err = m.k8s.AddDeployment(resources.deployment)
	if err != nil {
		return nil, err
	}
	instance := &Instance{
		ID:  id,
		URL: fmt.Sprintf(urlFormatter, id),
	}
	return instance, nil
}

func (m *manager) RemoveInstance(id string) error {
	resources, err := makeCoderK8sResources(id)
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
	err = m.dns.DeleteCNAMERecord(fmt.Sprintf(cnameFormatter, id))
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
}

func makeCoderK8sResources(id string) (*coderK8sResources, error) {
	projectPVC, err := makeProjectPVC(id)
	if err != nil {
		return nil, err
	}
	svc := makeCoderService(id)
	ingressRule := makeCoderIngressRule(id)
	deployment := makeCoderDeployment(id)
	return &coderK8sResources{
		projectPVC:  projectPVC,
		deployment:  deployment,
		service:     svc,
		ingressRule: ingressRule,
	}, nil
}

func makeProjectPVC(id string) (*apiv1.PersistentVolumeClaim, error) {
	pvcName := fmt.Sprintf("coder-%s-project-data", id)
	quantity, err := resource.ParseQuantity("1Gi")
	if err != nil {
		return nil, err
	}
	projectPVC := &apiv1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name: pvcName,
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

func makeCoderService(id string) *apiv1.Service {
	svcName := fmt.Sprintf("coder-%s-service", id)
	deploymentName := fmt.Sprintf("coder-%s", id)
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

func makeCoderIngressRule(id string) v1beta1.IngressRule {
	host := fmt.Sprintf(dnsNameFormatter, id)
	serviceName := fmt.Sprintf("coder-%s-service", id)
	rule := v1beta1.IngressRule{
		Host: host,
		IngressRuleValue: v1beta1.IngressRuleValue{
			HTTP: &v1beta1.HTTPIngressRuleValue{
				Paths: []v1beta1.HTTPIngressPath{
					{
						Path: "/.*",
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

func makeCoderDeployment(id string) *appsv1.Deployment {
	deploymentName := fmt.Sprintf("coder-%s", id)
	projectPVCName := fmt.Sprintf("coder-%s-project-data", id)
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
