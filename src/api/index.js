import axios from 'axios'
import nprogress from 'nprogress'

axios.defaults.baseURL='http://localhost/'
axios.interceptors.request.use((config)=>{
    nprogress.start()
    config.headers.Authorization=window.localStorage.getItem('token')
    return config
})

axios.interceptors.response.use(data=>{
    nprogress.done()
    return data
})

export default axios