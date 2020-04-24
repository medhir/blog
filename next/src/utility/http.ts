import fetch from 'node-fetch'

const http = {
  Get: (url: string): Promise<Response> => {
    return fetch(url)
  },
}

export default http
