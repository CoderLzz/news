import axios from '../index'


async function deleteSwiperPic(params){
    let data=await axios.delete('privates/swiper/pic',{
        params:{
            params
        }
    })
    return data.data
}

async function addOneSwiper(params){
    let data=await axios.post('privates/swiper',params)
    return data.data
}

async function getAllSwiper(){
    let data=await axios.get('privates/swiper')
    return data.data
}

async function deleteSwiperById(id){
    let data=await axios.delete(`privates/swiper/${id}`)
    return data.data
}

export {
    deleteSwiperPic,
    addOneSwiper,
    getAllSwiper,
    deleteSwiperById
}