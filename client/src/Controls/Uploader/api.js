import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''
const UploadPath = "/api/upload/"

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    upload: (data, cfg) => http.post(UploadPath, data, cfg)
}

export default api