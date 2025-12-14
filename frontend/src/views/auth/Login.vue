<template>
  <div class="min-h-screen flex">
    <!-- 좌측 영역 (브랜드) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
      <div class="max-w-md text-white">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span class="text-blue-600 font-bold text-xl">U</span>
          </div>
          <h2 class="text-2xl font-bold">Uniwave Pro</h2>
        </div>
        <h1 class="text-4xl font-bold leading-tight mb-6">
          Experience<br>
          Modern Practicum<br>
          Management
        </h1>
        <p class="text-blue-100 text-lg leading-relaxed">
          대학·기관·학생을 연결하는<br>
          차세대 실습 관리 플랫폼
        </p>
        <div class="mt-12 text-sm text-blue-200">
          © 2025 Uniwave Pro. All rights reserved.
        </div>
      </div>
    </div>

    <!-- 우측 영역 (로그인 폼) -->
    <div class="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <div class="max-w-md w-full">
        <!-- 헤더 -->
        <div class="text-center mb-8">
          <div class="lg:hidden flex justify-center mb-4">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">U</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">환영합니다</h1>
          <p class="text-gray-600">서비스 이용을 위해 먼저 선택해주세요</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 역할 선택 카드 -->
          <div class="space-y-3">
            <button
              v-for="role in roles"
              :key="role.value"
              type="button"
              @click="form.role = role.value"
              :class="[
                'w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left',
                form.role === role.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              ]"
            >
              <div :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                form.role === role.value ? 'bg-blue-100' : 'bg-gray-100'
              ]">
                <component :is="role.icon" :class="[
                  'w-6 h-6',
                  form.role === role.value ? 'text-blue-600' : 'text-gray-600'
                ]" />
              </div>
              <div class="flex-1">
                <div :class="[
                  'font-semibold text-base',
                  form.role === role.value ? 'text-blue-900' : 'text-gray-900'
                ]">{{ role.label }}</div>
                <div :class="[
                  'text-sm',
                  form.role === role.value ? 'text-blue-700' : 'text-gray-500'
                ]">{{ role.description }}</div>
              </div>
              <div v-if="form.role === role.value" class="flex-shrink-0">
                <CheckCircleIcon class="w-6 h-6 text-blue-600" />
              </div>
            </button>
          </div>

          <!-- 이메일 -->
          <div v-if="form.role">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="example@university.ac.kr"
              class="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- 비밀번호 -->
          <div v-if="form.role">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="block w-full px-4 py-3 pr-11 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- 추가 옵션 -->
          <div v-if="form.role" class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span class="ml-2 text-gray-600">로그인 상태 유지</span>
            </label>
            <button
              type="button"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              비밀번호 찾기
            </button>
          </div>

          <!-- 에러 메시지 -->
          <div
            v-if="authStore.error"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-start gap-3">
              <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-red-800">로그인 실패</p>
                <p class="text-sm text-red-700 mt-1">{{ authStore.error }}</p>
              </div>
            </div>
          </div>

          <!-- 로그인 버튼 -->
          <button
            v-if="form.role"
            type="submit"
            :disabled="authStore.isLoading || !form.email || !form.password"
            class="w-full bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!authStore.isLoading">로그인</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>로그인 중...</span>
            </span>
          </button>
        </form>

        <!-- 회원가입 링크 -->
        <div v-if="form.role" class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            아직 계정이 없으신가요?
            <router-link
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              회원가입
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AcademicCapIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  UserIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const roles = [
  { 
    value: 'STUDENT', 
    label: 'Student', 
    description: '학생용',
    icon: UserIcon 
  },
  { 
    value: 'UNIVERSITY', 
    label: 'Administrator', 
    description: '대학 관리자용',
    icon: BuildingLibraryIcon 
  },
  { 
    value: 'INSTITUTION', 
    label: 'Institution', 
    description: '실습 기관용',
    icon: BuildingOfficeIcon 
  }
]

const form = reactive({
  role: '',
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const rememberMe = ref(false)

const validateForm = (): boolean => {
  errors.value = {
    email: '',
    password: ''
  }

  let isValid = true

  if (!form.email) {
    errors.value.email = '이메일을 입력해주세요'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = '올바른 이메일 형식이 아닙니다'
    isValid = false
  }

  if (!form.password) {
    errors.value.password = '비밀번호를 입력해주세요'
    isValid = false
  } else if (form.password.length < 6) {
    errors.value.password = '비밀번호는 최소 6자 이상이어야 합니다'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    // 임시: 폼 검증만 통과하면 바로 로그인 성공 처리
    // 백엔드 연동 시 authStore.login() 사용
    
    // 임시 사용자 데이터 설정
    authStore.user = {
      id: '1',
      email: form.email,
      role: form.role,
      name: '테스트 사용자',
      createdAt: new Date().toISOString()
    }
    authStore.token = 'temp-token-' + Date.now()
    
    if (rememberMe.value) {
      localStorage.setItem('auth_token', authStore.token)
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }

    // 역할에 따라 리다이렉트
    const role = form.role.toLowerCase()
    router.push(`/${role}/dashboard`)
  } catch (error) {
    console.error('로그인 실패:', error)
  }
}
</script>

<style scoped>
/* 심플한 스타일 - 불필요한 애니메이션 제거 */
</style>
