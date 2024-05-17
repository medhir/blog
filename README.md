# blog 

Personal blogging engine written in Go and Typescript.

## architecture

The application is hosted as a set of containers deployed on Google Cloud Run.

- `server` contains the logic that drives the back-end API layer (`api.medhir.com`)
    - `auth` authenticates / authorizes access to API resources
    - `blog` contains code that drives my personal blog
    - `handlers` contains the "glue" for exposing the API over HTTP
    - `instance` contains logic for starting an instance of the server
    - `storage` contains interfaces for interacting with application data stores
- `www` contains front-end application views and serves HTML driven by server-rendered React components (`medhir.com`)
- `keycloak` is the authentication / authorization server (`auth.medhir.com`)

## local development 
the project uses Docker Compose to run containers for the front-end, api server, keycloak, and postgres locally.  

### initial setup
make the docker containers accessible through a named host by running the following commands in your shell: 

```shell
sudo nano /etc/hosts
```
then add the following lines to the bottom of the file: 

```shell
# Local Blog Development
127.0.0.1 medhir
```

close out of the text editor and then run the following command to clear the local DNS cache: 
```shell
sudo killall -HUP mDNSResponder
```

### spinning up containers
once the host setup is complete, spinning up the project is done like so: 
```shell
docker-compose up 
```
once the images are completely built, they will run and be accessible at the following: 

- front-end: `http://medhir:3000`
- server: `http://medhir:9000`
- keycloak: `http://medhir:8080`
- postgres: `http://medhir:5423`

the `www` and `server` containers are both set up to **hot reload** whenever changes are made under their respective directories. 

## database migrations
Changes to the database should be managed through .sql migrations. To create a new migration, run the following command at the 
directory root:
 
```shell script
make migration name=<migration_name>
```

There will be two new migration files located at `server/storage/sql/migrations`. The `up` file moves the database forward a version,
and `down` moves the database back a version.

The Go server will automatically migrate the database up to the most recent version once the migration file is present. 
