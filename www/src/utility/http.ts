import axios, { AxiosResponse } from 'axios'

let BaseURL: string
if (process.env.environment === 'production') {
  BaseURL = 'https://api.medhir.com'
} else {
  BaseURL = 'http://localhost:9000'
}

const a = axios.create({
  baseURL: BaseURL,
})

const http = {
  Get: (url: string): Promise<AxiosResponse> => {
    return a.get(url)
  },
  Post: (url: string, data: any): Promise<AxiosResponse> => {
    return a.post(url, data)
  },
  Patch: (url: string, data: any): Promise<AxiosResponse> => {
    return a.patch(url, data)
  },
}

export default http
