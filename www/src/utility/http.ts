import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

let BaseURL: string
if (process.env.ENV === 'production') {
  BaseURL = 'https://api.medhir.com'
} else if (process.env.ENV === 'review') {
  BaseURL = 'https://api-review.medhir.com'
} else {
  BaseURL = 'http://localhost:9000'
}

const a = axios.create({
  baseURL: BaseURL,
})

const http = {
  Get: (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return a.get(url, config)
  },
  Post: (
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    return a.post(url, data, config)
  },
  Patch: (
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    return a.patch(url, data, config)
  },
}

export default http
