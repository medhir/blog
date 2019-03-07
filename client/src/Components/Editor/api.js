import axios from 'axios'

const BaseURL = process.env.REACT_APP_DEBUG_HOST || ''
const http = axios.create({
    baseURL: BaseURL
})

const api = {
    getDraft: (id) => http.get(`/api/blog/draft?id=${ id }`),
    newDraft: (draft) => http.put(`/api/blog/draft?id=${ draft.id }`, draft),
    saveDraft: (draft) => http.post(`/api/blog/draft?id=${ draft.id }`, draft),
    publish: (blogPost) => http.post(`/api/blog/post?id=${ blogPost.id }`, blogPost)
}

export default api