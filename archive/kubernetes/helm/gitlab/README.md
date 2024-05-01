# Gitlab Deployment (using Helm)

This directory holds the values that are passed to the Helm chart that deploys Gitlab's microservices onto a GKE cluster. 

## How can I update the deployment?

If configuration changes are necessary, update any values to the `values.yml` file and then run the following commend:

```sh
helm upgrade -f kubernetes/helm/gitlab/values.yml <release_name> gitlab/gitlab
```

## How was it deployed to start with? 

Roughly follows [this guide](https://cloud.google.com/solutions/deploying-production-ready-gitlab-on-gke). 

1. Create a service account in GCP for the helm chart to interact with gcs. 
2. Make the following buckets in GCP:

```sh
gsutil mb gs://blog-121419-gitlab-registry
gsutil mb gs://blog-121419-gitlab-backups
gsutil mb gs://blog-121419-gitlab-artifacts
gsutil mb gs://blog-121419-gitlab-uploads
gsutil mb gs://blog-121419-gitlab-packages
gsutil mb gs://blog-121419-gitlab-pseudo
```

3. Create the relevant secrets passed into the `values.yml`.
4. Install the chart as a named `gitlab` release with the following command:

```sh
helm install -f kubernetes/helm/gitlab/values.yml gitlab gitlab/gitlab --set nodeSelector."cloud\.google\.com/gke-nodepool"=private-gitlab-pool
```