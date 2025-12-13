<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- 로고 및 헤더 -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <AcademicCapIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Uniwave Pro
        </h1>
        <p class="text-gray-600">
          대학 실습 관리 플랫폼
        </p>
      </div>

      <!-- 로그인 카드 -->
      <Card>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- 역할 선택 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              로그인 유형 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="role in roles"
                :key="role.value"
                type="button"
                @click="form.role = role.value"
                :class="[
                  'px-4 py-3 border rounded-lg text-sm font-medium transition-all',
                  form.role === role.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                ]"
              >
                {{ role.label }}
              </button>
            </div>
          </div>

          <!-- 이메일 -->
          <Input
            id="email"
            v-model="form.email"
            type="email"
            label="이메일"
            placeholder="example@university.ac.kr"
            required
            :error="errors.email"
            :icon-left="EnvelopeIcon"
          />

          <!-- 비밀번호 -->
          <Input
            id="password"
            v-model="form.password"
            type="password"
            label="비밀번호"
            placeholder="••••••••"
            required
            :error="errors.password"
            :icon-left="LockClosedIcon"
          />

          <!-- 에러 메시지 -->
          <div
            v-if="authStore.error"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center gap-2 text-sm text-red-800">
              <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
              <span>{{ authStore.error }}</span>
            </div>
          </div>

          <!-- 로그인 버튼 -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.isLoading"
            full-width
          >
            로그인
          </Button>
        </form>

        <!-- 회원가입 링크 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            계정이 없으신가요?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              회원가입
            </router-link>
          </p>
        </div>
      </Card>

      <!-- 푸터 -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          © 2025 Uniwave Pro. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Card from '@/components/common/Card.vue'
import {
  AcademicCapIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const roles = [
  { value: 'STUDENT', label: '학생' },
  { value: 'INSTITUTION', label: '기관' },
  { value: 'UNIVERSITY', label: '대학' }
]

const form = reactive({
  role: 'STUDENT',
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

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
    
    localStorage.setItem('auth_token', authStore.token)
    localStorage.setItem('user', JSON.stringify(authStore.user))

    // 역할에 따라 리다이렉트
    const role = form.role.toLowerCase()
    router.push(`/${role}/dashboard`)
  } catch (error) {
    console.error('로그인 실패:', error)
  }
}
</script>
