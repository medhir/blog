import http from '../../Utils/http'

const UploadPath = '/api/upload/'

const api = {
  upload: (data, cfg) => http.post(UploadPath, data, cfg),
}

export default api
