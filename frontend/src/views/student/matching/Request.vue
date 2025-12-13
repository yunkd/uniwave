<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">실습 기관 매칭 신청</h1>
      <p class="text-sm sm:text-base text-gray-600">기관과 사전 협의 후 발급받은 코드로 매칭을 신청하세요</p>
    </div>

    <!-- 안내 카드 -->
    <Card class="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div class="flex items-start gap-3">
        <InformationCircleIcon class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="text-base font-bold text-blue-900 mb-2">매칭 신청 절차</h3>
          <ol class="text-sm text-blue-800 space-y-2">
            <li class="flex items-start gap-2">
              <span class="font-bold">1.</span>
              <span><strong>"실습 기관 검색"</strong>에서 원하는 기관 찾기</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">2.</span>
              <span>기관에 <strong>전화 또는 방문</strong>하여 실습 가능 여부 협의</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">3.</span>
              <span>기관 담당자로부터 <strong>"매칭 코드"</strong> 받기</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">4.</span>
              <span>아래 양식에 매칭 코드 입력 후 신청</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">5.</span>
              <span>대학 담당자 승인 대기</span>
            </li>
          </ol>
        </div>
      </div>
    </Card>

    <!-- 매칭 신청 폼 -->
    <Card>
      <form @submit.prevent="submitMatching">
        <div class="space-y-6">
          <!-- 매칭 코드 입력 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              매칭 코드 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.matchingCode"
              type="text"
              placeholder="예: SKKU-SWC-2025-001"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm uppercase"
              required
              @input="validateCode"
            />
            <p class="mt-2 text-xs text-gray-500">
              💡 기관 담당자에게 받은 코드를 정확히 입력해주세요 (대소문자 구분 없음)
            </p>
            
            <!-- 코드 검증 결과 -->
            <div v-if="codeValidation.checked" class="mt-3">
              <div
                v-if="codeValidation.valid"
                class="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-900">유효한 매칭 코드입니다</p>
                    <div class="mt-2 text-sm text-green-800">
                      <p><strong>기관명:</strong> {{ codeValidation.institution?.name }}</p>
                      <p><strong>주소:</strong> {{ codeValidation.institution?.address }}</p>
                      <p><strong>분야:</strong> {{ codeValidation.institution?.field }}</p>
                      <p><strong>모집 상태:</strong> 
                        <span class="text-green-600 font-medium">
                          모집중 ({{ codeValidation.institution?.currentStudents }}/{{ codeValidation.institution?.capacity }}명)
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <XCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-red-900">{{ codeValidation.message }}</p>
                    <p class="mt-1 text-xs text-red-700">
                      기관 담당자에게 코드를 다시 확인해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 희망 실습 기간 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              희망 실습 기간
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">시작일</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">종료일</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>
          </div>

          <!-- 신청 메시지 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              신청 메시지 (선택)
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="기관 담당자나 대학 담당자에게 전달할 메시지를 작성하세요..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
            ></textarea>
          </div>

          <!-- 제출 버튼 -->
          <div class="flex gap-3">
            <Button
              type="button"
              variant="outline"
              full-width
              @click="router.push('/student/institution-search')"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              full-width
              :disabled="!codeValidation.valid || isSubmitting"
            >
              <CheckCircleIcon v-if="!isSubmitting" class="w-5 h-5 mr-2" />
              <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSubmitting ? '신청 중...' : '매칭 신청' }}
            </Button>
          </div>
        </div>
      </form>
    </Card>

    <!-- 도움말 -->
    <Card class="mt-6 bg-gray-50">
      <h3 class="text-sm font-bold text-gray-900 mb-3">자주 묻는 질문</h3>
      <div class="space-y-3 text-sm text-gray-600">
        <div>
          <p class="font-medium text-gray-900">Q. 매칭 코드는 어디서 받나요?</p>
          <p class="mt-1">A. 실습을 희망하는 기관에 직접 연락하여 협의 후, 기관 담당자로부터 받을 수 있습니다.</p>
        </div>
        <div>
          <p class="font-medium text-gray-900">Q. 여러 기관에 동시에 신청할 수 있나요?</p>
          <p class="mt-1">A. 아니요, 한 번에 하나의 기관에만 매칭 신청이 가능합니다. 승인 또는 반려 후 다른 기관에 신청할 수 있습니다.</p>
        </div>
        <div>
          <p class="font-medium text-gray-900">Q. 승인까지 얼마나 걸리나요?</p>
          <p class="mt-1">A. 대학 담당자가 검토 후 2-3일 이내에 승인 여부가 결정됩니다. 결과는 이메일과 SMS로 알림을 받게 됩니다.</p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const form = ref({
  matchingCode: '',
  startDate: '',
  endDate: '',
  message: ''
})

const codeValidation = ref({
  checked: false,
  valid: false,
  message: '',
  institution: null as any
})

const isSubmitting = ref(false)

// 매칭 코드 검증
const validateCode = async () => {
  const code = form.value.matchingCode.trim().toUpperCase()
  
  if (code.length < 5) {
    codeValidation.value = {
      checked: false,
      valid: false,
      message: '',
      institution: null
    }
    return
  }

  // TODO: 실제 API 호출로 코드 검증
  // const response = await fetch(`/api/validate-matching-code?code=${code}`)
  
  // Mock 검증
  setTimeout(() => {
    if (code === 'SKKU-SWC-2025-001') {
      codeValidation.value = {
        checked: true,
        valid: true,
        message: '유효한 코드입니다',
        institution: {
          name: '서울사회복지관',
          address: '서울시 강남구 역삼동 123',
          field: '노인복지',
          capacity: 5,
          currentStudents: 2
        }
      }
    } else {
      codeValidation.value = {
        checked: true,
        valid: false,
        message: '유효하지 않은 매칭 코드입니다. 코드를 다시 확인해주세요.',
        institution: null
      }
    }
  }, 500)
}

// 매칭 신청 제출
const submitMatching = async () => {
  if (!codeValidation.value.valid) {
    alert('유효한 매칭 코드를 입력해주세요.')
    return
  }

  if (confirm('매칭을 신청하시겠습니까?')) {
    isSubmitting.value = true

    try {
      // TODO: 실제 API 호출
      // const response = await fetch('/api/student/matching-requests', {
      //   method: 'POST',
      //   body: JSON.stringify(form.value)
      // })

      // Mock API 응답
      await new Promise(resolve => setTimeout(resolve, 1500))

      alert('매칭 신청이 완료되었습니다!\n\n대학 담당자의 승인을 기다려주세요.\n결과는 이메일과 SMS로 알려드립니다.')
      router.push('/student/dashboard')
    } catch (error) {
      alert('매칭 신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>
