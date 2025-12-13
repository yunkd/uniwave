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
        },
        {
          path: 'attendance/check',
          name: 'StudentAttendanceCheck',
          component: () => import('@/views/student/attendance/Check.vue')
        },
        {
          path: 'attendance/history',
          name: 'StudentAttendanceHistory',
          component: () => import('@/views/student/attendance/History.vue')
        },
        {
          path: 'institution-search',
          name: 'StudentInstitutionSearch',
          component: () => import('@/views/student/InstitutionSearch.vue')
        },
        {
          path: 'institution-status',
          name: 'StudentInstitutionStatus',
          component: () => import('@/views/student/InstitutionStatus.vue')
        },
        {
          path: 'journal/write',
          name: 'StudentJournalWrite',
          component: () => import('@/views/student/journal/Write.vue')
        },
        {
          path: 'journal/list',
          name: 'StudentJournalList',
          component: () => import('@/views/student/journal/List.vue')
        },
        {
          path: 'journal/:id',
          name: 'StudentJournalDetail',
          component: () => import('@/views/student/journal/Detail.vue')
        },
        {
          path: 'documents',
          name: 'StudentDocuments',
          component: () => import('@/views/student/documents/List.vue')
        },
        {
          path: 'documents/upload',
          name: 'StudentDocumentsUpload',
          component: () => import('@/views/student/documents/Upload.vue')
        },
        {
          path: 'report/write',
          name: 'StudentReportWrite',
          component: () => import('@/views/student/report/Write.vue')
        },
        {
          path: 'binding',
          name: 'StudentBinding',
          component: () => import('@/views/student/binding/Create.vue')
        },
        {
          path: 'binding/history',
          name: 'StudentBindingHistory',
          component: () => import('@/views/student/binding/History.vue')
        },
        {
          path: 'notices',
          name: 'StudentNotices',
          component: () => import('@/views/student/notices/List.vue')
        },
        {
          path: 'notices/:id',
          name: 'StudentNoticeDetail',
          component: () => import('@/views/student/notices/Detail.vue')
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
        },
        {
          path: 'students',
          name: 'InstitutionStudents',
          component: () => import('@/views/institution/students/List.vue')
        },
        {
          path: 'students/:id',
          name: 'InstitutionStudentDetail',
          component: () => import('@/views/institution/students/Detail.vue')
        },
        {
          path: 'attendance',
          name: 'InstitutionAttendance',
          component: () => import('@/views/institution/attendance/List.vue')
        },
        {
          path: 'journal-approval',
          name: 'InstitutionJournalApproval',
          component: () => import('@/views/institution/journal/Approval.vue')
        },
        {
          path: 'evaluation/create',
          name: 'InstitutionEvaluationCreate',
          component: () => import('@/views/institution/evaluation/Create.vue')
        },
        {
          path: 'certificate/create',
          name: 'InstitutionCertificateCreate',
          component: () => import('@/views/institution/certificate/Create.vue')
        },
        {
          path: 'documents',
          name: 'InstitutionDocuments',
          component: () => import('@/views/institution/documents/List.vue')
        },
        {
          path: 'notices',
          name: 'InstitutionNotices',
          component: () => import('@/views/institution/notices/List.vue')
        },
        {
          path: 'notices/:id',
          name: 'InstitutionNoticeDetail',
          component: () => import('@/views/institution/notices/Detail.vue')
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
        },
        {
          path: 'notices',
          name: 'UniversityNotices',
          component: () => import('@/views/university/notices/List.vue')
        },
        {
          path: 'notices/create',
          name: 'UniversityNoticeCreate',
          component: () => import('@/views/university/notices/Create.vue')
        },
        {
          path: 'notices/:id',
          name: 'UniversityNoticeDetail',
          component: () => import('@/views/university/notices/Detail.vue')
        },
        {
          path: 'notices/:id/edit',
          name: 'UniversityNoticeEdit',
          component: () => import('@/views/university/notices/Edit.vue')
        },
        {
          path: 'statistics',
          name: 'UniversityStatistics',
          component: () => import('@/views/university/Statistics.vue')
        },
        {
          path: 'institutions',
          name: 'UniversityInstitutions',
          component: () => import('@/views/university/institutions/List.vue')
        },
        {
          path: 'institutions/:id',
          name: 'UniversityInstitutionDetail',
          component: () => import('@/views/university/institutions/Detail.vue')
        },
        {
          path: 'students',
          name: 'UniversityStudents',
          component: () => import('@/views/university/students/List.vue')
        },
        {
          path: 'students/:id',
          name: 'UniversityStudentDetail',
          component: () => import('@/views/university/students/Detail.vue')
        },
        {
          path: 'templates',
          name: 'UniversityTemplates',
          component: () => import('@/views/university/templates/List.vue')
        },
        {
          path: 'settings',
          name: 'UniversitySettings',
          component: () => import('@/views/university/Settings.vue')
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
