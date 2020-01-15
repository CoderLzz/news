import axios from '../index'

async function getSetting(){
    let data=await axios.get('privates/web')
    return data.data
}

async function putSetting(id,params){
    let data=await axios.put(`privates/web/${id}`,params)
    return data.data
}

export {
    getSetting,
    putSetting
}