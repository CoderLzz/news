import axios from '../index'

async function getMenu(){
    let data=await axios.get('privates/menu')
    return data.data
}

async function getAllRole(){
    let data=await axios.get('privates/role')
    return data.data
}

async function putRoleById(id,selectValue){
    let data=await axios.put(`privates/role/${id}`,selectValue)
    return data.data
}
async function getAllRights(){
    let data=await axios.get('privates/rights')
    return data.data
}
async function putRoleRights(roleId,rightsList){
    let data=await axios.put(`privates/role/${roleId}/rights`,rightsList)
    return data.data
}
async function postAddRole(params){
    let data=await axios.post('privates/role',params)
    return data.data
}

export {
    getMenu,
    getAllRole,
    putRoleById,
    getAllRights,
    putRoleRights,
    postAddRole
}