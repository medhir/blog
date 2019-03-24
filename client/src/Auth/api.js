import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''
const LoginEndpoint = '/api/login'
const ValidateEndpoint = '/api/jwt/validate'

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    login: (credentials) => http.post(LoginEndpoint, credentials),
    validate: (cfg) => http.get(ValidateEndpoint, cfg)
}

export default api