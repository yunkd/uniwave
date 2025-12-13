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
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">확인서 작성</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습생의 실습 내용을 확인하고 작성하세요</p>
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

    <!-- 확인서 작성 폼 -->
    <Card v-if="selectedStudent" class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">확인 내용</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        
        <!-- 실습 기본 정보 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              실습 시작일 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.internshipStartDate"
              type="text"
              required
              placeholder="YYYY-MM-DD"
              class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
            <p class="text-xs text-gray-500 mt-1">예: 2024-09-01</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              실습 종료일 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.internshipEndDate"
              type="text"
              required
              placeholder="YYYY-MM-DD"
              class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
            <p class="text-xs text-gray-500 mt-1">예: 2024-12-15</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              총 실습 시간 <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="form.totalHours"
                type="number"
                min="0"
                step="1"
                required
                placeholder="예: 320"
                class="flex-1 px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <span class="text-sm text-gray-700">시간</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              실습 일수 <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="form.totalDays"
                type="number"
                min="0"
                step="1"
                required
                placeholder="예: 80"
                class="flex-1 px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <span class="text-sm text-gray-700">일</span>
            </div>
          </div>
        </div>

        <!-- 실습 내용 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            실습 내용 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.internshipContent"
            required
            rows="6"
            maxlength="2000"
            placeholder="실습생이 수행한 주요 업무 및 활동 내용을 구체적으로 작성해주세요."
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ form.internshipContent.length }} / 2000자</p>
        </div>

        <!-- 확인 사항 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            확인 사항 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.confirmationNote"
            required
            rows="4"
            maxlength="1000"
            placeholder="실습생의 출석 및 실습 수행 사항을 확인합니다."
            class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ form.confirmationNote.length }} / 1000자</p>
        </div>

        <!-- 기관 정보 (자동 입력) -->
        <div class="pt-4 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">기관 정보</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                기관명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.institutionName"
                type="text"
                required
                placeholder="예: 사회복지법인 희망나눔"
                class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                기관 주소 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.institutionAddress"
                type="text"
                required
                placeholder="예: 서울시 강남구 테헤란로 123"
                class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                담당자 성명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.supervisorName"
                type="text"
                required
                placeholder="예: 김지도"
                class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                담당자 직책 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.supervisorPosition"
                type="text"
                required
                placeholder="예: 사회복지사"
                class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                작성 날짜 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.confirmationDate"
                type="text"
                required
                placeholder="YYYY-MM-DD"
                class="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <p class="text-xs text-gray-500 mt-1">예: 2024-12-13</p>
            </div>
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
      <p class="text-sm sm:text-base text-gray-600">실습생을 선택하면 확인서를 작성할 수 있습니다</p>
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

// 폼 데이터
const form = ref({
  internshipStartDate: '2024-09-01',
  internshipEndDate: '2024-12-15',
  totalHours: 0,
  totalDays: 0,
  internshipContent: '',
  confirmationNote: '',
  institutionName: '사회복지법인 희망나눔',
  institutionAddress: '서울시 강남구 테헤란로 123',
  supervisorName: '',
  supervisorPosition: '',
  confirmationDate: new Date().toISOString().split('T')[0]
})

const handleStudentChange = () => {
  // 학생 변경 시 임시저장된 데이터 불러오기 시도
  const savedData = localStorage.getItem(`certificate_${selectedStudentId.value}`)
  if (savedData) {
    const confirmed = confirm('임시저장된 데이터가 있습니다. 불러오시겠습니까?')
    if (confirmed) {
      form.value = JSON.parse(savedData)
    }
  } else {
    // 폼 초기화 (학생 정보 반영)
    if (selectedStudent.value) {
      form.value.totalHours = selectedStudent.value.totalHours
      const [start, end] = selectedStudent.value.internshipPeriod.split(' ~ ')
      form.value.internshipStartDate = start
      form.value.internshipEndDate = end
    }
  }
}

const handleTempSave = () => {
  if (!selectedStudentId.value) {
    alert('실습생을 먼저 선택하세요')
    return
  }

  localStorage.setItem(`certificate_${selectedStudentId.value}`, JSON.stringify(form.value))
  alert('임시저장되었습니다')
}

const handleSubmit = () => {
  if (!selectedStudentId.value) {
    alert('실습생을 먼저 선택하세요')
    return
  }

  if (!form.value.internshipContent.trim() || !form.value.confirmationNote.trim()) {
    alert('실습 내용과 확인 사항을 모두 입력하세요')
    return
  }

  if (!form.value.supervisorName.trim() || !form.value.supervisorPosition.trim()) {
    alert('담당자 정보를 모두 입력하세요')
    return
  }

  const confirmed = confirm('확인서를 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.')
  if (!confirmed) return

  isLoading.value = true

  // 임시: 1.5초 후 제출 완료
  setTimeout(() => {
    // 임시저장 데이터 삭제
    localStorage.removeItem(`certificate_${selectedStudentId.value}`)
    
    alert('확인서가 제출되었습니다.')
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
  input[type="number"],
  textarea,
  select {
    font-size: 16px; /* iOS 자동 줌 방지 */
    -webkit-appearance: none;
    appearance: none;
    min-height: 44px; /* iOS 권장 최소 터치 타겟 */
  }
}
</style>
