import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式
import './assets/css/global.css'
//导入插件
import './plugin/element'
import './plugin/view'
import 'view-design/dist/styles/iview.css';
//导入Vuex
import store from './store/index'
//导入国际化
import i18n from './assets/lang/index'
//导入图标库
import './assets/fonts/iconfont.css'
//全局组件
import breadcrumb from './components/common/breadcrumb.vue'
//导入编辑器
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入font-awesome
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false
Vue.component('breadcrumb',breadcrumb)
Vue.component('quill-editor',quillEditor)
Vue.filter('formdate',function(val){
    let date=new Date(val)
    let y=date.getFullYear()
    let m=(date.getMonth()+1).toString().padStart(2,'0')
    let d=date.getDate().toString().padStart(2,'0')
    let h=date.getHours().toString().padStart(2,'0')
    let mi=date.getMinutes().toString().padStart(2,'0')
    let s=date.getSeconds().toString().padStart(2,'0')
    return `${y}-${m}-${d} ${h}:${mi}:${s}`
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
