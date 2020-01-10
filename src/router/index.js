import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login/login.vue'
import home from '../components/home/home.vue'
import register from '../components/register/register.vue'
import welcome from '../components/home/welcome.vue'
import user from '../components/user/user.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect: '/login'},
  {path:'/login',component:login},
  {path:'/register',component:register},
  {path:'/home',component:home,children:[
    {path:'/welcome',component:welcome},
    {path:'/user',component:user}
  ]}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login'||to.path==='/register') return next()
  const token = window.localStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
