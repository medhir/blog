import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

// let BaseURL: string
// if (process.env.NEXT_PUBLIC_APP_URL) {
//   BaseURL = process.env.NEXT_PUBLIC_APP_URL
// } else {
//   BaseURL = 'http://medhir:9000'
// }

const a = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://medhir:9000',
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
  Delete: (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    return a.delete(url, config)
  },
}

export const Protected = {
  Client: {
    Get: async (url: string, config?: AxiosRequestConfig) => {
      config = config || {}
      config.withCredentials = true
      try {
        const getResponse = await a.get(url, config)
        return getResponse
      } catch (err) {
        await a.get('jwt/refresh', config)
        const getResponseAfterRefresh = await a.get(url, config)
        return getResponseAfterRefresh
      }
    },
    Post: async (url: string, data: any, config?: AxiosRequestConfig) => {
      config = config || {}
      config.withCredentials = true
      try {
        const postResponse = await a.post(url, data, config)
        return postResponse
      } catch (err) {
        await a.get('jwt/refresh', config)
        const postResponseAfterRefresh = await a.post(url, data, config)
        return postResponseAfterRefresh
      }
    },
    Patch: async (url: string, data: any, config?: AxiosRequestConfig) => {
      config = config || {}
      config.withCredentials = true
      try {
        const patchResponse = await a.patch(url, data, config)
        return patchResponse
      } catch (err) {
        await a.get('jwt/refresh', config)
        const patchResponseAfterRefresh = await a.patch(url, data, config)
        return patchResponseAfterRefresh
      }
    },
    Delete: async (url: string, config?: AxiosRequestConfig) => {
      config = config || {}
      config.withCredentials = true
      try {
        const deleteResponse = await a.delete(url, config)
        return deleteResponse
      } catch (err) {
        await a.get('jwt/refresh', config)
        const deleteResponseAfterRefresh = await a.delete(url, config)
        return deleteResponseAfterRefresh
      }
    },
  },
  Server: {},
}

export default http
