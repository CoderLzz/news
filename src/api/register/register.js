import axios from '../index'

async function registerNews(params){
    let data=await axios.post('/register',params)
    return data.data
}

export {
    registerNews
}