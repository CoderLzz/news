import axios from '../index'

async function getAllCate(){
    let data=await axios.get('privates/categories')
    return data.data
}

export {
    getAllCate
}