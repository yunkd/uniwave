<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">학생 지원서 관리</h1>
      <p class="text-sm text-gray-600">모집공고에 지원한 학생들의 지원서를 확인하고 관리하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">전체 지원</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">검토 대기</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.pending }}</p>
          </div>
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">수락</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.accepted }}</p>
          </div>
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircleIcon class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">거절</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.rejected }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-6 p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="ALL">전체 상태</option>
          <option value="PENDING">검토 대기</option>
          <option value="ACCEPTED">수락</option>
          <option value="REJECTED">거절</option>
        </select>
        <select
          v-model="selectedRecruitment"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1"
        >
          <option value="ALL">전체 모집공고</option>
          <option v-for="recruitment in recruitments" :key="recruitment.id" :value="recruitment.id">
            {{ recruitment.title }}
          </option>
        </select>
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="학생 이름 또는 학교 검색"
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </Card>

    <!-- 지원서 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredApplications.length === 0" class="p-12 text-center">
        <DocumentTextIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-600 mb-2">지원서가 없습니다</p>
        <p class="text-sm text-gray-500">학생들이 모집공고에 지원하면 여기에 표시됩니다</p>
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
                모집공고
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                지원일
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
            <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ app.studentName }}</p>
                  <p class="text-sm text-gray-600">{{ app.university }}</p>
                  <p class="text-xs text-gray-500">{{ app.email }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-900">{{ app.recruitmentTitle }}</p>
                <p class="text-xs text-gray-500">{{ app.field }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ app.appliedAt }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(app.status)
                  ]"
                >
                  {{ getStatusLabel(app.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewApplication(app)"
                    class="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    상세보기
                  </button>
                  <button
                    v-if="app.resumeUrl"
                    @click="downloadResume(app)"
                    class="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    이력서
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 -->
      <div v-if="filteredApplications.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="app in filteredApplications"
          :key="app.id"
          class="p-4 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ app.studentName }}</p>
              <p class="text-sm text-gray-600">{{ app.university }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ app.email }}</p>
            </div>
            <span
              :class="[
                'inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                getStatusColor(app.status)
              ]"
            >
              {{ getStatusLabel(app.status) }}
            </span>
          </div>
          <div class="mb-3 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-900">{{ app.recruitmentTitle }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ app.field }}</p>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-500">{{ app.appliedAt }}</span>
            <div class="flex items-center gap-2">
              <button
                @click="viewApplication(app)"
                class="text-primary-600 font-medium"
              >
                상세보기
              </button>
              <button
                v-if="app.resumeUrl"
                @click="downloadResume(app)"
                class="text-gray-600 font-medium"
              >
                이력서
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 상세보기 모달 -->
    <Modal v-if="selectedApplication" @close="selectedApplication = null">
      <template #header>
        <h3 class="text-lg font-bold text-gray-900">지원서 상세</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- 학생 정보 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-bold text-gray-900 mb-3">학생 정보</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-gray-600">이름</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.studentName }}</p>
              </div>
              <div>
                <p class="text-gray-600">학교</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.university }}</p>
              </div>
              <div>
                <p class="text-gray-600">이메일</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.email }}</p>
              </div>
              <div>
                <p class="text-gray-600">전화번호</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.phone }}</p>
              </div>
            </div>
          </div>

          <!-- 지원 정보 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-bold text-gray-900 mb-3">지원 정보</h4>
            <div class="space-y-2 text-sm">
              <div>
                <p class="text-gray-600">모집공고</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.recruitmentTitle }}</p>
              </div>
              <div>
                <p class="text-gray-600">지원일</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.appliedAt }}</p>
              </div>
              <div>
                <p class="text-gray-600">희망 실습 기간</p>
                <p class="font-medium text-gray-900">{{ selectedApplication.desiredPeriod }}</p>
              </div>
            </div>
          </div>

          <!-- 지원 메시지 -->
          <div v-if="selectedApplication.message" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="text-sm font-bold text-gray-900 mb-2">지원 메시지</h4>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedApplication.message }}</p>
          </div>

          <!-- 이력서 -->
          <div v-if="selectedApplication.resumeUrl" class="p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-bold text-gray-900 mb-2">첨부 서류</h4>
            <button
              @click="downloadResume(selectedApplication)"
              class="flex items-center gap-2 text-primary-600 hover:text-primary-900"
            >
              <DocumentArrowDownIcon class="w-5 h-5" />
              <span class="text-sm font-medium">이력서 다운로드</span>
            </button>
          </div>

          <!-- 상태 변경 -->
          <div v-if="selectedApplication.status === 'PENDING'" class="flex gap-3">
            <Button
              variant="primary"
              full-width
              @click="acceptApplication(selectedApplication.id)"
            >
              <CheckCircleIcon class="w-5 h-5 mr-2" />
              수락
            </Button>
            <Button
              variant="outline"
              full-width
              @click="rejectApplication(selectedApplication.id)"
            >
              <XCircleIcon class="w-5 h-5 mr-2" />
              거절
            </Button>
          </div>

          <!-- 상태 표시 -->
          <div v-else class="text-center p-4 rounded-lg" :class="selectedApplication.status === 'ACCEPTED' ? 'bg-green-50' : 'bg-red-50'">
            <p class="text-sm font-medium" :class="selectedApplication.status === 'ACCEPTED' ? 'text-green-900' : 'text-red-900'">
              {{ selectedApplication.status === 'ACCEPTED' ? '✅ 수락한 지원서입니다' : '❌ 거절한 지원서입니다' }}
            </p>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const selectedStatus = ref('ALL')
const selectedRecruitment = ref('ALL')
const searchQuery = ref('')
const selectedApplication = ref<any>(null)

// Mock 모집공고 목록
const recruitments = ref([
  { id: 1, title: '사회복지법인 희망나눔 실습생 모집' },
  { id: 2, title: '노인복지관 실습생 모집' }
])

// Mock 지원서 데이터
const applications = ref([
  {
    id: 1,
    studentName: '김학생',
    university: '성균관대학교',
    email: 'student1@skku.edu',
    phone: '010-1234-5678',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.10',
    desiredPeriod: '2025.03.01 ~ 2025.03.28',
    message: '안녕하세요. 사회복지를 전공하고 있는 김학생입니다. 귀 기관에서 실습 기회를 얻고자 지원하게 되었습니다.',
    resumeUrl: '/files/resume1.pdf',
    status: 'PENDING'
  },
  {
    id: 2,
    studentName: '이학생',
    university: '서울대학교',
    email: 'student2@snu.ac.kr',
    phone: '010-2345-6789',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.12',
    desiredPeriod: '2025.03.01 ~ 2025.03.28',
    message: '노인복지에 관심이 많은 학생입니다. 열심히 하겠습니다.',
    resumeUrl: '/files/resume2.pdf',
    status: 'ACCEPTED'
  },
  {
    id: 3,
    studentName: '박학생',
    university: '연세대학교',
    email: 'student3@yonsei.ac.kr',
    phone: '010-3456-7890',
    recruitmentId: 2,
    recruitmentTitle: '노인복지관 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.08',
    desiredPeriod: '2025.02.15 ~ 2025.03.14',
    message: '',
    resumeUrl: null,
    status: 'REJECTED'
  },
  {
    id: 4,
    studentName: '최학생',
    university: '고려대학교',
    email: 'student4@korea.ac.kr',
    phone: '010-4567-8901',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.15',
    desiredPeriod: '2025.03.01 ~ 2025.03.28',
    message: '실습을 통해 많이 배우고 싶습니다.',
    resumeUrl: '/files/resume4.pdf',
    status: 'PENDING'
  }
])

// 통계
const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter(a => a.status === 'PENDING').length,
  accepted: applications.value.filter(a => a.status === 'ACCEPTED').length,
  rejected: applications.value.filter(a => a.status === 'REJECTED').length
}))

// 필터링된 지원서
const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchesStatus = selectedStatus.value === 'ALL' || app.status === selectedStatus.value
    const matchesRecruitment = selectedRecruitment.value === 'ALL' || app.recruitmentId === selectedRecruitment.value
    const matchesSearch = !searchQuery.value || 
      app.studentName.includes(searchQuery.value) ||
      app.university.includes(searchQuery.value)
    return matchesStatus && matchesRecruitment && matchesSearch
  })
})

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'PENDING': '검토 대기',
    'ACCEPTED': '수락',
    'REJECTED': '거절'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-orange-100 text-orange-800',
    'ACCEPTED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const viewApplication = (app: any) => {
  selectedApplication.value = app
}

const downloadResume = (app: any) => {
  alert(`이력서 다운로드 (추후 구현)\n파일: ${app.resumeUrl}`)
  // 실제 구현 시:
  // const link = document.createElement('a')
  // link.href = app.resumeUrl
  // link.download = `${app.studentName}_이력서.pdf`
  // link.click()
}

const acceptApplication = async (id: number) => {
  if (confirm('이 지원서를 수락하시겠습니까?')) {
    const app = applications.value.find(a => a.id === id)
    if (app) {
      app.status = 'ACCEPTED'
      alert('지원서가 수락되었습니다.')
      selectedApplication.value = null
    }
  }
}

const rejectApplication = async (id: number) => {
  if (confirm('이 지원서를 거절하시겠습니까?')) {
    const app = applications.value.find(a => a.id === id)
    if (app) {
      app.status = 'REJECTED'
      alert('지원서가 거절되었습니다.')
      selectedApplication.value = null
    }
  }
}
</script>
