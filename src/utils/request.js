import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 15000
})
service.interceptors.request.use(
  config => {
    config.headers.token = '123456789'
    console.log(config)
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    console.log(response)
    if (response.data.retCode === 10000) {
      return response
    } else {
      Message({
        message: response.data.retMsg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    // return response
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
