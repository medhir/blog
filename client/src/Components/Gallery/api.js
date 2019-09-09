import http from 'Utils/http'

const api = {
  getAlbums: () => http.get('/api/albums/'),
  getPhotos: album => http.get(`/api/photos?album=${album}`),
}

export default api
