import axios from '../index'

async function deleteCover(params){
    let data=await axios.delete('privates/cover',{
        params:{
            coverPath:params
        }
    })
    return data.data
}

export {
    deleteCover
}