import axios from '../index'

async function loginNews(params){
    let data=await axios.post('login',params)
    return data.data
}

export {
    loginNews
}