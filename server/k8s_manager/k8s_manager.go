package k8s_manager

import (
	"context"
	v1 "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	v1meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

type K8sManager interface {
	UpdateIngress(rules []v1beta1.IngressRule) error
	AddDefaultIngressRule(host, serviceName, servicePort string) error
}

type k8sManager struct {
	ctx       context.Context
	clientset *kubernetes.Clientset
}

func NewK8sManager(ctx context.Context) (K8sManager, error) {
	config, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &k8sManager{
		ctx:       ctx,
		clientset: clientset,
	}, nil
}

func (k *k8sManager) UpdateIngress(rules []v1beta1.IngressRule) error {
	ingress, err := k.clientset.
		ExtensionsV1beta1().
		Ingresses(v1.NamespaceDefault).
		Get("ingress", v1meta.GetOptions{})
	if err != nil {
		return err
	}
	ingress.Spec.Rules = append(ingress.Spec.Rules, rules...)
	_, err = k.clientset.
		ExtensionsV1beta1().
		Ingresses(v1.NamespaceDefault).
		Update(ingress)
	if err != nil {
		return err
	}
	return nil
}

func (k *k8sManager) AddDefaultIngressRule(host, serviceName, servicePort string) error {
	rule := v1beta1.IngressRule{
		Host: host,
		IngressRuleValue: v1beta1.IngressRuleValue{
			HTTP: &v1beta1.HTTPIngressRuleValue{
				Paths: []v1beta1.HTTPIngressPath{
					{
						Path: "/",
						Backend: v1beta1.IngressBackend{
							ServiceName: serviceName,
							ServicePort: intstr.IntOrString{
								StrVal: servicePort,
							},
						},
					},
				},
			},
		},
	}
	err := k.UpdateIngress([]v1beta1.IngressRule{rule})
	if err != nil {
		return err
	}
	return nil
}
