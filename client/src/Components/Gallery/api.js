import axios from 'axios';

const http = axios.create({
    baseURL: ''
});

const api = {
    getAlbums: () => http.get('/api/albums/'),
    getPhotos: (album) => http.get(`/api/photos?album=${ album }`)
}

export default api;