<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- 헤더 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <BuildingOfficeIcon class="w-8 h-8 text-primary-600" />
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">신규 기관 승인 관리</h1>
      </div>
      <p class="text-gray-600">학생이 신청한 신규 기관을 검토하고 승인/반려하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600">전체 신청</span>
          <ClipboardDocumentListIcon class="w-5 h-5 text-gray-400" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-orange-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-orange-600">승인 대기</span>
          <ClockIcon class="w-5 h-5 text-orange-400" />
        </div>
        <p class="text-2xl font-bold text-orange-600">{{ stats.pending }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-green-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-green-600">승인 완료</span>
          <CheckCircleIcon class="w-5 h-5 text-green-400" />
        </div>
        <p class="text-2xl font-bold text-green-600">{{ stats.approved }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-red-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-red-600">반려</span>
          <XCircleIcon class="w-5 h-5 text-red-400" />
        </div>
        <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 상태 필터 -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">전체 상태</option>
            <option value="PENDING">승인 대기</option>
            <option value="APPROVED">승인 완료</option>
            <option value="REJECTED">반려</option>
          </select>
        </div>

        <!-- 복지 분야 필터 -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">복지 분야</label>
          <select
            v-model="selectedField"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">전체 분야</option>
            <option value="노인복지">노인복지</option>
            <option value="아동복지">아동복지</option>
            <option value="장애인복지">장애인복지</option>
            <option value="정신보건">정신보건</option>
            <option value="지역복지">지역복지</option>
            <option value="의료복지">의료복지</option>
          </select>
        </div>

        <!-- 검색 -->
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">검색</label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="기관명 또는 학생명 검색"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 신청 목록 - 데스크톱 테이블 -->
    <div class="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신청 학생
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위치
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신청일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ application.institutionName }}</p>
                  <p class="text-sm text-gray-500">{{ application.field }} · {{ application.institutionType }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ application.studentName }}</p>
                  <p class="text-sm text-gray-500">{{ application.studentId }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900">{{ application.city }} {{ application.district }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900">{{ formatDate(application.requestedAt) }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(application.status)">
                  {{ getStatusLabel(application.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="openDetailModal(application)"
                  class="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  상세보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 데이터 없음 -->
      <div v-if="filteredApplications.length === 0" class="px-6 py-12 text-center">
        <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">신규 기관 신청이 없습니다</p>
      </div>
    </div>

    <!-- 신청 목록 - 모바일 카드 -->
    <div class="md:hidden space-y-4">
      <div
        v-for="application in filteredApplications"
        :key="application.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">{{ application.institutionName }}</h3>
            <p class="text-sm text-gray-600">{{ application.field }} · {{ application.institutionType }}</p>
          </div>
          <span :class="getStatusClass(application.status)">
            {{ getStatusLabel(application.status) }}
          </span>
        </div>

        <div class="space-y-2 text-sm mb-4">
          <div class="flex items-center gap-2 text-gray-600">
            <UserIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ application.studentName }} ({{ application.studentId }})</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <MapPinIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ application.city }} {{ application.district }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600">
            <CalendarIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ formatDate(application.requestedAt) }}</span>
          </div>
        </div>

        <button
          @click="openDetailModal(application)"
          class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          상세보기
        </button>
      </div>

      <!-- 데이터 없음 -->
      <div v-if="filteredApplications.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <BuildingOfficeIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">신규 기관 신청이 없습니다</p>
      </div>
    </div>

    <!-- 상세보기 모달 -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">신규 기관 신청 상세</h2>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div v-if="selectedApplication" class="p-6 space-y-6">
          <!-- 신청 상태 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">신청 상태</h3>
            <span :class="getStatusClass(selectedApplication.status)">
              {{ getStatusLabel(selectedApplication.status) }}
            </span>
          </div>

          <!-- 신청 학생 정보 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">신청 학생</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="font-medium text-gray-900">{{ selectedApplication.studentName }}</p>
              <p class="text-sm text-gray-600 mt-1">학번: {{ selectedApplication.studentId }}</p>
              <p class="text-sm text-gray-600">이메일: {{ selectedApplication.studentEmail }}</p>
              <p class="text-sm text-gray-600">연락처: {{ selectedApplication.studentPhone }}</p>
            </div>
          </div>

          <!-- 기관 기본 정보 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">기관 기본 정보</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">기관명</p>
                  <p class="font-medium text-gray-900">{{ selectedApplication.institutionName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">복지 분야</p>
                  <p class="font-medium text-gray-900">{{ selectedApplication.field }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">기관 유형</p>
                  <p class="font-medium text-gray-900">{{ selectedApplication.institutionType }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 위치 정보 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">위치 정보</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <p class="text-sm text-gray-900"><span class="text-gray-500">시/도:</span> {{ selectedApplication.city }}</p>
              <p class="text-sm text-gray-900"><span class="text-gray-500">시/군/구:</span> {{ selectedApplication.district }}</p>
              <p class="text-sm text-gray-900"><span class="text-gray-500">읍/면/동:</span> {{ selectedApplication.dong }}</p>
              <p class="text-sm text-gray-900"><span class="text-gray-500">상세 주소:</span> {{ selectedApplication.address }}</p>
            </div>
          </div>

          <!-- 연락처 정보 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">연락처 정보</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <p class="text-sm text-gray-900"><span class="text-gray-500">담당자명:</span> {{ selectedApplication.contactName }}</p>
              <p class="text-sm text-gray-900"><span class="text-gray-500">연락처:</span> {{ selectedApplication.contactPhone }}</p>
              <p class="text-sm text-gray-900"><span class="text-gray-500">이메일:</span> {{ selectedApplication.contactEmail }}</p>
            </div>
          </div>

          <!-- 기타 정보 -->
          <div v-if="selectedApplication.website || selectedApplication.description">
            <h3 class="text-sm font-medium text-gray-500 mb-2">기타 정보</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <p v-if="selectedApplication.website" class="text-sm text-gray-900">
                <span class="text-gray-500">홈페이지:</span> 
                <a :href="selectedApplication.website" target="_blank" class="text-primary-600 hover:underline">
                  {{ selectedApplication.website }}
                </a>
              </p>
              <div v-if="selectedApplication.description">
                <p class="text-xs text-gray-500 mb-1">기관 소개</p>
                <p class="text-sm text-gray-900">{{ selectedApplication.description }}</p>
              </div>
            </div>
          </div>

          <!-- 신청 정보 -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">신청 정보</h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <p class="text-sm text-gray-900"><span class="text-gray-500">신청일:</span> {{ formatDate(selectedApplication.requestedAt) }}</p>
              <p v-if="selectedApplication.approvedAt" class="text-sm text-gray-900">
                <span class="text-gray-500">승인일:</span> {{ formatDate(selectedApplication.approvedAt) }}
              </p>
              <p v-if="selectedApplication.rejectedAt" class="text-sm text-gray-900">
                <span class="text-gray-500">반려일:</span> {{ formatDate(selectedApplication.rejectedAt) }}
              </p>
              <div v-if="selectedApplication.rejectionReason">
                <p class="text-xs text-gray-500 mb-1">반려 사유</p>
                <p class="text-sm text-red-600">{{ selectedApplication.rejectionReason }}</p>
              </div>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div v-if="selectedApplication.status === 'PENDING'" class="flex gap-3">
            <button
              @click="approveInstitution(selectedApplication)"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              승인
            </button>
            <button
              @click="openRejectModal(selectedApplication)"
              class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              반려
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 반려 사유 모달 -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900">기관 신청 반려</h2>
            <button @click="closeRejectModal" class="text-gray-400 hover:text-gray-600">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">반려 사유를 입력해주세요.</p>
          <textarea
            v-model="rejectionReason"
            rows="4"
            placeholder="예: 기관 정보가 정확하지 않습니다. 연락처를 확인해주세요."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <div class="border-t border-gray-200 p-6 flex gap-3">
          <button
            @click="closeRejectModal"
            class="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            취소
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectionReason.trim()"
            class="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            반려 확정
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Mock 데이터 - 추후 API 연동 시 교체
const applications = ref([
  {
    id: 'inst-req-001',
    institutionName: '서울시립노인복지센터',
    field: '노인복지',
    institutionType: '복지센터',
    city: '서울시',
    district: '강남구',
    dong: '삼성동',
    address: '서울시 강남구 삼성동 123-45',
    contactName: '김담당',
    contactPhone: '02-1234-5678',
    contactEmail: 'contact@seoul-senior.or.kr',
    website: 'https://seoul-senior.or.kr',
    description: '서울시립 노인복지센터는 어르신들의 건강하고 행복한 노후를 위해 다양한 프로그램을 운영하고 있습니다.',
    studentName: '김철수',
    studentId: '2021123456',
    studentEmail: 'student1@university.ac.kr',
    studentPhone: '010-1234-5678',
    status: 'PENDING',
    requestedAt: '2025-01-10T09:30:00',
    approvedAt: null,
    rejectedAt: null,
    rejectionReason: null
  },
  {
    id: 'inst-req-002',
    institutionName: '부산아동보호센터',
    field: '아동복지',
    institutionType: '아동센터',
    city: '부산시',
    district: '해운대구',
    dong: '우동',
    address: '부산시 해운대구 우동 789-12',
    contactName: '이센터장',
    contactPhone: '051-9876-5432',
    contactEmail: 'info@busan-child.or.kr',
    website: '',
    description: '아동 보호 및 교육 프로그램 운영',
    studentName: '이영희',
    studentId: '2020987654',
    studentEmail: 'student2@university.ac.kr',
    studentPhone: '010-9876-5432',
    status: 'APPROVED',
    requestedAt: '2025-01-08T14:20:00',
    approvedAt: '2025-01-09T10:15:00',
    rejectedAt: null,
    rejectionReason: null
  },
  {
    id: 'inst-req-003',
    institutionName: '대전장애인복지관',
    field: '장애인복지',
    institutionType: '사회복지관',
    city: '대전시',
    district: '서구',
    dong: '둔산동',
    address: '대전시 서구 둔산동 456-78',
    contactName: '박관장',
    contactPhone: '042-5555-6666',
    contactEmail: 'admin@daejeon-disabled.or.kr',
    website: 'https://daejeon-disabled.or.kr',
    description: '장애인 자립 지원 및 재활 프로그램',
    studentName: '박민수',
    studentId: '2021456789',
    studentEmail: 'student3@university.ac.kr',
    studentPhone: '010-5555-6666',
    status: 'REJECTED',
    requestedAt: '2025-01-05T11:00:00',
    approvedAt: null,
    rejectedAt: '2025-01-06T16:30:00',
    rejectionReason: '기관 정보가 정확하지 않습니다. 연락처를 다시 확인해주세요.'
  }
])

// 필터 및 검색
const selectedStatus = ref('')
const selectedField = ref('')
const searchQuery = ref('')

// 통계
const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter(a => a.status === 'PENDING').length,
  approved: applications.value.filter(a => a.status === 'APPROVED').length,
  rejected: applications.value.filter(a => a.status === 'REJECTED').length
}))

// 필터링된 신청 목록
const filteredApplications = computed(() => {
  return applications.value.filter(application => {
    // 상태 필터
    if (selectedStatus.value && application.status !== selectedStatus.value) {
      return false
    }

    // 복지 분야 필터
    if (selectedField.value && application.field !== selectedField.value) {
      return false
    }

    // 검색어 필터
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesInstitution = application.institutionName.toLowerCase().includes(query)
      const matchesStudent = application.studentName.toLowerCase().includes(query)
      if (!matchesInstitution && !matchesStudent) {
        return false
      }
    }

    return true
  })
})

// 모달 상태
const showDetailModal = ref(false)
const showRejectModal = ref(false)
const selectedApplication = ref<any>(null)
const rejectionReason = ref('')

const openDetailModal = (application: any) => {
  selectedApplication.value = application
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedApplication.value = null
}

const openRejectModal = (application: any) => {
  selectedApplication.value = application
  rejectionReason.value = ''
  showRejectModal.value = true
  showDetailModal.value = false
}

const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionReason.value = ''
}

// 승인 처리
const approveInstitution = (application: any) => {
  if (confirm(`${application.institutionName}을(를) 승인하시겠습니까?`)) {
    // TODO: API 호출
    application.status = 'APPROVED'
    application.approvedAt = new Date().toISOString()
    
    alert('기관이 승인되었습니다.')
    closeDetailModal()
  }
}

// 반려 처리
const confirmReject = () => {
  if (selectedApplication.value && rejectionReason.value.trim()) {
    // TODO: API 호출
    selectedApplication.value.status = 'REJECTED'
    selectedApplication.value.rejectedAt = new Date().toISOString()
    selectedApplication.value.rejectionReason = rejectionReason.value.trim()
    
    alert('기관 신청이 반려되었습니다.')
    closeRejectModal()
    closeDetailModal()
  }
}

// 유틸리티 함수
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인 대기',
    APPROVED: '승인 완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700',
    APPROVED: 'px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700',
    REJECTED: 'px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700'
  }
  return classes[status] || 'px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
