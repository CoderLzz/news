import axios from '../index'

async function putPassword(id,params){
    let data=await axios.put(`privates/user/${id}/password`,params)
    return data.data
}

export {
    putPassword
}