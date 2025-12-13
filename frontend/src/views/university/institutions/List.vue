<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">기관 관리</h1>
        <p class="text-xs sm:text-sm text-gray-600">협력 기관을 관리하고 매칭 현황을 확인하세요</p>
      </div>
      <Button
        variant="primary"
        @click="router.push('/university/institutions/register')"
        class="text-xs sm:text-sm"
      >
        <PlusIcon class="w-4 h-4 mr-1" />
        기관 등록
      </Button>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">전체 기관</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.total }}개</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-green-600">활성 기관</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ stats.active }}개</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-blue-600">매칭 학생</p>
          <p class="text-lg sm:text-2xl font-bold text-blue-600">{{ stats.matchedStudents }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">평균 만족도</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.avgRating }}</p>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedType"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 유형</option>
          <option value="사회복지관">사회복지관</option>
          <option value="노인복지시설">노인복지시설</option>
          <option value="아동복지시설">아동복지시설</option>
          <option value="장애인복지시설">장애인복지시설</option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="ACTIVE">활성</option>
          <option value="INACTIVE">비활성</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="기관명 또는 담당자로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 기관 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredInstitutions.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <BuildingOfficeIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600 mb-4">등록된 기관이 없습니다</p>
        <Button
          variant="primary"
          @click="router.push('/university/institutions/register')"
          class="text-xs sm:text-sm"
        >
          첫 기관 등록하기
        </Button>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기관 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                유형
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매칭 학생
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                만족도
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
              v-for="institution in filteredInstitutions"
              :key="institution.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ institution.name }}</p>
                  <p class="text-xs text-gray-500">{{ institution.address }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {{ institution.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm text-gray-900">{{ institution.managerName }}</p>
                  <p class="text-xs text-gray-500">{{ institution.managerPhone }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm font-medium text-primary-600">{{ institution.studentCount }}명</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <StarIcon class="w-4 h-4 text-yellow-500 fill-current" />
                  <span class="text-sm font-medium text-gray-900">{{ institution.rating }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    institution.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ institution.status === 'ACTIVE' ? '활성' : '비활성' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="handleViewDetail(institution)"
                >
                  상세 보기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 뷰 -->
      <div v-if="filteredInstitutions.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="institution in filteredInstitutions"
          :key="institution.id"
          class="p-4 hover:bg-gray-50 transition-colors"
          @click="handleViewDetail(institution)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {{ institution.type }}
                </span>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded',
                    institution.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ institution.status === 'ACTIVE' ? '활성' : '비활성' }}
                </span>
              </div>
              <p class="text-sm font-medium text-gray-900">{{ institution.name }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ institution.address }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs text-gray-500 mb-1">담당자</p>
              <p class="text-sm font-medium text-gray-900">{{ institution.managerName }}</p>
              <p class="text-xs text-gray-500">{{ institution.managerPhone }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">매칭 학생</p>
              <p class="text-sm font-medium text-primary-600">{{ institution.studentCount }}명</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-1">
              <StarIcon class="w-4 h-4 text-yellow-500 fill-current" />
              <span class="text-sm font-medium text-gray-900">{{ institution.rating }}</span>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 필터 상태
const selectedType = ref('ALL')
const selectedStatus = ref('ALL')
const searchQuery = ref('')



// 통계 데이터 (Mock)
const stats = ref({
  total: 24,
  active: 22,
  matchedStudents: 145,
  avgRating: 4.6
})

// 기관 목록 (Mock)
const institutions = ref([
  {
    id: '1',
    name: '서울사회복지관',
    type: '사회복지관',
    address: '서울특별시 강남구 테헤란로 123',
    managerName: '홍길동',
    managerPhone: '02-1234-5678',
    studentCount: 18,
    rating: 4.8,
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: '강남노인복지센터',
    type: '노인복지시설',
    address: '서울특별시 강남구 역삼동 456',
    managerName: '김영희',
    managerPhone: '02-2345-6789',
    studentCount: 15,
    rating: 4.6,
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: '아이사랑어린이집',
    type: '아동복지시설',
    address: '서울특별시 서초구 서초동 789',
    managerName: '이철수',
    managerPhone: '02-3456-7890',
    studentCount: 12,
    rating: 4.9,
    status: 'ACTIVE'
  },
  {
    id: '4',
    name: '희망재활센터',
    type: '장애인복지시설',
    address: '서울특별시 송파구 잠실동 321',
    managerName: '박민수',
    managerPhone: '02-4567-8901',
    studentCount: 10,
    rating: 4.5,
    status: 'ACTIVE'
  }
])

// 필터링된 기관 목록
const filteredInstitutions = computed(() => {
  return institutions.value.filter(institution => {
    const matchesType = selectedType.value === 'ALL' || institution.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'ALL' || institution.status === selectedStatus.value
    const matchesSearch = !searchQuery.value ||
      institution.name.includes(searchQuery.value) ||
      institution.managerName.includes(searchQuery.value)
    return matchesType && matchesStatus && matchesSearch
  })
})

// 상세 보기
const handleViewDetail = (institution: any) => {
  router.push(`/university/institutions/${institution.id}`)
}
</script>
