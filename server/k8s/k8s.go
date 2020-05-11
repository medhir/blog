package k8s

import (
	"context"
	"flag"
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	v1meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"os"
	"path/filepath"

	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
)

const (
	defaultNamespace = "default"
	ingressName      = "ingress"
)

// Manager describes the actions that can be taken against the kubernetes cluster
type Manager interface {
	AddDefaultIngressRule(rule v1beta1.IngressRule) error
	RemoveDefaultIngressRule(rule v1beta1.IngressRule) error

	AddDeployment(deployment *v1.Deployment) error
	RemoveDeployment(deployment *v1.Deployment) error

	AddPersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error
	RemovePersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error

	AddService(svc *v1core.Service) error
	RemoveService(svc *v1core.Service) error
}

type manager struct {
	ctx       context.Context
	clientset *kubernetes.Clientset
}

// NewManager initializes a new kubernetes cluster manager
func NewManager(ctx context.Context, dev bool) (Manager, error) {
	var config *rest.Config
	var err error

	// development happens outside of the cluster, so we must pass a kubeconfig file.
	// gcloud stores this by default under $HOME/.kube/config
	if dev {
		kubeconfig := flag.String("kubeconfig", filepath.Join(os.Getenv("HOME"), ".kube", "config"), "absolute path to the kubeconfig file")
		config, err = clientcmd.BuildConfigFromFlags("", *kubeconfig)
		if err != nil {
			return nil, err
		}
	} else {
		config, err = rest.InClusterConfig()
		if err != nil {
			return nil, err
		}
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

func (m *manager) AddDefaultIngressRule(rule v1beta1.IngressRule) error {
	ingress, err := m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Get(ingressName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	ingress.Spec.Rules = append(ingress.Spec.Rules, rule)
	ingress.Spec.TLS[0].Hosts = append(ingress.Spec.TLS[0].Hosts, rule.Host)
	_, err = m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Update(ingress)
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemoveDefaultIngressRule(rule v1beta1.IngressRule) error {
	ingress, err := m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Get(ingressName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	updatedHosts := []string{}
	for _, host := range ingress.Spec.TLS[0].Hosts {
		if host != rule.Host {
			updatedHosts = append(updatedHosts, host)
		}
	}
	updatedRules := []v1beta1.IngressRule{}
	for _, oldRule := range ingress.Spec.Rules {
		if oldRule.Host != rule.Host {
			updatedRules = append(updatedRules, oldRule)
		}
	}
	ingress.Spec.TLS[0].Hosts = updatedHosts
	ingress.Spec.Rules = updatedRules
	_, err = m.clientset.ExtensionsV1beta1().Ingresses(defaultNamespace).Update(ingress)
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

func (m *manager) RemoveDeployment(deployment *v1.Deployment) error {
	err := m.clientset.AppsV1().Deployments(defaultNamespace).Delete(deployment.Name, &v1meta.DeleteOptions{})
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

func (m *manager) RemovePersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error {
	err := m.clientset.CoreV1().PersistentVolumeClaims(defaultNamespace).Delete(pvc.Name, &v1meta.DeleteOptions{})
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

func (m *manager) RemoveService(svc *v1core.Service) error {
	err := m.clientset.CoreV1().Services(defaultNamespace).Delete(svc.Name, &v1meta.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}
