import axios from '../index'

async function addOneCate(params){
    let data=await axios.post('/privates/cate',params)
    return data.data
}

async function getCateById(id){
    let data=await axios.get(`privates/cate/${id}`)
    return data.data
}

async function putCateById(id,params){
    let data=await axios.put(`privates/cate/${id}`,params)
    return data.data
}

async function deletCateById(id){
    let data=await axios.delete(`privates/cate/${id}`)
    return data.data
}

async function deleteManyCate(params){
    let data=await axios.delete(`privates/cate`,{
        params:{
            selectionArr:params
        }
    })
    return data.data
}

export {
    addOneCate,
    getCateById,
    putCateById,
    deletCateById,
    deleteManyCate
}