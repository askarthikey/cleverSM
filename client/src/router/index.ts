import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '../components/RootLayout.vue'
import StartPage from '../pages/StartPage.vue'
import HomePage from '../pages/Home.vue'
import SignUpPage from '../pages/Signup.vue'
import SignInPage from '../pages/Signin.vue'
import CreatePostPage from '../pages/Create.vue'

const routes = [
  {
    path: '/',
    component: RootLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage
      },
      {
        path: '/start',
        name: 'StartPage',
        component: StartPage
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: SignUpPage
      },
      {
        path: '/signin',
        name: 'SignIn',
        component: SignInPage
      },
      {
        path: '/create',
        name: 'Create',
        component: CreatePostPage,
        meta: { requiresAuth: true }
      },
      {
        path: '/connect',
        name: 'Connect',
        component: () => import('../pages/Connect.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Add global navigation guard for debugging
router.beforeEach((to, from, next) => {
  console.log('🧭 Navigation:', { 
    from: from.path, 
    to: to.path,
    hasToken: !!localStorage.getItem('auth_token'),
    hasUser: !!localStorage.getItem('user')
  })
  next()
})

export default router