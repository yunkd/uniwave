import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { requiresAuth: false }
    },
    
    // 학생 라우트
    {
      path: '/student',
      component: () => import('@/views/student/Layout.vue'),
      meta: { requiresAuth: true, role: 'STUDENT' },
      children: [
        {
          path: '',
          redirect: '/student/dashboard'
        },
        {
          path: 'dashboard',
          name: 'StudentDashboard',
          component: () => import('@/views/student/Dashboard.vue')
        }
      ]
    },
    
    // 기관 라우트
    {
      path: '/institution',
      component: () => import('@/views/institution/Layout.vue'),
      meta: { requiresAuth: true, role: 'INSTITUTION' },
      children: [
        {
          path: '',
          redirect: '/institution/dashboard'
        },
        {
          path: 'dashboard',
          name: 'InstitutionDashboard',
          component: () => import('@/views/institution/Dashboard.vue')
        }
      ]
    },
    
    // 대학 라우트
    {
      path: '/university',
      component: () => import('@/views/university/Layout.vue'),
      meta: { requiresAuth: true, role: 'UNIVERSITY' },
      children: [
        {
          path: '',
          redirect: '/university/dashboard'
        },
        {
          path: 'dashboard',
          name: 'UniversityDashboard',
          component: () => import('@/views/university/Dashboard.vue')
        }
      ]
    },
    
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.meta.role as string | undefined

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 로그인 필요
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (requiredRole && authStore.userRole !== requiredRole) {
      // 권한 없음
      console.error('접근 권한이 없습니다')
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    // 로그인된 상태에서 로그인 페이지 접근 시 대시보드로 리다이렉트
    if (to.name === 'Login' && authStore.isAuthenticated) {
      const role = authStore.userRole?.toLowerCase()
      next({ path: `/${role}/dashboard` })
    } else {
      next()
    }
  }
})

export default router
