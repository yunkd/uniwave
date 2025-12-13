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
    <div class="space-y-4">
      <!-- 빈 상태 -->
      <Card v-if="filteredApplications.length === 0" class="p-12 text-center">
        <DocumentTextIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-600 mb-2">지원서가 없습니다</p>
        <p class="text-sm text-gray-500">학생들이 모집공고에 지원하면 여기에 표시됩니다</p>
      </Card>

      <!-- 아코디언 스타일 지원서 카드 -->
      <Card
        v-for="app in filteredApplications"
        :key="app.id"
        class="overflow-hidden"
      >
        <!-- 요약 헤더 (항상 표시) -->
        <div
          @click="toggleApplication(app.id)"
          class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <!-- 좌측: 학생 정보 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-primary-700 font-bold text-sm">{{ app.name.charAt(0) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-lg font-bold text-gray-900">{{ app.name }}</h3>
                    <span
                      :class="[
                        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(app.status)
                      ]"
                    >
                      {{ getStatusLabel(app.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ app.recruitmentTitle }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm ml-13">
                <div class="flex items-center gap-1 text-gray-600">
                  <CalendarIcon class="w-4 h-4" />
                  <span>{{ app.appliedAt }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-600">
                  <EnvelopeIcon class="w-4 h-4" />
                  <span>{{ app.email }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-600">
                  <PhoneIcon class="w-4 h-4" />
                  <span>{{ app.phone }}</span>
                </div>
              </div>
            </div>

            <!-- 우측: 펼침 아이콘 -->
            <ChevronDownIcon
              :class="[
                'w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ml-4',
                expandedIds.includes(app.id) ? 'transform rotate-180' : ''
              ]"
            />
          </div>
        </div>

        <!-- 상세 내용 (펼쳤을 때만 표시) -->
        <div
          v-if="expandedIds.includes(app.id)"
          class="border-t border-gray-200 bg-gray-50 p-6"
        >
          <div class="space-y-6">
            <!-- 지원 공고 정보 -->
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="text-sm font-bold text-blue-900 mb-2">지원 공고</h4>
              <p class="text-sm font-medium text-blue-800">{{ app.institutionName }}</p>
              <p class="text-sm text-blue-700">{{ app.recruitmentTitle }}</p>
              <p class="text-xs text-blue-600 mt-1">{{ app.field }}</p>
            </div>

            <!-- 지원자 정보 -->
            <div class="p-4 bg-white rounded-lg border border-gray-200">
              <h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon class="w-4 h-4" />
                지원자 정보
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="flex justify-between p-2 bg-gray-50 rounded">
                  <span class="text-gray-600">이름</span>
                  <span class="font-medium text-gray-900">{{ app.name }}</span>
                </div>
                <div class="flex justify-between p-2 bg-gray-50 rounded">
                  <span class="text-gray-600">연락처</span>
                  <span class="font-medium text-gray-900">{{ app.phone }}</span>
                </div>
                <div class="flex justify-between p-2 bg-gray-50 rounded col-span-1 sm:col-span-2">
                  <span class="text-gray-600">이메일</span>
                  <span class="font-medium text-gray-900">{{ app.email }}</span>
                </div>
                <div class="flex justify-between p-2 bg-gray-50 rounded">
                  <span class="text-gray-600">지원일</span>
                  <span class="font-medium text-gray-900">{{ app.appliedAt }}</span>
                </div>
              </div>
            </div>

            <!-- 자기소개 -->
            <div v-if="app.introduction" class="p-4 bg-white border border-gray-200 rounded-lg">
              <h4 class="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ChatBubbleLeftIcon class="w-4 h-4" />
                자기소개
              </h4>
              <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ app.introduction }}</p>
            </div>

            <!-- 이력서 다운로드 -->
            <div class="p-4 bg-white border-2 border-primary-200 rounded-lg">
              <h4 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <DocumentTextIcon class="w-4 h-4 text-primary-600" />
                첨부 이력서
              </h4>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ app.resumeFileName }}</p>
                    <p class="text-xs text-gray-500">{{ app.resumeFileSize }}</p>
                  </div>
                </div>
                <button
                  @click="downloadResume(app)"
                  class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <DocumentArrowDownIcon class="w-5 h-5" />
                  <span class="font-medium">다운로드</span>
                </button>
              </div>
            </div>

            <!-- 개인정보 동의 확인 -->
            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center gap-2 text-sm text-green-800">
                <CheckCircleIcon class="w-4 h-4" />
                <span class="font-medium">개인정보 수집 및 이용에 동의함</span>
              </div>
            </div>

            <!-- 상태 변경 버튼 -->
            <div class="flex gap-3 pt-4 border-t border-gray-300">
              <template v-if="app.status === 'PENDING'">
                <Button
                  variant="primary"
                  full-width
                  @click="acceptApplication(app.id)"
                >
                  <CheckCircleIcon class="w-5 h-5 mr-2" />
                  수락
                </Button>
                <Button
                  variant="outline"
                  full-width
                  @click="rejectApplication(app.id)"
                >
                  <XCircleIcon class="w-5 h-5 mr-2" />
                  거절
                </Button>
              </template>
              <div
                v-else
                class="w-full text-center p-3 rounded-lg"
                :class="app.status === 'ACCEPTED' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'"
              >
                <p class="text-sm font-bold" :class="app.status === 'ACCEPTED' ? 'text-green-900' : 'text-red-900'">
                  {{ app.status === 'ACCEPTED' ? '✅ 수락한 지원서입니다' : '❌ 거절한 지원서입니다' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const selectedStatus = ref('ALL')
const selectedRecruitment = ref('ALL')
const searchQuery = ref('')
const expandedIds = ref<number[]>([])

// Mock 모집공고 목록
const recruitments = ref([
  { id: 1, title: '사회복지법인 희망나눔 실습생 모집' },
  { id: 2, title: '노인복지관 실습생 모집' }
])

// Mock 지원서 데이터 (학생이 실제로 작성한 양식)
const applications = ref([
  {
    id: 1,
    // 지원자 정보
    name: '김학생',
    phone: '010-1234-5678',
    email: 'student1@skku.edu',
    // 이력서
    resumeFileName: '김학생_이력서.pdf',
    resumeFileSize: '1.2 MB',
    resumeUrl: '/files/resume1.pdf',
    // 자기소개
    introduction: '안녕하세요. 사회복지를 전공하고 있는 김학생입니다.\n\n귀 기관에서 실습 기회를 얻고자 지원하게 되었습니다. 노인복지에 대한 깊은 관심을 가지고 있으며, 이론으로 배운 지식을 실무에 적용하고 싶습니다.\n\n성실하게 임하겠습니다. 감사합니다.',
    // 개인정보 동의
    agreedToPrivacy: true,
    // 지원 정보
    institutionName: '사회복지법인 희망나눔',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.10',
    status: 'PENDING'
  },
  {
    id: 2,
    name: '이학생',
    phone: '010-2345-6789',
    email: 'student2@snu.ac.kr',
    resumeFileName: '이학생_이력서.hwp',
    resumeFileSize: '856 KB',
    resumeUrl: '/files/resume2.hwp',
    introduction: '노인복지에 관심이 많은 학생입니다.\n\n사회복지사 자격증 취득을 위해 열심히 실습에 임하겠습니다.',
    agreedToPrivacy: true,
    institutionName: '사회복지법인 희망나눔',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.12',
    status: 'ACCEPTED'
  },
  {
    id: 3,
    name: '박학생',
    phone: '010-3456-7890',
    email: 'student3@yonsei.ac.kr',
    resumeFileName: '박학생_Resume.pdf',
    resumeFileSize: '2.1 MB',
    resumeUrl: '/files/resume3.pdf',
    introduction: '', // 자기소개 작성 안 함
    agreedToPrivacy: true,
    institutionName: '노인복지관',
    recruitmentId: 2,
    recruitmentTitle: '노인복지관 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.08',
    status: 'REJECTED'
  },
  {
    id: 4,
    name: '최학생',
    phone: '010-4567-8901',
    email: 'student4@korea.ac.kr',
    resumeFileName: '최학생_이력서_2025.pdf',
    resumeFileSize: '1.5 MB',
    resumeUrl: '/files/resume4.pdf',
    introduction: '실습을 통해 많이 배우고 싶습니다.\n\n사회복지 현장에서 일하는 것이 꿈이며, 이번 실습을 통해 실무 경험을 쌓고 싶습니다.',
    agreedToPrivacy: true,
    institutionName: '사회복지법인 희망나눔',
    recruitmentId: 1,
    recruitmentTitle: '사회복지법인 희망나눔 실습생 모집',
    field: '노인복지',
    appliedAt: '2025.01.15',
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
      app.name.includes(searchQuery.value) ||
      app.email.includes(searchQuery.value)
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

const toggleApplication = (id: number) => {
  const index = expandedIds.value.indexOf(id)
  if (index > -1) {
    expandedIds.value.splice(index, 1)
  } else {
    expandedIds.value.push(id)
  }
}

const downloadResume = (app: any) => {
  alert(`이력서 다운로드 (추후 구현)\n파일명: ${app.resumeFileName}\n파일 경로: ${app.resumeUrl}`)
  // 실제 구현 시:
  // const link = document.createElement('a')
  // link.href = app.resumeUrl
  // link.download = app.resumeFileName
  // link.click()
}

const acceptApplication = async (id: number) => {
  if (confirm('이 지원서를 수락하시겠습니까?')) {
    const app = applications.value.find(a => a.id === id)
    if (app) {
      app.status = 'ACCEPTED'
      alert('지원서가 수락되었습니다.')
    }
  }
}

const rejectApplication = async (id: number) => {
  if (confirm('이 지원서를 거절하시겠습니까?')) {
    const app = applications.value.find(a => a.id === id)
    if (app) {
      app.status = 'REJECTED'
      alert('지원서가 거절되었습니다.')
    }
  }
}
</script>
