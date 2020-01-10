import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal=new VuexPersistence({
    storage:window.localStorage
})

export default new Vuex.Store({
    state:{
        avatar:'',
        themeColor:'',
        themeName:'',
        username:'',
        userId:''
    },
    mutations:{
        init(state,option){
            state.avatar=option
        },
        initTheme(state,option){
            state.themeColor=option
        },
        initThemeName(state,option){
            state.themeName=option
        },
        initusername(state,option){
            state.username=option
        },
        initUserId(state,option){
            state.userId=option
        }
    },
    plugins:[vuexLocal.plugin]
})