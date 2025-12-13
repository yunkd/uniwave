<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <div class="mb-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">실습 기관 검색</h1>
        <p class="text-sm sm:text-base text-gray-600">대학 협력 기관 정보를 조회하세요</p>
      </div>
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          💡 협력 기관의 위치, 분야, 연락처 등을 검색하고 확인할 수 있습니다.
        </p>
      </div>
    </div>

    <!-- 검색 필터 -->
    <Card class="mb-6">
      <!-- 첫 번째 행: 검색어 -->
      <div class="mb-4">
        <Input
          v-model="searchQuery"
          placeholder="기관명, 주소, 분야로 검색"
          :icon-left="MagnifyingGlassIcon"
        />
      </div>

      <!-- 두 번째 행: 지역 필터 (시/구/동) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <select
          v-model="filterCity"
          @change="onCityChange"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">전체 시</option>
          <option value="서울시">서울시</option>
          <option value="경기도">경기도</option>
          <option value="인천시">인천시</option>
          <option value="부산시">부산시</option>
          <option value="대구시">대구시</option>
          <option value="광주시">광주시</option>
          <option value="대전시">대전시</option>
          <option value="울산시">울산시</option>
        </select>

        <select
          v-model="filterDistrict"
          @change="onDistrictChange"
          :disabled="!filterCity"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">전체 구</option>
          <option v-for="district in availableDistricts" :key="district" :value="district">
            {{ district }}
          </option>
        </select>

        <select
          v-model="filterDong"
          :disabled="!filterDistrict"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">전체 동</option>
          <option v-for="dong in availableDongs" :key="dong" :value="dong">
            {{ dong }}
          </option>
        </select>
      </div>

      <!-- 세 번째 행: 분야 필터 -->
      <div>
        <select
          v-model="filterField"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
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

      <div class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          총 <span class="font-medium text-primary-600">{{ filteredInstitutions.length }}</span>개의 기관
        </p>
        <div class="flex gap-2">
          <Button @click="resetFilters" variant="outline" size="sm">
            초기화
          </Button>
          <Button @click="handleSearch" size="sm">
            검색
          </Button>
        </div>
      </div>
    </Card>

    <!-- 기관 목록 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <Card
        v-for="institution in filteredInstitutions"
        :key="institution.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {{ institution.name }}
            </h3>
            <span class="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
              {{ institution.field }}
            </span>
          </div>
          <BuildingOfficeIcon class="w-10 h-10 text-gray-400 flex-shrink-0" />
        </div>

        <div class="space-y-2">
          <div class="flex items-start gap-2">
            <MapPinIcon class="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p class="text-sm text-gray-600">{{ institution.address }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UserIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="text-sm text-gray-600">{{ institution.contactName }}</p>
          </div>
          <div class="flex items-center gap-2">
            <PhoneIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p class="text-sm text-gray-600">{{ institution.contactPhone }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- 검색 결과 없음 -->
    <div v-if="filteredInstitutions.length === 0" class="text-center py-12">
      <BuildingOfficeIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 mb-2">검색 결과가 없습니다</p>
      <p class="text-sm text-gray-500">다른 검색어나 필터를 시도해보세요</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Card from '@/components/common/Card.vue'
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const filterField = ref('')
const filterCity = ref('')
const filterDistrict = ref('')
const filterDong = ref('')

// 지역 데이터 (시/구/동)
const regionData: Record<string, Record<string, string[]>> = {
  '서울시': {
    '강남구': ['역삼동', '논현동', '삼성동', '대치동', '개포동'],
    '서초구': ['서초동', '잠원동', '반포동', '방배동', '양재동'],
    '송파구': ['잠실동', '신천동', '풍납동', '석촌동', '가락동'],
    '강동구': ['명일동', '고덕동', '상일동', '천호동', '성내동']
  },
  '경기도': {
    '수원시': ['영통구', '장안구', '권선구', '팔달구'],
    '성남시': ['분당구', '수정구', '중원구'],
    '고양시': ['일산동구', '일산서구', '덕양구']
  }
}

// 임시: 기관 목록 데이터
const institutions = ref([
  {
    id: '1',
    name: '사회복지법인 희망나눔',
    field: '노인복지',
    address: '서울시 강남구 역삼동 123',
    city: '서울시',
    district: '강남구',
    dong: '역삼동',
    contactName: '김지도',
    contactPhone: '02-1234-5678',
    status: 'RECRUITING',
    capacity: 5,
    currentStudents: 2
  },
  {
    id: '2',
    name: '행복한우리요양원',
    field: '노인복지',
    address: '서울시 서초구 서초동 456',
    city: '서울시',
    district: '서초구',
    dong: '서초동',
    contactName: '이담당',
    contactPhone: '02-2345-6789',
    status: 'RECRUITING',
    capacity: 3,
    currentStudents: 1
  },
  {
    id: '3',
    name: '꿈나무아동센터',
    field: '아동복지',
    address: '서울시 송파구 잠실동 789',
    city: '서울시',
    district: '송파구',
    dong: '잠실동',
    contactName: '박선생',
    contactPhone: '02-3456-7890',
    status: 'CLOSED',
    capacity: 4,
    currentStudents: 4
  },
  {
    id: '4',
    name: '함께하는장애인복지관',
    field: '장애인복지',
    address: '서울시 강동구 천호동 321',
    city: '서울시',
    district: '강동구',
    dong: '천호동',
    contactName: '최팀장',
    contactPhone: '02-4567-8901',
    status: 'RECRUITING',
    capacity: 6,
    currentStudents: 3
  },
  {
    id: '5',
    name: '경기사회복지센터',
    field: '지역복지',
    address: '경기도 수원시 영통구',
    city: '경기도',
    district: '수원시',
    dong: '영통구',
    contactName: '정관리',
    contactPhone: '031-1234-5678',
    status: 'RECRUITING',
    capacity: 8,
    currentStudents: 2
  }
])

// 선택 가능한 구 목록
const availableDistricts = computed(() => {
  if (!filterCity.value) return []
  return Object.keys(regionData[filterCity.value] || {})
})

// 선택 가능한 동 목록
const availableDongs = computed(() => {
  if (!filterCity.value || !filterDistrict.value) return []
  return regionData[filterCity.value]?.[filterDistrict.value] || []
})

const filteredInstitutions = computed(() => {
  let result = institutions.value

  // 지역 필터 (시)
  if (filterCity.value) {
    result = result.filter(i => i.city === filterCity.value)
  }

  // 지역 필터 (구)
  if (filterDistrict.value) {
    result = result.filter(i => i.district === filterDistrict.value)
  }

  // 지역 필터 (동)
  if (filterDong.value) {
    result = result.filter(i => i.dong === filterDong.value)
  }

  // 분야 필터
  if (filterField.value) {
    result = result.filter(i => i.field === filterField.value)
  }

  // 검색어 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(i => 
      i.name.toLowerCase().includes(query) ||
      i.address.toLowerCase().includes(query) ||
      i.field.toLowerCase().includes(query)
    )
  }

  return result
})

// 시 변경 시 구/동 초기화
const onCityChange = () => {
  filterDistrict.value = ''
  filterDong.value = ''
}

// 구 변경 시 동 초기화
const onDistrictChange = () => {
  filterDong.value = ''
}

// 필터 초기화
const resetFilters = () => {
  searchQuery.value = ''
  filterCity.value = ''
  filterDistrict.value = ''
  filterDong.value = ''
  filterField.value = ''
}

const handleSearch = () => {
  // 검색 로직 (백엔드 연동 시 API 호출)
  console.log('검색:', {
    query: searchQuery.value,
    city: filterCity.value,
    district: filterDistrict.value,
    dong: filterDong.value,
    field: filterField.value
  })
}
</script>
