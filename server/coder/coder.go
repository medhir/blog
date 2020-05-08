package coder

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"gitlab.medhir.com/medhir/blog/server/k8s"
	appsv1 "k8s.io/api/apps/v1"
	apiv1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type Manager interface {
	AddInstance() (string, error)
}

type manager struct {
	k8s k8s.Manager
}

func NewManager(ctx context.Context) (Manager, error) {
	k8sManager, err := k8s.NewManager(ctx)
	if err != nil {
		return nil, err
	}
	return &manager{
		k8s: k8sManager,
	}, nil
}

func (m *manager) AddInstance() (string, error) {
	id := uuid.New().String()
	// add persistent volume claims
	sharedPVC, err := makeSharedPVC(id)
	if err != nil {
		return "", err
	}
	err = m.k8s.AddPersistentVolumeClaim(sharedPVC)
	if err != nil {
		return "", err
	}
	projectPVC, err := makeProjectPVC(id)
	if err != nil {
		return "", err
	}
	err = m.k8s.AddPersistentVolumeClaim(projectPVC)
	if err != nil {
		return "", err
	}
	// add service
	svc := makeCoderService(id)
	err = m.k8s.AddService(svc)
	if err != nil {
		return "", nil
	}
	// add ingress rule
	pathName := "/" + id
	svcName := fmt.Sprintf("coder-%s-service", id)
	err = m.k8s.AddDefaultIngressRule("code.medhir.com", pathName, svcName, "8080")
	if err != nil {
		return "", err
	}
	// add deployment
	deployment := makeCoderDeployment(id)
	err = m.k8s.AddDeployment(deployment)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("https://code.medhir.com/%s", id), nil
}

func makeSharedPVC(id string) (*apiv1.PersistentVolumeClaim, error) {
	pvcName := fmt.Sprintf("coder-%s-shared-data", id)
	quantity, err := resource.ParseQuantity("5Gi")
	if err != nil {
		return nil, err
	}
	sharedPVC := &apiv1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name: pvcName,
		},
		Spec: apiv1.PersistentVolumeClaimSpec{
			AccessModes: []apiv1.PersistentVolumeAccessMode{
				apiv1.ReadWriteOnce,
			},
			Resources: apiv1.ResourceRequirements{
				Requests: apiv1.ResourceList{
					apiv1.ResourceRequestsStorage: quantity,
				},
			},
		},
		Status: apiv1.PersistentVolumeClaimStatus{},
	}
	return sharedPVC, nil
}

func makeProjectPVC(id string) (*apiv1.PersistentVolumeClaim, error) {
	pvcName := fmt.Sprintf("coder-%s-project-data", id)
	quantity, err := resource.ParseQuantity("1Gi")
	if err != nil {
		return nil, err
	}
	sharedPVC := &apiv1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name: pvcName,
		},
		Spec: apiv1.PersistentVolumeClaimSpec{
			AccessModes: []apiv1.PersistentVolumeAccessMode{
				apiv1.ReadWriteOnce,
			},
			Resources: apiv1.ResourceRequirements{
				Requests: apiv1.ResourceList{
					apiv1.ResourceRequestsStorage: quantity,
				},
			},
		},
		Status: apiv1.PersistentVolumeClaimStatus{},
	}
	return sharedPVC, nil
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
					Port: 8080,
				},
			},
		},
	}
	return svc
}

func makeCoderDeployment(id string) *appsv1.Deployment {
	deploymentName := fmt.Sprintf("coder-%s", id)
	sharedPVCName := fmt.Sprintf("coder-%s-shared-data", id)
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
							Image: "codercom/code-server:v2",
							Ports: []apiv1.ContainerPort{
								{
									Name:          "http",
									Protocol:      apiv1.ProtocolTCP,
									ContainerPort: 8080,
								},
							},
							VolumeMounts: []apiv1.VolumeMount{
								{
									Name:      sharedPVCName,
									MountPath: "/home/coder/.local/share/code-server",
								},
								{
									Name:      projectPVCName,
									MountPath: "/home/coder/project",
								},
							},
						},
					},
					Volumes: []apiv1.Volume{
						{
							Name: sharedPVCName,
							VolumeSource: apiv1.VolumeSource{
								PersistentVolumeClaim: &apiv1.PersistentVolumeClaimVolumeSource{
									ClaimName: sharedPVCName,
								},
							},
						},
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
