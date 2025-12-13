<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-2xl w-full">
      <!-- 헤더 -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <AcademicCapIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          회원가입
        </h1>
        <p class="text-gray-600">
          Uniwave Pro에 오신 것을 환영합니다
        </p>
      </div>

      <Card>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- 1단계: 역할 선택 -->
          <div v-if="step === 1">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              가입 유형 선택
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                v-for="roleOption in roles"
                :key="roleOption.value"
                @click="selectRole(roleOption.value)"
                :class="[
                  'p-6 border-2 rounded-lg text-left transition-all duration-200',
                  form.role === roleOption.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <component
                  :is="roleOption.icon"
                  :class="[
                    'w-8 h-8 mb-3',
                    form.role === roleOption.value ? 'text-primary-600' : 'text-gray-400'
                  ]"
                />
                <h4 class="font-semibold text-gray-900 mb-1">
                  {{ roleOption.label }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ roleOption.description }}
                </p>
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              full-width
              class="mt-6"
              :disabled="!form.role"
              @click="step = 2"
            >
              다음
            </Button>
          </div>

          <!-- 2단계: 정보 입력 -->
          <div v-else class="space-y-5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              @click="step = 1"
              :icon-left="ArrowLeftIcon"
            >
              이전
            </Button>

            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ getRoleLabel(form.role) }} 정보 입력
            </h3>

            <!-- 공통 필드: 이메일, 비밀번호 -->
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

            <Input
              id="password"
              v-model="form.password"
              type="password"
              label="비밀번호"
              placeholder="최소 8자 이상"
              required
              :error="errors.password"
              :icon-left="LockClosedIcon"
            />

            <Input
              id="passwordConfirm"
              v-model="form.passwordConfirm"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호 재입력"
              required
              :error="errors.passwordConfirm"
              :icon-left="LockClosedIcon"
            />

            <!-- 학생 전용 필드 -->
            <template v-if="form.role === 'STUDENT'">
              <Input
                id="name"
                v-model="form.name"
                type="text"
                label="이름"
                placeholder="홍길동"
                required
                :error="errors.name"
                :icon-left="UserIcon"
              />

              <Input
                id="phone"
                v-model="form.phone"
                type="tel"
                label="연락처"
                placeholder="010-1234-5678"
                required
                :error="errors.phone"
                :icon-left="PhoneIcon"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                  대학 유형 <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.universityType"
                      value="CYBER"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-gray-700">사이버대학</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="form.universityType"
                      value="CREDIT_BANK"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-gray-700">학점은행제</span>
                  </label>
                </div>
              </div>

              <Input
                v-if="form.universityType === 'CYBER'"
                id="studentNumber"
                v-model="form.studentNumber"
                type="text"
                label="학번"
                placeholder="202412345"
                required
                :error="errors.studentNumber"
              />

              <Input
                v-if="form.universityType === 'CREDIT_BANK'"
                id="learnerNumber"
                v-model="form.learnerNumber"
                type="text"
                label="학습자 등록번호"
                placeholder="ABC-1234567"
                required
                :error="errors.learnerNumber"
              />
            </template>

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

            <!-- 회원가입 버튼 -->
            <Button
              type="submit"
              variant="primary"
              size="lg"
              :loading="authStore.isLoading"
              full-width
            >
              가입하기
            </Button>
          </div>
        </form>

        <!-- 로그인 링크 -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            이미 계정이 있으신가요?
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              로그인
            </router-link>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Role, UniversityType } from '@/types'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Card from '@/components/common/Card.vue'
import {
  AcademicCapIcon,
  UserIcon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)

const roles = [
  {
    value: 'STUDENT' as Role,
    label: '학생',
    description: '실습을 진행하는 학생',
    icon: UserIcon
  },
  {
    value: 'INSTITUTION' as Role,
    label: '기관',
    description: '실습 기관 담당자',
    icon: BuildingOfficeIcon
  },
  {
    value: 'UNIVERSITY' as Role,
    label: '대학',
    description: '대학 관리자',
    icon: BuildingLibraryIcon
  }
]

const form = reactive({
  role: '' as Role,
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  phone: '',
  universityType: '' as UniversityType,
  studentNumber: '',
  learnerNumber: ''
})

const errors = ref<Record<string, string>>({})

const selectRole = (role: Role) => {
  form.role = role
}

const getRoleLabel = (role: Role) => {
  const roleData = roles.find(r => r.value === role)
  return roleData?.label || ''
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // 이메일 검증
  if (!form.email) {
    errors.value.email = '이메일을 입력해주세요'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.value.email = '올바른 이메일 형식이 아닙니다'
    isValid = false
  }

  // 비밀번호 검증
  if (!form.password) {
    errors.value.password = '비밀번호를 입력해주세요'
    isValid = false
  } else if (form.password.length < 8) {
    errors.value.password = '비밀번호는 최소 8자 이상이어야 합니다'
    isValid = false
  }

  if (form.password !== form.passwordConfirm) {
    errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다'
    isValid = false
  }

  // 학생 전용 검증
  if (form.role === 'STUDENT') {
    if (!form.name) {
      errors.value.name = '이름을 입력해주세요'
      isValid = false
    }

    if (!form.phone) {
      errors.value.phone = '연락처를 입력해주세요'
      isValid = false
    }

    if (!form.universityType) {
      errors.value.universityType = '대학 유형을 선택해주세요'
      isValid = false
    }

    if (form.universityType === 'CYBER' && !form.studentNumber) {
      errors.value.studentNumber = '학번을 입력해주세요'
      isValid = false
    }

    if (form.universityType === 'CREDIT_BANK' && !form.learnerNumber) {
      errors.value.learnerNumber = '학습자 등록번호를 입력해주세요'
      isValid = false
    }
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    await authStore.register({
      email: form.email,
      password: form.password,
      role: form.role,
      name: form.name,
      phone: form.phone,
      universityType: form.universityType,
      studentNumber: form.studentNumber,
      learnerNumber: form.learnerNumber
    })

    // 회원가입 성공
    alert('회원가입이 완료되었습니다. 로그인해주세요.')
    router.push('/login')
  } catch (error) {
    console.error('회원가입 실패:', error)
  }
}
</script>
