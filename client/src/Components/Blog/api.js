import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    getPosts: () => http.get('/api/blog/posts'),
    getPost: id => http.get(`/api/blog/post?id=${ id }`), 
    publishPost: data => http.post('/api/blog/post', data), 
    updatePost: data => http.put('/api/blog/post', data)
}

export default api