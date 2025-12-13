<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- 헤더 -->
    <div class="max-w-4xl mx-auto mb-6 sm:mb-8">
      <div class="flex items-center gap-3 mb-4">
        <button
          @click="handleBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">돌아가기</span>
        </button>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">최종보고서 작성</h1>
      <p class="text-sm sm:text-base text-gray-600">대학 양식에 따라 실습 전체 내용을 정리하여 작성하세요</p>
    </div>

    <!-- 작성 폼 -->
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 양식 정보 -->
        <Card class="p-4 sm:p-6 bg-blue-50 border-blue-200">
          <div class="flex items-start gap-3">
            <DocumentTextIcon class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-blue-900 mb-1">{{ template.file_name }}</h3>
              <p class="text-xs text-blue-700">버전: {{ template.version }}</p>
            </div>
          </div>
        </Card>

        <!-- 학생 정보 (자동 입력) -->
        <Card class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">학생 정보</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">학교명</label>
              <input
                type="text"
                :value="studentInfo.university"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">학과</label>
              <input
                type="text"
                :value="studentInfo.major"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">학번</label>
              <input
                type="text"
                :value="studentInfo.student_id"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <input
                type="text"
                :value="studentInfo.name"
                disabled
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </Card>

        <!-- 동적 필드 렌더링 -->
        <Card class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">보고서 내용</h3>
          <div class="space-y-6">
            <div
              v-for="field in template.fields"
              :key="field.name"
              class="relative"
            >
              <!-- 텍스트 입력 -->
              <div v-if="field.type === 'text'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="text"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :maxlength="field.maxLength"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 텍스트 영역 -->
              <div v-else-if="field.type === 'textarea'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData[field.name]"
                  :rows="field.rows || 8"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :maxlength="field.maxLength"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                ></textarea>
                <p v-if="field.maxLength" class="mt-1 text-xs text-gray-500 text-right">
                  {{ (formData[field.name] || '').length }} / {{ field.maxLength }}
                </p>
              </div>

              <!-- 날짜 입력 -->
              <div v-else-if="field.type === 'date'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="date"
                  :required="field.required"
                  :max="today"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 선택 입력 -->
              <div v-else-if="field.type === 'select'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData[field.name]"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">선택하세요</option>
                  <option v-for="option in field.options" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- 숫자 입력 -->
              <div v-else-if="field.type === 'number'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData[field.name]"
                  type="number"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <!-- 시간 입력 -->
              <div v-else-if="field.type === 'time'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData[field.name]"
                  type="time"
                  :required="field.required"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        <!-- 액션 버튼 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            @click="handleSaveDraft"
            :loading="isSavingDraft"
            class="flex-1"
          >
            <DocumentIcon class="w-5 h-5 mr-2" />
            임시저장
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="isSubmitting"
            class="flex-1"
          >
            <PaperAirplaneIcon class="w-5 h-5 mr-2" />
            제출 (PDF 생성)
          </Button>
        </div>

        <!-- 안내 메시지 -->
        <Card class="p-4 bg-yellow-50 border-yellow-200">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-yellow-900">제출 전 확인사항</p>
              <ul class="mt-2 text-xs text-yellow-800 space-y-1">
                <li>• 제출 후 자동으로 PDF가 생성됩니다</li>
                <li>• 생성된 PDF는 "서류 업로드" 메뉴에서 확인 가능합니다</li>
                <li>• 제본 신청 시 해당 PDF가 포함됩니다</li>
              </ul>
            </div>
          </div>
        </Card>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  ChevronLeftIcon,
  DocumentTextIcon,
  DocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 학생 정보 (Mock)
const studentInfo = {
  university: '서울대학교',
  major: '사회복지학과',
  student_id: '2021012345',
  name: '홍길동'
}

// 최종보고서 양식 (Mock - 대학에서 업로드한 양식)
const template = ref({
  file_name: '2024년도 현장실습 최종보고서 양식',
  version: 'v2.0',
  fields: [
    {
      name: 'institution_name',
      label: '실습기관명',
      type: 'text',
      placeholder: '예: 서울종합사회복지관',
      required: true,
      maxLength: 100
    },
    {
      name: 'practice_period',
      label: '실습기간',
      type: 'text',
      placeholder: '예: 2024.01.01 ~ 2024.02.28',
      required: true,
      maxLength: 100
    },
    {
      name: 'practice_summary',
      label: '실습 개요',
      type: 'textarea',
      placeholder: '실습 기관의 개요 및 실습 목적을 작성하세요',
      required: true,
      rows: 5,
      maxLength: 1000
    },
    {
      name: 'practice_content',
      label: '실습 내용',
      type: 'textarea',
      placeholder: '실습 기간 동안 수행한 주요 업무 및 활동 내용을 구체적으로 작성하세요',
      required: true,
      rows: 10,
      maxLength: 3000
    },
    {
      name: 'achievement',
      label: '실습 성과 및 배운 점',
      type: 'textarea',
      placeholder: '실습을 통해 얻은 성과와 배운 점을 작성하세요',
      required: true,
      rows: 8,
      maxLength: 2000
    },
    {
      name: 'improvement',
      label: '개선 및 건의사항',
      type: 'textarea',
      placeholder: '실습 과정에서 느낀 개선점이나 건의사항을 작성하세요',
      required: false,
      rows: 5,
      maxLength: 1000
    },
    {
      name: 'conclusion',
      label: '종합 소감',
      type: 'textarea',
      placeholder: '실습 전체에 대한 종합적인 소감을 작성하세요',
      required: true,
      rows: 6,
      maxLength: 1500
    }
  ]
})

// 폼 데이터
const formData = reactive<Record<string, any>>({})

// 로딩 상태
const isSavingDraft = ref(false)
const isSubmitting = ref(false)

// 오늘 날짜
const today = new Date().toISOString().split('T')[0]

// 로컬스토리지 키
const DRAFT_KEY = 'final_report_draft'

// 컴포넌트 마운트 시 임시저장 데이터 복원
onMounted(() => {
  // 양식의 필드 초기화
  template.value.fields.forEach(field => {
    formData[field.name] = ''
  })

  // 로컬스토리지에서 임시저장 데이터 불러오기
  const savedDraft = localStorage.getItem(DRAFT_KEY)
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft)
      Object.assign(formData, draft)
      console.log('임시저장된 데이터를 불러왔습니다')
    } catch (error) {
      console.error('임시저장 데이터 로드 실패:', error)
    }
  }
})

// 페이지 이탈 전 확인
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  const hasData = Object.values(formData).some(value => value && value !== '')
  if (hasData) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 뒤로 가기
const handleBack = () => {
  const hasData = Object.values(formData).some(value => value && value !== '')
  if (hasData) {
    if (confirm('작성 중인 내용이 있습니다. 돌아가시겠습니까?')) {
      router.push('/student/dashboard')
    }
  } else {
    router.push('/student/dashboard')
  }
}

// 임시저장
const handleSaveDraft = () => {
  isSavingDraft.value = true

  // 로컬스토리지에 저장
  localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))

  setTimeout(() => {
    isSavingDraft.value = false
    alert('임시저장되었습니다')
  }, 500)
}

// 제출
const handleSubmit = () => {
  // 필수 필드 검증
  const requiredFields = template.value.fields.filter(f => f.required)
  const emptyFields = requiredFields.filter(f => !formData[f.name] || formData[f.name] === '')

  if (emptyFields.length > 0) {
    alert(`다음 필수 항목을 입력해주세요:\n${emptyFields.map(f => f.label).join(', ')}`)
    return
  }

  if (!confirm('최종보고서를 제출하시겠습니까?\n제출 후 자동으로 PDF가 생성되며, 서류 업로드 메뉴에서 확인할 수 있습니다.')) {
    return
  }

  isSubmitting.value = true

  // API 호출 (현재는 mock)
  setTimeout(() => {
    console.log('제출 데이터:', formData)
    console.log('학생 정보:', studentInfo)

    // 로컬스토리지 임시저장 데이터 삭제
    localStorage.removeItem(DRAFT_KEY)

    isSubmitting.value = false
    alert('최종보고서가 제출되었습니다.\nPDF가 생성되어 "서류 업로드" 메뉴에 추가되었습니다.')
    router.push('/student/documents/upload')
  }, 1500)
}
</script>
