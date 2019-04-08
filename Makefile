build: 
	cd client && npm run build
mobilebuild: 
	cd client && REACT_APP_MOBILE_TEST=true npm run build