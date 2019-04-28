import http from '../../Utils/http'

const api = {
    getDraft: (id, cfg) => http.get(`/api/blog/draft/${ id }`, cfg),
    saveDraft: (draft, cfg) => http.put(`/api/blog/draft/${ draft.id }`, draft, cfg),
    publish: (blogPost, cfg) => http.post(`/api/blog/post/${ blogPost.titlePath }`, blogPost, cfg)
}

export default api