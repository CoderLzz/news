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

async function putPostById(id,params,flag){
    let data=await axios.put(`privates/post/${id}`,{
        params,
        flag
    })
    return data.data
}

async function deleteOnePost(id){
    let data=await axios.delete(`privates/post/${id}`)
    return data.data
}

async function getScreen(cate,state,params){
    let data=await axios.get(`privates/post/${cate}/${state}`,{
        params
    })
    return data.data
}

export {
    addPost,
    getAllPost,
    getPostById,
    putPostById,
    deleteOnePost,
    getScreen
}