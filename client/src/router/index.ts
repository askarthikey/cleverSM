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
        name: 'Root',
        component: StartPage, // Default route for non-authenticated users
        meta: { requiresAuth: false }
      },
      {
        path: '/home',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: true }
      },
      {
        path: '/start',
        name: 'StartPage',
        component: StartPage,
        meta: { requiresAuth: false }
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: SignUpPage,
        meta: { requiresAuth: false, redirectIfAuth: true }
      },
      {
        path: '/signin',
        name: 'SignIn',
        component: SignInPage,
        meta: { requiresAuth: false, redirectIfAuth: true }
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
        component: () => import('../pages/Connect.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/profile/:userId?',
        name: 'Profile',
        component: () => import('../pages/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../pages/Settings.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  // Catch-all route for undefined paths
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Enhanced navigation guard with authentication logic
router.beforeEach((to, from, next) => {
  // Check both localStorage and sessionStorage for auth data
  const hasToken = !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'))
  const hasUser = !!(localStorage.getItem('user') || sessionStorage.getItem('user'))
  const isAuthenticated = hasToken && hasUser
  
  console.log('🧭 Navigation:', { 
    from: from.path, 
    to: to.path,
    isAuthenticated,
    requiresAuth: to.meta.requiresAuth,
    redirectIfAuth: to.meta.redirectIfAuth
  })

  // If route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('🔒 Access denied - redirecting to signin')
    next({
      path: '/signin',
      query: { returnTo: to.fullPath } // Save the intended destination
    })
    return
  }

  // If user is authenticated and trying to access auth pages (signin/signup)
  if (to.meta.redirectIfAuth && isAuthenticated) {
    console.log('✅ Already authenticated - redirecting to home')
    next('/home')
    return
  }

  // If user is authenticated and trying to access root, redirect to home
  if (to.path === '/' && isAuthenticated) {
    console.log('✅ Authenticated user accessing root - redirecting to home')
    next('/home')
    return
  }

  // Allow navigation
  next()
})

export default router