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


