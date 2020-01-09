import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal=new VuexPersistence({
    storage:window.sessionStorage
})

export default new Vuex.Store({
    state:{
        avatar:'',
    },
    mutations:{
        init(state,option){
            state.avatar=option
        }
    },
    plugins:[vuexLocal.plugin]
})