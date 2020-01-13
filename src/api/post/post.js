import axios from '../index'

async function addPost(params){
    let data=await axios.post('privates/post',params)
    return data.data
}
async function getAllPost(params){
    let data=await axios.get('privates/post',{
        params:params
    })
    return data.data
}

async function getPostById(id){
    let data=await axios.get(`privates/post/${id}`)
    return data.data
}

export {
    addPost,
    getAllPost,
    getPostById
}