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
//导入主题


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
