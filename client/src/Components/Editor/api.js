import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''

const http = axios.create({
    baseURL: BaseURL
})

const api = {
    getDraft: id => http.get(`/api/blog/draft?id=${ id }`),
    postDraft: draft => http.post('/api/blog/draft', draft),
    saveDraft: draft => http.put('/api/blog/draft', draft),
    publish: blogPost => http.post('/api/blog/post', blogPost)
}

export default api