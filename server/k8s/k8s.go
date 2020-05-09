package k8s

import (
	"context"
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	v1meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

const defaultNamespace = "default"

// Manager describes the actions that can be taken against the kubernetes cluster
type Manager interface {
	UpdateIngress(rules []v1beta1.IngressRule) error
	AddDefaultIngressRule(host, path, serviceName string, servicePort int) error
	AddDeployment(deployment *v1.Deployment) error
	AddPersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error
	AddService(svc *v1core.Service) error
}

type manager struct {
	ctx       context.Context
	clientset *kubernetes.Clientset
}

// NewManager initializes a new kubernetes cluster manager
func NewManager(ctx context.Context) (Manager, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &manager{
		ctx:       ctx,
		clientset: clientset,
	}, nil
}

func (m *manager) UpdateIngress(rules []v1beta1.IngressRule) error {
	ingress, err := m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Get("ingress", v1meta.GetOptions{})
	if err != nil {
		return err
	}
	ingress.Spec.Rules = append(ingress.Spec.Rules, rules...)
	_, err = m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Update(ingress)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddDefaultIngressRule(host, path, serviceName string, servicePort int) error {
	rule := v1beta1.IngressRule{
		Host: host,
		IngressRuleValue: v1beta1.IngressRuleValue{
			HTTP: &v1beta1.HTTPIngressRuleValue{
				Paths: []v1beta1.HTTPIngressPath{
					{
						Path: path,
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
	err := m.UpdateIngress([]v1beta1.IngressRule{rule})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddDeployment(deployment *v1.Deployment) error {
	_, err := m.clientset.AppsV1().Deployments(defaultNamespace).Create(deployment)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddPersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error {
	_, err := m.clientset.CoreV1().PersistentVolumeClaims(defaultNamespace).Create(pvc)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddService(svc *v1core.Service) error {
	_, err := m.clientset.CoreV1().Services(defaultNamespace).Create(svc)
	if err != nil {
		return err
	}
	return nil
}
