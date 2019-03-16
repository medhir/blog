import axios from 'axios';

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    getAlbums: () => http.get('/api/albums/'),
    getPhotos: (album) => http.get(`/api/photos?album=${ album }`)
}

export default api;