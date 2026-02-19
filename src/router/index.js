import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomePageView.vue'
import AboutView from '@/views/AboutUsView.vue'
import OtherPostView from '@/views/OtherPostView.vue'
import LoginPageView from '@/views/LoginPageView.vue'
import RegisterPageView from '@/views/RegisterPageView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import PostDetailView from '@/views/PostDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/other-posts',
      name: 'other-posts',
      component: OtherPostView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetailView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        requiresAuth: true,
      },
    },

    {
      path: '/login',
      name: 'login',
      component: LoginPageView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPageView,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
      meta: {
        requiresAuth: false,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const session = localStorage.getItem('blogday.session')
    if (session) {
      next()
    } else {
      next('/unauthorized')
    }
  } else {
    next()
  }
})

export default router
