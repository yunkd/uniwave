<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm sm:text-base"
      >
        <ChevronLeftIcon class="w-4 h-4 sm:w-5 sm:h-5" />
        <span class="font-medium">뒤로 가기</span>
      </button>
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">평가서 작성</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습생의 실습 내용을 평가하고 작성하세요</p>
    </div>

    <!-- 학생 선택 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">실습생 선택</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            실습생 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedStudentId"
            @change="handleStudentChange"
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            required
          >
            <option value="">실습생을 선택하세요</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }} ({{ student.university }})
            </option>
          </select>
        </div>

        <!-- 선택된 학생 정보 -->
        <div v-if="selectedStudent" class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-xs text-gray-600 mb-0.5">학생 이름</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedStudent.name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 mb-0.5">소속 대학</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedStudent.university }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 mb-0.5">실습 기간</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedStudent.internshipPeriod }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-600 mb-0.5">총 실습 시간</p>
            <p class="text-sm font-medium text-gray-900">{{ selectedStudent.totalHours }}시간</p>
          </div>
        </div>
      </div>
    </Card>

    <!-- 평가서 작성 폼 -->
    <Card v-if="selectedStudent" class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">평가 항목</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        
        <!-- 동적 평가 항목 (대학 양식 기반) -->
        <div v-for="(field, index) in evaluationFields" :key="index" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>

          <!-- 점수 입력 (1-5점) -->
          <div v-if="field.type === 'score'" class="flex items-center gap-3 flex-wrap">
            <div class="flex gap-2">
              <button
                v-for="score in 5"
                :key="score"
                type="button"
                @click="form.scores[field.key] = score"
                :class="[
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 font-semibold text-sm sm:text-base transition-all',
                  form.scores[field.key] === score
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-400'
                ]"
              >
                {{ score }}
              </button>
            </div>
            <span class="text-xs sm:text-sm text-gray-500">{{ field.description }}</span>
          </div>

          <!-- 텍스트 입력 -->
          <input
            v-else-if="field.type === 'text'"
            v-model="form.texts[field.key]"
            type="text"
            :required="field.required"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          />

          <!-- 장문 입력 -->
          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="form.texts[field.key]"
            :required="field.required"
            :placeholder="field.placeholder"
            :maxlength="field.maxLength || 1000"
            rows="4"
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
          ></textarea>
          <p v-if="field.type === 'textarea'" class="text-xs text-gray-500">
            {{ (form.texts[field.key] || '').length }} / {{ field.maxLength || 1000 }}자
          </p>

          <!-- 체크박스 -->
          <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
            <input
              v-model="form.checkboxes[field.key]"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span class="text-sm text-gray-700">{{ field.checkboxLabel }}</span>
          </div>
        </div>

        <!-- 종합 의견 -->
        <div class="pt-4 border-t border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            종합 의견 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.overallComment"
            required
            rows="6"
            maxlength="2000"
            placeholder="실습생의 실습 태도, 전문성, 향후 발전 가능성 등에 대한 종합적인 평가를 작성해주세요."
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ form.overallComment.length }} / 2000자</p>
        </div>

        <!-- 평가자 정보 -->
        <div class="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              평가자 성명 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.evaluatorName"
              type="text"
              required
              placeholder="예: 김지도"
              class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              평가자 직책 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.evaluatorPosition"
              type="text"
              required
              placeholder="예: 사회복지사"
              class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              평가 날짜 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.evaluationDate"
              type="text"
              required
              placeholder="YYYY-MM-DD"
              class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
            <p class="text-xs text-gray-500 mt-1">예: 2024-12-13</p>
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            @click="handleTempSave"
            class="flex-1 text-sm sm:text-base"
          >
            임시저장
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="isLoading"
            class="flex-1 text-sm sm:text-base"
          >
            제출하기
          </Button>
        </div>
      </form>
    </Card>

    <!-- 안내 메시지 (학생 미선택 시) -->
    <Card v-else class="p-6 sm:p-8 lg:p-12 text-center">
      <UserGroupIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
      <p class="text-sm sm:text-base text-gray-600">실습생을 선택하면 평가서를 작성할 수 있습니다</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import { ChevronLeftIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const isLoading = ref(false)
const selectedStudentId = ref('')

// 임시 데이터: 실습생 목록 (추후 API 연동)
const students = ref([
  {
    id: '1',
    name: '김학생',
    university: '서울대학교',
    internshipPeriod: '2024-09-01 ~ 2024-12-15',
    totalHours: 320
  },
  {
    id: '2',
    name: '이실습',
    university: '연세대학교',
    internshipPeriod: '2024-09-01 ~ 2024-12-15',
    totalHours: 280
  },
  {
    id: '3',
    name: '박현장',
    university: '고려대학교',
    internshipPeriod: '2024-09-01 ~ 2024-12-15',
    totalHours: 300
  }
])

// 선택된 학생 정보
const selectedStudent = computed(() => {
  return students.value.find(s => s.id === selectedStudentId.value)
})

// 대학 양식 기반 동적 평가 항목 (추후 templates 테이블에서 가져옴)
const evaluationFields = ref([
  {
    key: 'attitude',
    label: '실습 태도',
    type: 'score',
    description: '(1: 매우 미흡, 5: 매우 우수)',
    required: true
  },
  {
    key: 'professionalism',
    label: '전문성',
    type: 'score',
    description: '(1: 매우 미흡, 5: 매우 우수)',
    required: true
  },
  {
    key: 'communication',
    label: '의사소통 능력',
    type: 'score',
    description: '(1: 매우 미흡, 5: 매우 우수)',
    required: true
  },
  {
    key: 'teamwork',
    label: '팀워크',
    type: 'score',
    description: '(1: 매우 미흡, 5: 매우 우수)',
    required: true
  },
  {
    key: 'creativity',
    label: '창의성 및 문제해결 능력',
    type: 'score',
    description: '(1: 매우 미흡, 5: 매우 우수)',
    required: true
  }
])

// 폼 데이터
const form = ref({
  scores: {} as Record<string, number>,
  texts: {} as Record<string, string>,
  checkboxes: {} as Record<string, boolean>,
  overallComment: '',
  evaluatorName: '',
  evaluatorPosition: '',
  evaluationDate: new Date().toISOString().split('T')[0]
})

const handleStudentChange = () => {
  // 학생 변경 시 임시저장된 데이터 불러오기 시도
  const savedData = localStorage.getItem(`evaluation_${selectedStudentId.value}`)
  if (savedData) {
    const confirmed = confirm('임시저장된 데이터가 있습니다. 불러오시겠습니까?')
    if (confirmed) {
      form.value = JSON.parse(savedData)
    }
  } else {
    // 폼 초기화
    form.value = {
      scores: {},
      texts: {},
      checkboxes: {},
      overallComment: '',
      evaluatorName: '',
      evaluatorPosition: '',
      evaluationDate: new Date().toISOString().split('T')[0]
    }
  }
}

const handleTempSave = () => {
  if (!selectedStudentId.value) {
    alert('실습생을 먼저 선택하세요')
    return
  }

  localStorage.setItem(`evaluation_${selectedStudentId.value}`, JSON.stringify(form.value))
  alert('임시저장되었습니다')
}

const handleSubmit = () => {
  if (!selectedStudentId.value) {
    alert('실습생을 먼저 선택하세요')
    return
  }

  // 필수 점수 항목 검증
  const requiredScores = evaluationFields.value.filter(f => f.type === 'score' && f.required)
  const missingScores = requiredScores.filter(f => !form.value.scores[f.key])
  
  if (missingScores.length > 0) {
    alert(`다음 항목의 점수를 입력하세요: ${missingScores.map(f => f.label).join(', ')}`)
    return
  }

  if (!form.value.overallComment.trim()) {
    alert('종합 의견을 입력하세요')
    return
  }

  if (!form.value.evaluatorName.trim() || !form.value.evaluatorPosition.trim() || !form.value.evaluationDate.trim()) {
    alert('평가자 정보를 모두 입력하세요')
    return
  }

  const confirmed = confirm('평가서를 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')
  if (!confirmed) return

  isLoading.value = true

  // 임시: 1.5초 후 제출 완료
  setTimeout(() => {
    // 임시저장 데이터 삭제
    localStorage.removeItem(`evaluation_${selectedStudentId.value}`)
    
    alert('평가서가 제출되었습니다.')
    isLoading.value = false
    
    // 서류 목록으로 이동
    router.push('/institution/documents')
  }, 1500)
}
</script>

<style scoped>
/* 모바일 최적화 */
@media screen and (max-width: 640px) {
  input[type="text"],
  textarea,
  select {
    font-size: 16px; /* iOS 자동 줌 방지 */
    -webkit-appearance: none;
    appearance: none;
    min-height: 44px; /* iOS 권장 최소 터치 타겟 */
  }
}
</style>
