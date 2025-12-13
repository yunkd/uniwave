<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- 헤더 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <MegaphoneIcon class="w-8 h-8 text-primary-600" />
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">모집공고</h1>
      </div>
      <p class="text-gray-600">실습기관의 최신 모집공고를 확인하고 지원하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">전체 공고</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <MegaphoneIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">모집중</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.recruiting }}</p>
          </div>
          <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">마감임박</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.closing }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">내 지원 현황</p>
            <p class="text-2xl font-bold text-primary-600">{{ stats.myApplications }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 섹션 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <!-- 검색 -->
      <div class="mb-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="기관명, 제목, 내용으로 검색..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- 필터 옵션 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- 지역 필터 -->
        <select
          v-model="filters.region"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">전체 지역</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="광주">광주</option>
          <option value="대전">대전</option>
          <option value="울산">울산</option>
          <option value="기타">기타</option>
        </select>

        <!-- 분야 필터 -->
        <select
          v-model="filters.field"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">전체 분야</option>
          <option value="노인복지">노인복지</option>
          <option value="아동복지">아동복지</option>
          <option value="장애인복지">장애인복지</option>
          <option value="정신보건">정신보건</option>
          <option value="지역복지">지역복지</option>
          <option value="의료복지">의료복지</option>
        </select>

        <!-- 상태 필터 -->
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">전체 상태</option>
          <option value="RECRUITING">모집중</option>
          <option value="CLOSING_SOON">마감임박</option>
          <option value="CLOSED">마감</option>
        </select>

        <!-- 필터 초기화 -->
        <button
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowPathIcon class="w-4 h-4" />
          <span>필터 초기화</span>
        </button>
      </div>

      <!-- 결과 개수 -->
      <div class="mt-4 flex items-center justify-between text-sm">
        <p class="text-gray-600">
          총 <span class="font-semibold text-gray-900">{{ filteredRecruitments.length }}</span>개의 공고
        </p>
        <div class="flex items-center gap-2">
          <label class="text-gray-600">정렬:</label>
          <select
            v-model="sortBy"
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="latest">최신순</option>
            <option value="deadline">마감일순</option>
            <option value="views">조회수순</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 공고 목록 -->
    <div v-if="filteredRecruitments.length > 0" class="space-y-4">
      <div
        v-for="recruitment in filteredRecruitments"
        :key="recruitment.id"
        @click="goToDetail(recruitment.id)"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer p-5"
      >
        <!-- 상단: 기관 정보 & 상태 -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-lg">{{ recruitment.institutionName }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  <MapPinIcon class="w-3 h-3" />
                  {{ recruitment.region }}
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                  <BriefcaseIcon class="w-3 h-3" />
                  {{ recruitment.field }}
                </span>
              </div>
            </div>
          </div>
          <span
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap',
              getStatusClass(recruitment.status)
            ]"
          >
            {{ getStatusLabel(recruitment.status) }}
          </span>
        </div>

        <!-- 제목 -->
        <h4 class="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
          {{ recruitment.title }}
        </h4>

        <!-- 상세 정보 그리드 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <UserGroupIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>모집 인원: <span class="font-medium text-gray-900">{{ recruitment.positions }}명</span></span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>실습 기간: <span class="font-medium text-gray-900">{{ recruitment.duration }}</span></span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>마감일: <span :class="['font-medium', getDaysLeftClass(recruitment.daysLeft)]">{{ recruitment.deadline }}</span></span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <EyeIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>조회수: <span class="font-medium text-gray-900">{{ recruitment.views }}</span></span>
          </div>
        </div>

        <!-- 하단: 태그 & D-Day -->
        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in recruitment.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              #{{ tag }}
            </span>
          </div>
          <div
            v-if="recruitment.daysLeft !== null && recruitment.daysLeft <= 7"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-bold',
              recruitment.daysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
            ]"
          >
            {{ recruitment.daysLeft === 0 ? '오늘 마감' : `D-${recruitment.daysLeft}` }}
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <MagnifyingGlassIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
      <p class="text-gray-600 mb-4">다른 필터 조건으로 검색해보세요</p>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        필터 초기화
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  MegaphoneIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserGroupIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 상태
const searchTerm = ref('')
const sortBy = ref('latest')
const filters = ref({
  region: '',
  field: '',
  status: ''
})

// Mock 통계 데이터
const stats = ref({
  total: 24,
  recruiting: 18,
  closing: 5,
  myApplications: 3
})

// Mock 모집공고 데이터
const recruitments = ref([
  {
    id: 1,
    institutionName: '서울시립노인종합복지관',
    region: '서울',
    field: '노인복지',
    title: '2025년 상반기 사회복지 현장실습생 모집',
    positions: 4,
    duration: '4주',
    deadline: '2025.02.28',
    daysLeft: 2,
    views: 245,
    status: 'CLOSING_SOON',
    tags: ['주말가능', '교통편리', '슈퍼비전']
  },
  {
    id: 2,
    institutionName: '행복한우리요양원',
    region: '경기',
    field: '노인복지',
    title: '현장실습생 상시 모집 (연중 수시 배치)',
    positions: 2,
    duration: '4주',
    deadline: '2025.06.30',
    daysLeft: 15,
    views: 189,
    status: 'RECRUITING',
    tags: ['기숙사제공', '식사제공', '교육프로그램']
  },
  {
    id: 3,
    institutionName: '꿈나무아동센터',
    region: '서울',
    field: '아동복지',
    title: '아동복지 실습생 모집 (3월 시작)',
    positions: 3,
    duration: '4주',
    deadline: '2025.02.15',
    daysLeft: 0,
    views: 312,
    status: 'CLOSING_SOON',
    tags: ['방과후프로그램', '슈퍼비전', '실습비지급']
  },
  {
    id: 4,
    institutionName: '함께하는장애인복지관',
    region: '인천',
    field: '장애인복지',
    title: '2025년 장애인복지 실습생 모집',
    positions: 5,
    duration: '4주',
    deadline: '2025.03.31',
    daysLeft: 28,
    views: 156,
    status: 'RECRUITING',
    tags: ['전문교육', '우수기관', '취업연계']
  },
  {
    id: 5,
    institutionName: '마음의정원 정신건강센터',
    region: '서울',
    field: '정신보건',
    title: '정신보건 분야 실습생 모집 (소수정예)',
    positions: 2,
    duration: '4주',
    deadline: '2025.02.20',
    daysLeft: 5,
    views: 98,
    status: 'CLOSING_SOON',
    tags: ['소수정예', '1:1멘토링', '전문슈퍼비전']
  }
])

// 필터링된 공고 목록
const filteredRecruitments = computed(() => {
  let result = recruitments.value

  // 검색어 필터
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(r =>
      r.institutionName.toLowerCase().includes(term) ||
      r.title.toLowerCase().includes(term) ||
      r.field.toLowerCase().includes(term)
    )
  }

  // 지역 필터
  if (filters.value.region) {
    result = result.filter(r => r.region === filters.value.region)
  }

  // 분야 필터
  if (filters.value.field) {
    result = result.filter(r => r.field === filters.value.field)
  }

  // 상태 필터
  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status)
  }

  // 정렬
  if (sortBy.value === 'latest') {
    result = [...result].sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'deadline') {
    result = [...result].sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999))
  } else if (sortBy.value === 'views') {
    result = [...result].sort((a, b) => b.views - a.views)
  }

  return result
})

// 필터 초기화
const resetFilters = () => {
  searchTerm.value = ''
  filters.value = {
    region: '',
    field: '',
    status: ''
  }
  sortBy.value = 'latest'
}

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    RECRUITING: '모집중',
    CLOSING_SOON: '마감임박',
    CLOSED: '마감'
  }
  return labels[status] || status
}

// 상태 스타일
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    RECRUITING: 'bg-green-100 text-green-700',
    CLOSING_SOON: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// 남은 일수 스타일
const getDaysLeftClass = (daysLeft: number | null) => {
  if (daysLeft === null) return 'text-gray-900'
  if (daysLeft <= 3) return 'text-red-600'
  if (daysLeft <= 7) return 'text-orange-600'
  return 'text-gray-900'
}

// 상세 페이지로 이동
const goToDetail = (id: number) => {
  router.push({ name: 'StudentRecruitmentDetail', params: { id } })
}
</script>
