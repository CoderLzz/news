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
        userId:'',
        activeId:'',
        role:'',
        rights:[]
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
        },
        initActive(state,option){
            state.activeId=option
        },
        initRole(state,option){
            state.role=option
        },
        initRights(state,option){
            state.rights=option
        }
    },
    plugins:[vuexLocal.plugin]
})