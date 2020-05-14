package k8s

import (
	"context"
	"flag"
	"github.com/jetstack/cert-manager/pkg/client/clientset/versioned"
	v1 "k8s.io/api/apps/v1"
	v1core "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	v1meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"os"
	"path/filepath"

	// This loads the required GCP auth provider to connect to k8s outside the cluster.
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
)

const (
	defaultNamespace = "default"
	istioNamespace   = "istio-system"
)

// Manager describes the actions that can be taken against the kubernetes cluster
type Manager interface {
	AddIngressRule(ingressName string, rule v1beta1.IngressRule) error
	RemoveIngressRule(ingressName string, rule v1beta1.IngressRule) error

	AddDeployment(deployment *v1.Deployment) error
	RemoveDeployment(deployment *v1.Deployment) error

	AddPersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error
	RemovePersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error

	AddService(svc *v1core.Service) error
	RemoveService(svc *v1core.Service) error

	AddDNSNamesToCert(certName string, dnsNames []string) error
	RemoveDNSNameFromCert(certName, dnsName string) error
}

type manager struct {
	ctx           context.Context
	clientset     *kubernetes.Clientset
	certClientset *versioned.Clientset
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
	certClientset, err := versioned.NewForConfig(config)
	if err != nil {
		return nil, err
	}
	return &manager{
		ctx:           ctx,
		clientset:     clientset,
		certClientset: certClientset,
	}, nil
}

func (m *manager) AddIngressRule(ingressName string, rule v1beta1.IngressRule) error {
	ingress, err := m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Get(m.ctx, ingressName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	ingress.Spec.Rules = append(ingress.Spec.Rules, rule)
	_, err = m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Update(m.ctx, ingress, v1meta.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemoveIngressRule(ingressName string, rule v1beta1.IngressRule) error {
	ingress, err := m.clientset.
		ExtensionsV1beta1().
		Ingresses(defaultNamespace).
		Get(m.ctx, ingressName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	updatedRules := []v1beta1.IngressRule{}
	for _, oldRule := range ingress.Spec.Rules {
		if oldRule.Host != rule.Host {
			updatedRules = append(updatedRules, oldRule)
		}
	}
	ingress.Spec.Rules = updatedRules
	_, err = m.clientset.ExtensionsV1beta1().Ingresses(defaultNamespace).Update(m.ctx, ingress, v1meta.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddDeployment(deployment *v1.Deployment) error {
	_, err := m.clientset.AppsV1().Deployments(defaultNamespace).Create(m.ctx, deployment, v1meta.CreateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemoveDeployment(deployment *v1.Deployment) error {
	err := m.clientset.AppsV1().Deployments(defaultNamespace).Delete(m.ctx, deployment.Name, v1meta.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddPersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error {
	_, err := m.clientset.CoreV1().PersistentVolumeClaims(defaultNamespace).Create(m.ctx, pvc, v1meta.CreateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemovePersistentVolumeClaim(pvc *v1core.PersistentVolumeClaim) error {
	err := m.clientset.CoreV1().PersistentVolumeClaims(defaultNamespace).Delete(m.ctx, pvc.Name, v1meta.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddService(svc *v1core.Service) error {
	_, err := m.clientset.CoreV1().Services(defaultNamespace).Create(m.ctx, svc, v1meta.CreateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemoveService(svc *v1core.Service) error {
	err := m.clientset.CoreV1().Services(defaultNamespace).Delete(m.ctx, svc.Name, v1meta.DeleteOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) AddDNSNamesToCert(certName string, dnsNames []string) error {
	cert, err := m.certClientset.
		CertmanagerV1alpha2().
		Certificates(istioNamespace).
		Get(m.ctx, certName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	cert.Spec.DNSNames = append(cert.Spec.DNSNames, dnsNames...)
	_, err = m.certClientset.
		CertmanagerV1alpha2().
		Certificates(istioNamespace).
		Update(m.ctx, cert, v1meta.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}

func (m *manager) RemoveDNSNameFromCert(certName, dnsName string) error {
	cert, err := m.certClientset.
		CertmanagerV1alpha2().
		Certificates(istioNamespace).
		Get(m.ctx, certName, v1meta.GetOptions{})
	if err != nil {
		return err
	}
	updatedDNSNames := []string{}
	for _, name := range cert.Spec.DNSNames {
		if name != dnsName {
			updatedDNSNames = append(updatedDNSNames, name)
		}
	}
	cert.Spec.DNSNames = updatedDNSNames
	_, err = m.certClientset.
		CertmanagerV1alpha2().
		Certificates(istioNamespace).
		Update(m.ctx, cert, v1meta.UpdateOptions{})
	if err != nil {
		return err
	}
	return nil
}
