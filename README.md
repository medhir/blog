A blog engine written in Go and React. 

# Architecture 
The back-end is written in Go. The main driver is `application.go`. The files are broken out into different functionalities under package `api`. Examples of functions include
- Image Processing / Uploading
- Authentication
- A blog editing REST API
- Static HTML templating (coming soon)

The front-end is in React / ES6 Javascript. There are a few high-level folders for organization of components by purpose:
- **Auth** is for all relevant logic pertaining to authentication initiation and verification
- **Components** define areas of the site driven by more complex UI logic, may require state. (e.g. a Markdown editor)
- **Controls** are actionable elements. These include inputs, forms, and buttons.
- **Layout** defines the high-level layout of the entire web page.
