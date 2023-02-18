import Vue from 'vue'
import Router from 'vue-router'

import personal from '../views/PersonalView.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component: () => import('../views/News/recomend.vue')
    },
    {
      path: '/adminLogin',
      component: () => import('../components/home/adminLogin.vue')
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue')
    },

    {
      path: '/audit',
      component: () => import('../views/AuditorView.vue')
    },
    {
      path: '/personal',
      component: personal,
      children: [
        {
          path: '/personal/profile',
          component: ()=>import('../components/personal/Profile.vue')
        },
        {
          path: '/personal/news',
          component: ()=>import('../components/personal/News.vue')
        },
        {
          path: '/personal/draft',
          component: ()=>import('../components/personal/Draft.vue')
        },
        {
          path: '/personal/editor',
          component: ()=>import('../components/personal/EditorNews.vue')
        },
        {
          path: '/notice',
          component: () => import('../components/notice/notice.vue')
        },
      ]
    },
    {
      path: '/register',
      component: () => import('../components/home/Register.vue')
    },
    {
      // path: '/admin',
      // component: () => import('../components/home/adminLogin.vue'),
      path: '/admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: '/admin/auditorslist',
          component: ()=>import('../components/admin/AuditorsList.vue')
        },
        {
          path: '/admin/userslist',
          component: ()=>import('../components/admin/UsersList.vue')
        },
        {
          path: '/admin/banlist',
          component: ()=>import('../components/admin/BanUsersList.vue')
        }

      ]
      // children: [
      //   {
      //     path: '/admin/profile',
      //     component: ()=>import('../components/personal/Profile.vue')
      //   },
      //   {
      //     path: '/admin/news',
      //     component: ()=>import('../components/personal/News.vue')
      //   }
      // ]
    },
    {
      path: '/detail/:id',
      component: () => import('../views/News/detail.vue')
    },
    {
      path: '/search/:type/:info',
      component: () => import('../views/News/search.vue')
    },
    {
      path: '/user/:id',
      component: () => import('../views/News/user.vue')
    },
    {
      path: '/forget',
      component: () => import('../components/home/Forget.vue')
    },
  ]
})
