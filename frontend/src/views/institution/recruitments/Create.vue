<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">모집공고 작성</h1>
      <p class="mt-1 text-sm text-gray-600">실습생 모집공고를 작성하세요</p>
    </div>

    <Card>
      <form @submit.prevent="submitRecruitment">
        <div class="space-y-6">
          <!-- 제목 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              모집공고 제목 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="예: 2025년 상반기 사회복지 현장실습생 모집"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              required
            />
          </div>

          <!-- 모집분야 및 인원 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                모집 분야 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.field"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                required
              >
                <option value="">선택하세요</option>
                <option value="노인복지">노인복지</option>
                <option value="아동복지">아동복지</option>
                <option value="장애인복지">장애인복지</option>
                <option value="청소년복지">청소년복지</option>
                <option value="가족복지">가족복지</option>
                <option value="지역복지">지역복지</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                모집 인원 <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.positions"
                type="number"
                min="1"
                placeholder="예: 5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
            </div>
          </div>

          <!-- 실습 기간 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              실습 기간 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">시작일</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">종료일</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 지원 마감일 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              지원 마감일 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.deadline"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              required
            />
          </div>

          <!-- 주요 업무 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              주요 업무 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.tasks"
              rows="4"
              placeholder="실습생이 수행할 주요 업무를 입력하세요"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
              required
            ></textarea>
          </div>

          <!-- 지원 자격 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              지원 자격
            </label>
            <textarea
              v-model="form.requirements"
              rows="3"
              placeholder="지원 자격 요건을 입력하세요 (선택사항)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
            ></textarea>
          </div>

          <!-- 우대 사항 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              우대 사항
            </label>
            <textarea
              v-model="form.preferredQualifications"
              rows="3"
              placeholder="우대 사항을 입력하세요 (선택사항)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
            ></textarea>
          </div>

          <!-- 혜택 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              혜택
            </label>
            <textarea
              v-model="form.benefits"
              rows="3"
              placeholder="실습 중 제공되는 혜택을 입력하세요 (선택사항)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
            ></textarea>
          </div>

          <!-- 버튼 -->
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              full-width
              @click="router.push('/institution/recruitments')"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              full-width
              :disabled="isSubmitting"
            >
              <div v-if="isSubmitting" class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSubmitting ? '작성 중...' : '모집공고 등록' }}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'

const router = useRouter()

const form = ref({
  title: '',
  field: '',
  positions: null as number | null,
  startDate: '',
  endDate: '',
  deadline: '',
  tasks: '',
  requirements: '',
  preferredQualifications: '',
  benefits: ''
})

const isSubmitting = ref(false)

const submitRecruitment = async () => {
  // 유효성 검사
  if (!form.value.title || !form.value.field || !form.value.positions) {
    alert('필수 항목을 모두 입력해주세요.')
    return
  }

  if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
    alert('실습 종료일은 시작일보다 이후여야 합니다.')
    return
  }

  if (new Date(form.value.deadline) > new Date(form.value.startDate)) {
    alert('지원 마감일은 실습 시작일보다 이전이어야 합니다.')
    return
  }

  isSubmitting.value = true

  try {
    // TODO: 실제 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('모집공고가 등록되었습니다!')
    router.push('/institution/recruitments')
  } catch (error) {
    alert('모집공고 등록 중 오류가 발생했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
