import http from '../../Utils/http'

const api = {
    getPosts: () => http.get('/api/blog/posts'),
    getPost: id => http.get(`/api/blog/post?id=${ id }`), 
    publishPost: data => http.post('/api/blog/post', data), 
    updatePost: data => http.put('/api/blog/post', data)
}

export default api