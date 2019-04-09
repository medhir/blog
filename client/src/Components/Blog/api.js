import http from '../../Utils/http'

const api = {
    getPosts: () => http.get('/api/blog/posts'),
    getPost: title => http.get(`/api/blog/post/${ title }`), 
    publishPost: data => http.post('/api/blog/post', data), 
    updatePost: data => http.put('/api/blog/post', data)
}

export default api