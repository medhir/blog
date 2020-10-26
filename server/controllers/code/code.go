package code

import (
	"context"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v5"
	"github.com/sethvargo/go-password/password"
	"gitlab.com/medhir/blog/server/controllers/auth"
	"gitlab.com/medhir/blog/server/controllers/code/dns"
	"gitlab.com/medhir/blog/server/controllers/code/k8s"
	appsv1 "k8s.io/api/apps/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

const (
	ingressName            = "code"
	servicePort            = 8080
	containerImageName     = "gcr.io/blog-121419/ide-go:1.0"
	reviewHostName         = "review.medhir.com"
	productionHostName     = "medhir.com"
	cnameFormatter         = "code-%s"
	reviewURLFormatter     = "https://review.medhir.com/code-%s/"
	productionURLFormatter = "https://medhir.com/code-%s/"
	pathFormatter          = "/code-%s(/|$)(.*)"
	reviewEnv              = "review"
	productionEnv          = "production"
)

// InstanceAttributeKey is the key that stores a user's password for an IDE deployment
const InstanceAttributeKey = "instance_password"

// Manager describes the methods for managing coder instances, given a user token
type Manager interface {
	SetInstance(user *gocloak.User, pvcName string) (*Instance, error)
	RemoveInstance(user *gocloak.User) error

	CreatePVC(name, size string) error
	DeletePVC(name string) error
}

type manager struct {
	dns  dns.Manager
	k8s  k8s.Manager
	auth auth.Auth
	env  string
}

// NewManager instantiates a new coder manager
func NewManager(ctx context.Context, auth auth.Auth, env string) (Manager, error) {
	var dev bool
	if env == reviewEnv || env == productionEnv {
		dev = false
	} else {
		dev = true
	}
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
		env:  env,
	}, nil
}

// Instance describes properties of a code instance
type Instance struct {
	URL      string `json:"url"`
	Password string `json:"password"`
}

func (m *manager) SetInstance(user *gocloak.User, pvcName string) (*Instance, error) {
	// attempt to get password
	idePassword, err := m.auth.GetUserAttribute(user, InstanceAttributeKey)
	if err != nil {
		// if no instance password is attached to the user, generate a new one
		idePassword, err = password.Generate(24, 9, 8, false, false)
		if err != nil {
			return nil, err
		}
		err = m.auth.AddUserAttribute(user, InstanceAttributeKey, idePassword)
		if err != nil {
			return nil, err
		}
	}
	resources, err := makeCodeK8sResources(*user.Username, m.env, pvcName, idePassword)
	if err != nil {
		return nil, err
	}
	deployment, err := m.k8s.GetDeployment(resources.deploymentName)
	if err != nil {
		// deployment doesn't exist
		err := m.k8s.AddDeployment(resources.deployment)
		if err != nil {
			return nil, err
		}
		err = m.k8s.AddService(resources.service)
		if err != nil {
			return nil, err
		}
		err = m.k8s.AddIngressRule(ingressName, resources.ingressRule)
		if err != nil {
			return nil, err
		}
	} else {
		// deployment does exist, so check to see if pvc is already bound
		if deployment.Spec.Template.Spec.Volumes[0].Name != pvcName {
			// if the pvc is already bound, do nothing
			return &Instance{
				URL: resources.url,
			}, nil
		}
		// otherwise, update the deployment with the new pvc
		err := m.k8s.UpdateDeployment(resources.deployment)
		if err != nil {
			return nil, err
		}
	}
	return &Instance{
		URL:      resources.url,
		Password: idePassword,
	}, nil
}

func (m *manager) RemoveInstance(user *gocloak.User) error {
	username := *user.Username
	svcName := fmt.Sprintf("code-%s-service", username)
	deploymentName := fmt.Sprintf("code-%s", username)
	var ingressRule v1beta1.IngressRule
	if m.env == reviewEnv {
		ingressRule = makeCodeIngressRule(reviewHostName, svcName, username)
	} else {
		ingressRule = makeCodeIngressRule(productionHostName, svcName, username)
	}
	err := m.k8s.RemoveIngressRule(ingressName, ingressRule)
	if err != nil {
		return err
	}
	err = m.k8s.RemoveService(svcName)
	if err != nil {
		return err
	}
	err = m.k8s.RemoveDeployment(deploymentName)
	if err != nil {
		return err
	}
	err = m.auth.RemoveUserAttribute(user, InstanceAttributeKey)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) CreatePVC(name, size string) error {
	pvc, err := getPVC(name, size)
	if err != nil {
		return err
	}
	err = m.k8s.AddPersistentVolumeClaim(pvc)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) DeletePVC(name string) error {
	err := m.k8s.RemovePersistentVolumeClaim(name)
	if err != nil {
		return err
	}
	return nil
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

func makeCodeK8sResources(username, env, pvcName, password string) (*coderK8sResources, error) {
	cname := fmt.Sprintf(cnameFormatter, username)
	var url string
	if env == reviewEnv {
		url = fmt.Sprintf(reviewURLFormatter, username)
	} else {
		url = fmt.Sprintf(productionURLFormatter, username)
	}
	svcName := fmt.Sprintf("code-%s-service", username)
	deploymentName := fmt.Sprintf("code-%s", username)
	svc := makeCoderService(svcName, deploymentName)
	var ingressRule v1beta1.IngressRule
	if env == reviewEnv {
		ingressRule = makeCodeIngressRule(reviewHostName, svcName, username)
	} else {
		ingressRule = makeCodeIngressRule(productionHostName, svcName, username)
	}
	deployment := makeCodeDeployment(deploymentName, pvcName, password)
	return &coderK8sResources{
		deployment:     deployment,
		service:        svc,
		ingressRule:    ingressRule,
		serviceName:    svcName,
		deploymentName: deploymentName,
		cname:          cname,
		url:            url,
	}, nil
}

func getPVC(name, size string) (*apiv1.PersistentVolumeClaim, error) {
	quantity, err := resource.ParseQuantity(size)
	if err != nil {
		return nil, err
	}
	pvc := &apiv1.PersistentVolumeClaim{
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
	return pvc, nil
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

func pathTypePtr(pathType v1beta1.PathType) *v1beta1.PathType {
	p := pathType
	return &p
}

func makeCodeIngressRule(hostName, serviceName, username string) v1beta1.IngressRule {
	rule := v1beta1.IngressRule{
		Host: hostName,
		IngressRuleValue: v1beta1.IngressRuleValue{
			HTTP: &v1beta1.HTTPIngressRuleValue{
				Paths: []v1beta1.HTTPIngressPath{
					{
						Path:     fmt.Sprintf(pathFormatter, username),
						PathType: pathTypePtr(v1beta1.PathTypePrefix),
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

func makeCodeDeployment(deploymentName, pvcName, password string) *appsv1.Deployment {
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
					SecurityContext: &apiv1.PodSecurityContext{
						RunAsUser:  int64Ptr(1000),
						RunAsGroup: int64Ptr(3000),
						FSGroup:    int64Ptr(2000),
					},
					NodeSelector: map[string]string{
						"coder": "true",
					},
					Containers: []apiv1.Container{
						{
							Name:  deploymentName,
							Image: containerImageName,
							Args:  []string{"--auth", "password"},
							Ports: []apiv1.ContainerPort{
								{
									Name:          "http",
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: servicePort,
								},
							},
							Env: []apiv1.EnvVar{
								{
									Name:  "PASSWORD",
									Value: password,
								},
							},
							VolumeMounts: []apiv1.VolumeMount{
								{
									Name:      pvcName,
									SubPath:   "project",
									MountPath: "/home/coder/project",
								},
								{
									Name:      pvcName,
									SubPath:   "settings",
									MountPath: "/home/coder/.local/share/code-server",
								},
							},
						},
					},
					Volumes: []apiv1.Volume{
						{
							Name: pvcName,
							VolumeSource: apiv1.VolumeSource{
								PersistentVolumeClaim: &apiv1.PersistentVolumeClaimVolumeSource{
									ClaimName: pvcName,
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
