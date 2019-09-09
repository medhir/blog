import axios from 'axios'

let BaseURL = process.env.REACT_APP_DEBUG_HOST || ''

if (process.env.REACT_APP_MOBILE_TEST) {
  BaseURL = ''
}

const http = axios.create({
  baseURL: BaseURL,
})

export default http
