import http from '../Utils/http'

const LoginEndpoint = '/api/login'
const ValidateEndpoint = '/api/jwt/validate'

const api = {
    login: (credentials) => http.post(LoginEndpoint, credentials),
    validate: (cfg) => http.get(ValidateEndpoint, cfg)
}

export default api