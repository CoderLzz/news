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
import comment from '../components/comment/comment.vue'
import setCate from '../components/set/setCate.vue'
import setWeb from '../components/set/setWeb.vue'
import setSwiper from '../components/set/setSwiper.vue'

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
        path: '/welcome/welcome',
        component: welcome
      },
      {
        path: '/user/userList',
        component: user
      },
      {
        path:'/post/write',
        component:write
      },
      {
        path:'/rights/rightsList',
        component:rights
      },
      {
        path:'/rights/roleAdmin',
        component:role
      },
      {
        path:'/post/postList',
        component:post
      },
      {
        path:'/comment/commentList',
        component:comment
      },
      {
        path:'/setting/cateilog',
        component:setCate
      },
      {
        path:'/setting/websetting',
        component:setWeb
      },
      {
        path:'/setting/swiper',
        component:setSwiper
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
  let arr=[]
  store.state.rights.forEach(item=>{
    arr.push('/'+item.path.split('/')[1])
  })
  console.log(arr);
  console.log('/'+to.path.split('/')[1]);
  if(arr.includes('/'+to.path.split('/')[1])){
    next()
  }else{
    return next('/login')
  }
})

export default router