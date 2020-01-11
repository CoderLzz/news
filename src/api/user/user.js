import axios from 'axios'

async function getUser(params){
    let data=await axios.get('privates/user',{
        params
    })
    return data.data
}

async function putUserById(id,params,flag){
    let data=await axios.put(`privates/user/${id}`,{params,flag})
    return data.data
}

async function getUserById(id){
    let data=await axios.get(`privates/user/${id}`)
    return data.data
}

async function deleteUserById(id){
    let data=await axios.delete(`privates/user/${id}`)
    return data.data
}


export {
    getUser,
    putUserById,
    getUserById,
    deleteUserById
}