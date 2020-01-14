import axios from '../index'

async function getAllComment(params){
    let data=await axios.get('privates/comment',{
        params
    })
    return data.data
}

async function getCommentById(id){
    let data=await axios.get(`privates/comment/${id}`)
    return data.data
}

async function putCommentById(id,content){
    let data=await axios.put(`privates/comment/${id}`,{
        content
    })
    return data.data
}

async function deleteCommentById(id){
    let data=await axios.delete(`privates/comment/${id}`)
    return data.data
}

export {
    getAllComment,
    getCommentById,
    putCommentById,
    deleteCommentById
}