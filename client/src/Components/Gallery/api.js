import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8000'
});

const api = {
    getAlbums: () => http.get('/api/albums/'),
    getPhotos: (album) => http.get(`/api/photos/${ album }`)
}

export default api;