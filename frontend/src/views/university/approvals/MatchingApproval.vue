<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">학생-기관 매칭 승인</h1>
      <p class="text-xs sm:text-sm text-gray-600">학생의 기관 매칭 요청을 검토하고 승인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">전체 요청</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.total }}건</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-yellow-600">승인 대기</p>
          <p class="text-lg sm:text-2xl font-bold text-yellow-600">{{ stats.pending }}건</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-green-600">승인 완료</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ stats.approved }}건</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-red-600">반려</p>
          <p class="text-lg sm:text-2xl font-bold text-red-600">{{ stats.rejected }}건</p>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="PENDING">승인대기</option>
          <option value="APPROVED">승인완료</option>
          <option value="REJECTED">반려</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="학생 이름 또는 기관명으로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 매칭 요청 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredRequests.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <BuildingOfficeIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600">매칭 요청이 없습니다</p>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                요청 기관
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                요청일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="request in filteredRequests"
              :key="request.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {{ request.studentName[0] }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ request.studentName }}</p>
                    <p class="text-xs text-gray-500">{{ request.studentId }} · {{ request.department }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-900">{{ request.institutionName }}</p>
                <p class="text-xs text-gray-500">{{ request.institutionType }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ request.requestedAt }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusColor(request.status)"
                  class="px-2 py-1 text-xs font-medium rounded"
                >
                  {{ getStatusLabel(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div v-if="request.status === 'PENDING'" class="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="handleReject(request)"
                  >
                    반려
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    @click="handleApprove(request)"
                  >
                    승인
                  </Button>
                </div>
                <div v-else class="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="handleViewDetail(request)"
                  >
                    상세보기
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 뷰 -->
      <div v-if="filteredRequests.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="request in filteredRequests"
          :key="request.id"
          class="p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                {{ request.studentName[0] }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ request.studentName }}</p>
                <p class="text-xs text-gray-500">{{ request.department }}</p>
              </div>
            </div>
            <span
              :class="getStatusColor(request.status)"
              class="px-2 py-1 text-xs font-medium rounded"
            >
              {{ getStatusLabel(request.status) }}
            </span>
          </div>

          <div class="mb-3">
            <p class="text-xs text-gray-500 mb-1">요청 기관</p>
            <p class="text-sm font-medium text-gray-900">{{ request.institutionName }}</p>
            <p class="text-xs text-gray-500">{{ request.institutionType }}</p>
          </div>

          <div class="mb-3">
            <p class="text-xs text-gray-500 mb-1">요청일</p>
            <p class="text-sm font-medium text-gray-900">{{ request.requestedAt }}</p>
          </div>

          <div v-if="request.status === 'PENDING'" class="flex gap-2">
            <Button
              variant="outline"
              class="flex-1 text-xs sm:text-sm"
              @click="handleReject(request)"
            >
              반려
            </Button>
            <Button
              variant="primary"
              class="flex-1 text-xs sm:text-sm"
              @click="handleApprove(request)"
            >
              승인
            </Button>
          </div>
          <div v-else>
            <Button
              variant="ghost"
              class="w-full text-xs sm:text-sm"
              @click="handleViewDetail(request)"
            >
              상세보기
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- 승인 모달 (기관 이메일 입력) -->
    <Modal v-if="showApproveModal" @close="showApproveModal = false">
      <template #title>매칭 승인 - 기관 초대 이메일 발송</template>
      <template #content>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-sm text-blue-800 mb-2">
              <strong>{{ selectedRequest?.studentName }}</strong> 학생 ↔ <strong>{{ selectedRequest?.institutionName }}</strong> 기관
            </p>
            <p class="text-xs text-blue-700">
              승인 시 기관 담당자에게 회원가입 초대 이메일이 발송됩니다.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">기관 담당자 이메일 *</label>
            <input
              v-model="institutionEmail"
              type="email"
              placeholder="institution@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">
              유효기간 24시간의 회원가입 초대 URL이 발송됩니다
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">메모 (선택)</label>
            <textarea
              v-model="approveMessage"
              rows="3"
              placeholder="기관에 전달할 메시지가 있다면 입력하세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button variant="outline" @click="showApproveModal = false">
            취소
          </Button>
          <Button 
            variant="primary" 
            @click="confirmApprove" 
            :disabled="!isValidEmail(institutionEmail)"
          >
            승인 및 이메일 발송
          </Button>
        </div>
      </template>
    </Modal>

    <!-- 반려 사유 모달 -->
    <Modal v-if="showRejectModal" @close="showRejectModal = false">
      <template #title>매칭 반려</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>{{ selectedRequest?.studentName }}</strong> 학생의 <strong>{{ selectedRequest?.institutionName }}</strong> 기관 매칭 요청을 반려하시겠습니까?
            </p>
            <p class="text-xs text-gray-500">반려 사유는 학생에게 전달됩니다.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">반려 사유 *</label>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="반려 사유를 입력하세요 (예: 기관 정원 초과, 실습 기간 불일치 등)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button variant="outline" @click="showRejectModal = false">
            취소
          </Button>
          <Button variant="danger" @click="confirmReject" :disabled="!rejectReason.trim()">
            반려 확정
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import Modal from '@/components/common/Modal.vue'
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 필터 상태
const selectedStatus = ref('PENDING')
const searchQuery = ref('')

// 모달 상태
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedRequest = ref<any>(null)
const institutionEmail = ref('')
const approveMessage = ref('')
const rejectReason = ref('')

// 통계 데이터 (Mock)
const stats = ref({
  total: 18,
  pending: 6,
  approved: 10,
  rejected: 2
})

// 매칭 요청 목록 (Mock)
const matchingRequests = ref([
  {
    id: '1',
    studentName: '홍길동',
    studentId: '2021012345',
    department: '사회복지학과',
    institutionName: '서울사회복지관',
    institutionType: '사회복지관',
    requestedAt: '2024-12-10',
    status: 'PENDING'
  },
  {
    id: '2',
    studentName: '김영희',
    studentId: '2021023456',
    department: '사회복지학과',
    institutionName: '강남노인복지센터',
    institutionType: '노인복지시설',
    requestedAt: '2024-12-11',
    status: 'PENDING'
  },
  {
    id: '3',
    studentName: '이철수',
    studentId: '2021034567',
    department: '아동복지학과',
    institutionName: '아이사랑어린이집',
    institutionType: '아동복지시설',
    requestedAt: '2024-12-09',
    status: 'APPROVED'
  }
])

// 필터링된 목록
const filteredRequests = computed(() => {
  return matchingRequests.value.filter(request => {
    const matchesStatus = selectedStatus.value === 'ALL' || request.status === selectedStatus.value
    const matchesSearch = !searchQuery.value ||
      request.studentName.includes(searchQuery.value) ||
      request.institutionName.includes(searchQuery.value)
    return matchesStatus && matchesSearch
  })
})

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

// 상태 색상
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// 이메일 유효성 검사
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 승인 모달 열기
const handleApprove = (request: any) => {
  selectedRequest.value = request
  institutionEmail.value = ''
  approveMessage.value = ''
  showApproveModal.value = true
}

// 승인 확정
const confirmApprove = () => {
  if (!isValidEmail(institutionEmail.value)) {
    alert('올바른 이메일 주소를 입력해주세요')
    return
  }

  console.log('매칭 승인:', selectedRequest.value)
  console.log('기관 이메일:', institutionEmail.value)
  console.log('메시지:', approveMessage.value)
  
  // TODO: API 호출 - 매칭 승인 + Resend API로 이메일 발송
  selectedRequest.value.status = 'APPROVED'
  stats.value.pending--
  stats.value.approved++
  
  showApproveModal.value = false
  selectedRequest.value = null
  institutionEmail.value = ''
  approveMessage.value = ''
  
  alert(`매칭이 승인되었습니다.\n기관 담당자(${institutionEmail.value})에게 회원가입 초대 이메일이 발송되었습니다.`)
}

// 반려 모달 열기
const handleReject = (request: any) => {
  selectedRequest.value = request
  rejectReason.value = ''
  showRejectModal.value = true
}

// 반려 확정
const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    alert('반려 사유를 입력해주세요')
    return
  }

  console.log('매칭 반려:', selectedRequest.value, '사유:', rejectReason.value)
  // TODO: API 호출
  selectedRequest.value.status = 'REJECTED'
  selectedRequest.value.rejectReason = rejectReason.value
  stats.value.pending--
  stats.value.rejected++
  
  showRejectModal.value = false
  selectedRequest.value = null
  rejectReason.value = ''
  alert('매칭 요청이 반려되었습니다')
}

// 상세 보기
const handleViewDetail = (request: any) => {
  console.log('상세 보기:', request)
  // TODO: 상세 페이지 구현
}
</script>
