import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''
const LoginEndpoint = "/api/login"

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    login: (credentials) => http.post(LoginEndpoint, credentials)
}

export default api