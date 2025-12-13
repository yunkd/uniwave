<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">제본 신청</h1>
      <p class="text-xs sm:text-sm text-gray-600">실습 서류를 하나의 PDF로 제본하여 배송받으세요</p>
    </div>

    <!-- 준비 상태 확인 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4" :class="canApply ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'">
      <div class="flex items-start gap-3">
        <component
          :is="canApply ? CheckCircleIcon : ExclamationTriangleIcon"
          :class="canApply ? 'text-green-600' : 'text-yellow-600'"
          class="w-6 h-6 flex-shrink-0"
        />
        <div class="flex-1">
          <p :class="canApply ? 'text-green-900' : 'text-yellow-900'" class="text-sm font-medium mb-2">
            {{ canApply ? '제본 신청이 가능합니다' : '일부 서류가 업로드되지 않았습니다' }}
          </p>
          <div class="space-y-1 text-xs" :class="canApply ? 'text-green-700' : 'text-yellow-700'">
            <div class="flex items-center gap-2">
              <component :is="documents.journal ? CheckCircleIcon : XCircleIcon" class="w-4 h-4" />
              <span>실습일지 (압축파일): {{ documents.journal ? '업로드 완료' : '미업로드' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <component :is="documents.attendance ? CheckCircleIcon : XCircleIcon" class="w-4 h-4" />
              <span>출석부: {{ documents.attendance ? '업로드 완료' : '미업로드' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <component :is="documents.evaluation ? CheckCircleIcon : XCircleIcon" class="w-4 h-4" />
              <span>평가서: {{ documents.evaluation ? '업로드 완료' : '미업로드' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <component :is="documents.certificate ? CheckCircleIcon : XCircleIcon" class="w-4 h-4" />
              <span>확인서: {{ documents.certificate ? '업로드 완료' : '미업로드' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <component :is="documents.finalReport ? CheckCircleIcon : XCircleIcon" class="w-4 h-4" />
              <span>최종보고서: {{ documents.finalReport ? '업로드 완료' : '미업로드' }}</span>
            </div>
          </div>
          <div v-if="!canApply" class="mt-3 pt-3 border-t border-yellow-300">
            <Button
              variant="outline"
              @click="router.push('/student/documents/upload')"
              class="text-xs w-full"
            >
              서류 업로드 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- PDF 미리보기 (준비 완료 시) -->
    <Card v-if="canApply" class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">제본 PDF 구성</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <DocumentTextIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">표지</span>
          </div>
          <span class="text-xs text-gray-500">자동 생성</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <BookOpenIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">실습일지</span>
          </div>
          <span class="text-xs text-gray-500">업로드 파일</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <ClipboardDocumentCheckIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">출석부</span>
          </div>
          <span class="text-xs text-gray-500">업로드 파일</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <ClipboardDocumentListIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">평가서</span>
          </div>
          <span class="text-xs text-gray-500">업로드 파일</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <DocumentCheckIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">확인서</span>
          </div>
          <span class="text-xs text-gray-500">업로드 파일</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center gap-2">
            <DocumentTextIcon class="w-5 h-5 text-gray-600" />
            <span class="text-sm text-gray-900">최종보고서</span>
          </div>
          <span class="text-xs text-gray-500">업로드 파일</span>
        </div>
      </div>
      <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-xs text-blue-800">
          <strong>업로드된 5가지 서류</strong>가 하나의 PDF로 제본됩니다
        </p>
      </div>
    </Card>

    <!-- 배송 정보 입력 -->
    <Card v-if="canApply" class="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6">
      <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">배송 정보</h3>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              받는 사람 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.recipientName"
              type="text"
              required
              placeholder="홍길동"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              연락처 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.recipientPhone"
              type="tel"
              required
              placeholder="010-1234-5678"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            주소 <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="form.postalCode"
              type="text"
              required
              placeholder="우편번호"
              readonly
              class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              @click="searchAddress"
              class="text-sm whitespace-nowrap"
            >
              주소 검색
            </Button>
          </div>
          <input
            v-model="form.address"
            type="text"
            required
            placeholder="기본 주소"
            readonly
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 mb-2 text-sm"
          />
          <input
            v-model="form.addressDetail"
            type="text"
            placeholder="상세 주소 (동/호수 등)"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            배송 메모 (선택)
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="배송 시 요청사항을 입력하세요"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          ></textarea>
        </div>

        <div class="pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="primary"
            :loading="isLoading"
            full-width
            class="text-sm sm:text-base"
          >
            제본 신청하기
          </Button>
        </div>
      </form>
    </Card>

    <!-- 신청 불가 안내 -->
    <Card v-else class="p-6 sm:p-8 text-center">
      <DocumentTextIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-sm sm:text-base text-gray-600 mb-2">제본 신청을 위해 필요한 서류를 업로드해주세요</p>
      <p class="text-xs text-gray-500 mb-4">실습일지, 출석부, 평가서, 확인서, 최종보고서가 모두 업로드되어야 합니다</p>
      <Button
        variant="primary"
        @click="router.push('/student/documents/upload')"
        class="text-sm"
      >
        서류 업로드 페이지로 이동
      </Button>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  DocumentCheckIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const isLoading = ref(false)

// 서류 업로드 상태 (localStorage에서 읽어옴)
const documents = ref({
  journal: false,        // 실습일지 압축파일
  attendance: false,     // 출석부
  evaluation: false,     // 평가서
  certificate: false,    // 확인서
  finalReport: false     // 최종보고서
})

// 업로드된 파일 정보
const uploadedFiles = ref<any>({})

// localStorage에서 업로드 상태 불러오기
const loadUploadState = () => {
  try {
    const savedState = localStorage.getItem('uploaded_documents')
    if (savedState) {
      const uploadState = JSON.parse(savedState)
      uploadedFiles.value = uploadState
      
      // 각 서류의 업로드 여부 확인
      documents.value.journal = !!uploadState.journal?.uploaded
      documents.value.attendance = !!uploadState.attendance?.uploaded
      documents.value.evaluation = !!uploadState.evaluation?.uploaded
      documents.value.certificate = !!uploadState.certificate?.uploaded
      documents.value.finalReport = !!uploadState.finalReport?.uploaded
      
      console.log('업로드 상태 불러오기 완료:', uploadState)
    }
  } catch (error) {
    console.error('업로드 상태 불러오기 실패:', error)
  }
}

// 컴포넌트 마운트 시 업로드 상태 불러오기
onMounted(() => {
  loadUploadState()
})

// 제본 신청 가능 여부: 5가지 서류 모두 업로드 완료
const canApply = computed(() => {
  return documents.value.journal &&
         documents.value.attendance &&
         documents.value.evaluation &&
         documents.value.certificate &&
         documents.value.finalReport
})

const form = ref({
  recipientName: '',
  recipientPhone: '',
  postalCode: '',
  address: '',
  addressDetail: '',
  notes: ''
})

const searchAddress = () => {
  alert('주소 검색 기능 (추후 다음 주소 API 연동)')
  // 추후 다음 주소 API 연동
  form.value.postalCode = '06234'
  form.value.address = '서울특별시 강남구 테헤란로 123'
}

const handleSubmit = () => {
  if (!form.value.recipientName || !form.value.recipientPhone || !form.value.address) {
    alert('필수 항목을 모두 입력해주세요')
    return
  }

  const confirmed = confirm(`제본을 신청하시겠습니까?\n\n받는 사람: ${form.value.recipientName}\n주소: ${form.value.address} ${form.value.addressDetail}`)
  if (!confirmed) return

  isLoading.value = true

  setTimeout(() => {
    // 제본 신청 완료 시 업로드 상태 초기화 (선택사항)
    // localStorage.removeItem('uploaded_documents')
    
    alert('제본 신청이 완료되었습니다!\n신청 내역에서 배송 상태를 확인할 수 있습니다.')
    isLoading.value = false
    router.push('/student/binding/history')
  }, 1500)
}
</script>

<style scoped>
@media screen and (max-width: 640px) {
  input[type="text"],
  input[type="tel"],
  textarea {
    font-size: 16px;
    -webkit-appearance: none;
    appearance: none;
  }
}
</style>
