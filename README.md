A personal blog engine written in Go and React. 

## Architecture 
The back-end is written in Go. The main driver is `application.go`. The files are broken out into different functionalities under package `api`. Examples of functions include
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
Make sure you are in the local `blog` working directory. Then, run the following command in your terminal: 

```sh
make blog
```

This command builds client assets and starts the Go server, and is set up to allow for testing on both desktop and mobile. 
