A personal blog engine / portfolio website written in Go and React.

## Architecture

The application is hosted as a set of loosely coupled microservices running on containers managed by Google's Kubernetes engine.

![Blog GKE Architecture](https://user-images.githubusercontent.com/5160860/71450587-67f50d00-2719-11ea-9720-f06b52be52c2.png)
The entrypoint for the blog application is through a Go web service. The files are broken out into different functionalities under package `api`. (Refactor in progress) Examples of functions include

- Image Processing / Uploading
- Authentication
- A blog editing REST API
- Static HTML template-driven endpoints

The front-end is written with Javascript and makes use of the Create React App framework. There are a few high-level folders for organization of components by purpose:

- **Auth** is for all relevant logic pertaining to authentication initiation and verification
- **Components** define areas of the site driven by more complex UI logic, may require state. (e.g. a Markdown editor)
- **Controls** are actionable elements. These include inputs, forms, and buttons.
- **Layout** defines the high-level layout of the entire web page.

## Running Locally

At the repository root, run the following command in your terminal:

```sh
make blog
```

This command builds client assets and starts the Go server. To hot-reload the React client as a separate process, run

```sh
make webapp
```

## Deploying with `kubectl`

- insert info here on how to authenticate into the cluster with kubectl 

The blog will be run with GKE, Google's managed kubernetes controller. Deployments can be created, scaled up, torn down, and more with the `kubectl` command. 

### To run a blog deployment
- Only run this against the latest version of master!
- Build & push the docker image using the command `make image version=<version_number>`
- Update `kubernetes/blog.yml`'s `image` field to the latest image
- Run `kubectl apply -f kubernetes/blog.yml` to configure the deployment to use the latest image
- Submit a PR with the new image name to check in the changes to the source code


### Useful commands: 

Provide a shell into a pod
```sh
kubectl exec -it <pod-name> -- sh
```

## FusionAuth

FusionAuth provides authentication for the site and its APIs. The default is to have one "instance" running at a time (as a set of coordinated deployments for the auth service, elasticsearch, and the db). It is given relatively low resource constraints since it's literally just me using it lol. 

To deploy FusionAuth, modify the `kubernetes/fusionauth/` resource definitions and then run: 
```sh
kubectl apply --recursive -f kubernetes/fusionauth/volume-claims
kubectl apply --recursive -f kubernetes/fusionauth/deployments
kubectl apply --recursive -f kubernetes/fusionauth/services
```
