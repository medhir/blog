import axios from 'axios'

// eslint-disable-next-line no-undef
let BaseURL = process.env.REACT_APP_DEBUG_HOST || ''

// eslint-disable-next-line no-undef
if (process.env.REACT_APP_MOBILE_TEST) {
  BaseURL = ''
}

const http = axios.create({
  baseURL: BaseURL,
})

export default http
