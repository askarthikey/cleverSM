import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '../components/RootLayout.vue'
import StartPage from '../pages/StartPage.vue'
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
        path: '/create-post',
        name: 'CreatePost',
        component: CreatePostPage,
        meta: { requiresAuth: true } // Add auth guard if needed
      },
      {
        path: '/connect',
        name: 'Connect',
        component: () => import('../pages/Connect.vue')
      },
      {
        path: '/create',
        name: 'Create',
        component: () => import('../pages/Create.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router