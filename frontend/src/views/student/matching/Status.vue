<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- 헤더 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <ClipboardDocumentListIcon class="w-8 h-8 text-primary-600" />
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">내 매칭 현황</h1>
      </div>
      <p class="text-gray-600">기관 매칭 신청 및 승인 현황을 확인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">대기중</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인됨</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.approved }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">거절됨</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
          </div>
          <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <XCircleIcon class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- 매칭 신청 목록 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">매칭 신청 내역</h2>
        <button
          @click="goToNewRequest"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>새 매칭 신청</span>
        </button>
      </div>

      <!-- 필터 -->
      <div class="mb-4">
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
      </div>

      <!-- 매칭 목록 -->
      <div v-if="filteredMatchings.length > 0" class="space-y-4">
        <div
          v-for="matching in filteredMatchings"
          :key="matching.id"
          class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          <!-- 상단: 기관 정보 & 상태 -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ matching.institutionName }}</h3>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                    <MapPinIcon class="w-3 h-3" />
                    {{ matching.region }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                    <BriefcaseIcon class="w-3 h-3" />
                    {{ matching.field }}
                  </span>
                </div>
              </div>
            </div>
            <span
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap',
                getStatusClass(matching.status)
              ]"
            >
              {{ getStatusLabel(matching.status) }}
            </span>
          </div>

          <!-- 신청 정보 -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-xs text-gray-600 mb-1">신청일</p>
              <p class="text-sm font-medium text-gray-900">{{ matching.requestedAt }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">실습 기간</p>
              <p class="text-sm font-medium text-gray-900">{{ matching.duration }}</p>
            </div>
            <div v-if="matching.status === 'APPROVED'">
              <p class="text-xs text-gray-600 mb-1">승인일</p>
              <p class="text-sm font-medium text-green-700">{{ matching.approvedAt }}</p>
            </div>
            <div v-if="matching.status === 'REJECTED'">
              <p class="text-xs text-gray-600 mb-1">거절일</p>
              <p class="text-sm font-medium text-red-700">{{ matching.rejectedAt }}</p>
            </div>
          </div>

          <!-- 메시지 -->
          <div v-if="matching.message" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-900">
              <span class="font-semibold">메시지:</span> {{ matching.message }}
            </p>
          </div>

          <!-- 거절 사유 -->
          <div v-if="matching.status === 'REJECTED' && matching.rejectionReason" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-900">
              <span class="font-semibold">거절 사유:</span> {{ matching.rejectionReason }}
            </p>
          </div>

          <!-- 액션 버튼 -->
          <div class="flex gap-2">
            <button
              @click="viewInstitutionDetail(matching.institutionId)"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <InformationCircleIcon class="w-4 h-4" />
              <span>기관 정보</span>
            </button>
            <button
              v-if="matching.status === 'PENDING'"
              @click="cancelMatching(matching.id)"
              class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <XCircleIcon class="w-4 h-4" />
              <span>신청 취소</span>
            </button>
            <button
              v-if="matching.status === 'APPROVED'"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircleIcon class="w-4 h-4" />
              <span>실습 시작</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="text-center py-12">
        <ClipboardDocumentListIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ filterStatus ? '해당 상태의 매칭 신청이 없습니다' : '매칭 신청 내역이 없습니다' }}
        </h3>
        <p class="text-gray-600 mb-4">
          {{ filterStatus ? '다른 필터를 선택해보세요' : '모집공고를 확인하거나 직접 기관을 검색하여 매칭을 신청하세요' }}
        </p>
        <button
          @click="goToNewRequest"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          <span>새 매칭 신청</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 필터 상태
const filterStatus = ref('')

// Mock 통계 데이터
const stats = ref({
  pending: 1,
  approved: 2,
  rejected: 1
})

// Mock 매칭 데이터
const matchings = ref([
  {
    id: 1,
    institutionId: 1,
    institutionName: '서울시립노인종합복지관',
    region: '서울',
    field: '노인복지',
    duration: '4주 (2025.03.01 ~ 2025.03.28)',
    requestedAt: '2025.01.15',
    approvedAt: '2025.01.20',
    status: 'APPROVED',
    message: '매칭이 승인되었습니다. 실습 시작 전 오리엔테이션에 참석해주세요.'
  },
  {
    id: 2,
    institutionId: 2,
    institutionName: '행복한우리요양원',
    region: '경기',
    field: '노인복지',
    duration: '4주 (2025.03.15 ~ 2025.04.11)',
    requestedAt: '2025.02.01',
    status: 'PENDING',
    message: null
  },
  {
    id: 3,
    institutionId: 3,
    institutionName: '꿈나무아동센터',
    region: '서울',
    field: '아동복지',
    duration: '4주 (2025.04.01 ~ 2025.04.28)',
    requestedAt: '2025.01.28',
    approvedAt: '2025.02.05',
    status: 'APPROVED',
    message: '환영합니다! 실습 관련 문의사항은 언제든 연락주세요.'
  },
  {
    id: 4,
    institutionId: 4,
    institutionName: '마음의정원 정신건강센터',
    region: '서울',
    field: '정신보건',
    duration: '4주 (2025.02.15 ~ 2025.03.14)',
    requestedAt: '2025.01.10',
    rejectedAt: '2025.01.12',
    status: 'REJECTED',
    rejectionReason: '해당 기간 정원이 마감되었습니다. 다른 기간으로 재신청 부탁드립니다.'
  }
])

// 필터링된 매칭 목록
const filteredMatchings = computed(() => {
  if (!filterStatus.value) return matchings.value
  return matchings.value.filter(m => m.status === filterStatus.value)
})

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '대기중',
    APPROVED: '승인됨',
    REJECTED: '거절됨'
  }
  return labels[status] || status
}

// 상태 스타일
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// 새 매칭 신청
const goToNewRequest = () => {
  router.push({ name: 'StudentMatchingRequest' })
}

// 기관 상세 정보
const viewInstitutionDetail = (institutionId: number) => {
  // TODO: 기관 상세 정보 페이지로 이동 또는 모달 표시
  alert(`기관 ID ${institutionId}의 상세 정보를 표시합니다.`)
}

// 매칭 신청 취소
const cancelMatching = (matchingId: number) => {
  if (confirm('매칭 신청을 취소하시겠습니까?')) {
    // TODO: 실제 API 호출
    const index = matchings.value.findIndex(m => m.id === matchingId)
    if (index > -1) {
      matchings.value.splice(index, 1)
      stats.value.pending--
    }
    alert('매칭 신청이 취소되었습니다.')
  }
}
</script>
