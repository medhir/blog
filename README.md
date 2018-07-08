A simple blog service written in Go and React. 

# Architecture 
The back-end is literally one file, `application.go`. This file can handle serving of static assets (CSS, JS, etc) as well as some API endpoints for interacting with the back-end service.

The front-end is entirely written in React (for now). There are a few high-level folders for organization of components by purpose:
- **Auth** is for all relevant logic pertaining to authentication initiation and verification
- **Components** define areas of the site driven by more complex UI logic, may require state. (e.g. a Markdown editor)
- **Controls** are actionable elements. These include inputs, forms, and buttons.
- **Layout** defines the high-level layout of the entire web page.

# To Do 
- Consider whether use of a templating system is even worth it 
- **TASTS**
- Makefile for build step (Go + React) -> Serve to single port 
