A personal blog engine / portfolio website written in Go and React.

## Architecture

The entrypoint for the main application is through a Go web service. The files are broken out into different functionalities under package `api`. (Refactor in progress) Examples of functions include

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

Make sure you are in the local `blog` working directory. Before starting the service, a SSL certificate must be generated. On MacOS, with the `openssl` command installed, run the following commands:

```sh
mkdir .tls
openssl genrsa -out .tls/local.key 2048
openssl ecparam -genkey -name secp384r1 -out .tls/local.key
openssl req -new -x509 -sha256 -key .tls/local.key -out .tls/local.crt -days 3650
```

Once you have a self-signed SSL cert locally, run the following command in your terminal:

```sh
make blog
```

This command builds client assets and starts the Go server. To hot-reload the React client, run

```sh
make webapp
```

## Deploying with `kubectl`

- insert info here on how to authenticate into the cluster with kubectl 

The blog will be run with GKE, Google's managed kubernetes controller. Deployments can be created, scaled up, torn down, and more with the `kubectl` command. 

### To run a deployment
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
