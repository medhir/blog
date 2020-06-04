# blog 

Personal blogging engine (among other things) written in Go and Typescript.

## Architecture

The application is hosted as a set of loosely coupled microservices running on containers managed by Google's Kubernetes engine.

- `server` contains the logic that drives the back-end API layer (`api.medhir.com`)
    - `auth` authenticates / authorizes access to API resources
    - `blog` contains code that drives my personal blog
    - `handlers` contains the "glue" for exposing the API over HTTP
    - `code` provisions & manages kubernetes-hosted IDEs 
    - `instance` contains logic for starting an instance of the server
    - `storage` contains interfaces for interacting with application data stores
- `www` contains front-end application views and serves HTML driven by server-rendered React components (`medhir.com`)

## Set up / Installation

The Go server connects to a postgres database for certain application operations. 
For local development, you can initialize the database by running:

```shell script
make init-db
```

You will be prompted to enter a password for the `postgres` user, to which you should enter `docker`.

The local database can be accessed using the following command: 
```shell script
psql -h localhost -U postgres -d postgres
```

## Running Locally

At the repository root, run the following command to start the Go server in your terminal:

```shell script
make server
```

The front-end is a Node server that uses the Next.js framework. To start it, run  

```shell script
make www
```

## Connecting to the GKE Cluster

[Write some things here about how to connect to GKE]


### Useful Kubernetes commands: 

Provide a shell into a pod
```sh
kubectl exec -it <pod-name> -- sh
```

## Database Migrations

Changes to the database should be managed through .sql migrations. To create a new migration, run the following command at the 
directory root:
 
```shell script
make migration name=<migration_name>
```

There will be two new migration files located at `server/storage/sql/migrations`. The `up` file moves the database forward a version,
and `down` moves the database back a version.

The Go server will automatically migrate the database up to the most recent version once the migration file is present. 