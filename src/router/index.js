import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import login from '../components/login/login.vue'
import home from '../components/home/home.vue'
import register from '../components/register/register.vue'
import welcome from '../components/home/welcome.vue'
import user from '../components/user/user.vue'
import write from '../components/post/write.vue'
import rights from '../components/rights/rights.vue'
import role from '../components/rights/role.vue'
import post from '../components/post/post.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/register',
    component: register
  },
  {
    path: '/home',
    component: home,
    children: [{
        path: '/welcome',
        component: welcome
      },
      {
        path: '/user',
        component: user
      },
      {
        path:'/write',
        component:write
      },
      {
        path:'/rights',
        component:rights
      },
      {
        path:'/role',
        component:role
      },
      {
        path:'/post',
        component:post
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') return next()
  const token = window.localStorage.getItem('token')
  if (!token) return next('/login')
  next()
  if (store.state.role.code == '1') {
    if(to.path=='/post'||to.path=='/write'){
      next()
    }else{
      return next('/login')
    }
  }
})

export default router