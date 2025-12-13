<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">실습 기관 검색</h1>
          <p class="text-sm sm:text-base text-gray-600">대학 협력 기관 정보를 조회하세요</p>
        </div>
        <Button @click="router.push('/student/matching/request')" variant="primary">
          <CheckCircleIcon class="w-5 h-5 mr-2" />
          매칭 신청하기
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-xs text-blue-800">
            💡 <strong>기관 정보 확인</strong><br>
            협력 기관의 위치, 분야, 연락처 등을 미리 확인할 수 있습니다.
          </p>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p class="text-xs text-amber-800">
            ⚠️ <strong>매칭 신청 방법</strong><br>
            기관과 사전 협의 후 발급받은 <strong>기관 코드</strong>로 매칭을 신청하세요.
          </p>
        </div>
      </div>
    </div>

    <!-- 현재 매칭 상태 -->
    <Card v-if="matchingStatus" class="mb-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          :class="getStatusBgColor(matchingStatus.status)"
        >
          <component :is="getStatusIcon(matchingStatus.status)" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h3 class="text-base sm:text-lg font-semibold mb-1" :class="getStatusTextColor(matchingStatus.status)">
            {{ getStatusLabel(matchingStatus.status) }}
          </h3>
          <p class="text-sm text-gray-600 mb-3">
            {{ getStatusDescription(matchingStatus.status) }}
          </p>
          
          <div v-if="matchingStatus.institution" class="p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-600">기관명</p>
                <p class="text-sm font-medium text-gray-900">{{ matchingStatus.institution.name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">분야</p>
                <p class="text-sm font-medium text-gray-900">{{ matchingStatus.institution.field }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">주소</p>
                <p class="text-sm font-medium text-gray-900">{{ matchingStatus.institution.address }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600">담당자</p>
                <p class="text-sm font-medium text-gray-900">{{ matchingStatus.institution.contact }}</p>
              </div>
            </div>
          </div>

          <div v-if="matchingStatus.status === 'PENDING'" class="mt-4">
            <Button variant="outline" size="sm" @click="cancelRequest">
              매칭 요청 취소
            </Button>
          </div>
        </div>
      </div>
    </Card>

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

      <!-- 세 번째 행: 분야 및 상태 필터 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          v-model="filterField"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">전체 분야</option>
          <option value="노인복지">노인복지</option>
          <option value="아동복지">아동복지</option>
          <option value="장애인복지">장애인복지</option>
          <option value="정신보건">정신보건</option>
          <option value="지역복지">지역복지</option>
          <option value="의료복지">의료복지</option>
        </select>

        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">전체 상태</option>
          <option value="RECRUITING">모집중</option>
          <option value="CLOSED">마감</option>
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

        <div class="space-y-2 mb-4">
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
          <div class="flex items-center gap-2">
            <span :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              institution.status === 'RECRUITING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ institution.status === 'RECRUITING' ? '모집중' : '마감' }}
            </span>
            <span v-if="institution.capacity" class="text-xs text-gray-500">
              ({{ institution.currentStudents || 0 }}/{{ institution.capacity }}명)
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <Button
            @click="viewDetail(institution)"
            variant="outline"
            full-width
          >
            <InformationCircleIcon class="w-5 h-5 mr-1" />
            상세 정보
          </Button>
          <Button
            @click="copyContact(institution)"
            variant="outline"
            full-width
          >
            <PhoneIcon class="w-5 h-5 mr-1" />
            연락처 복사
          </Button>
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
  PhoneIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const filterField = ref('')
const filterCity = ref('')
const filterDistrict = ref('')
const filterDong = ref('')
const filterStatus = ref('')

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

// 임시: 현재 매칭 상태
const matchingStatus = ref<any>(null)

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

  // 상태 필터
  if (filterStatus.value) {
    result = result.filter(i => i.status === filterStatus.value)
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
  filterStatus.value = ''
}

const handleSearch = () => {
  // 검색 로직 (백엔드 연동 시 API 호출)
  console.log('검색:', {
    query: searchQuery.value,
    city: filterCity.value,
    district: filterDistrict.value,
    dong: filterDong.value,
    field: filterField.value,
    status: filterStatus.value
  })
}

const viewDetail = (institution: any) => {
  // TODO: 기관 상세 정보 모달 또는 페이지로 이동
  alert(`${institution.name}\n\n주소: ${institution.address}\n분야: ${institution.field}\n담당자: ${institution.contactName}\n연락처: ${institution.contactPhone}\n\n💡 기관과 사전 협의 후 "매칭 신청하기"에서 기관 코드를 입력하여 신청하세요.`)
}

const copyContact = (institution: any) => {
  navigator.clipboard.writeText(institution.contactPhone)
  alert(`연락처가 복사되었습니다.\n${institution.contactPhone}`)
}

const cancelRequest = () => {
  if (confirm('매칭 요청을 취소하시겠습니까?')) {
    matchingStatus.value = null
    alert('매칭 요청이 취소되었습니다.')
  }
}

const getStatusBgColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100',
    'APPROVED': 'bg-green-100',
    'REJECTED': 'bg-red-100'
  }
  return colors[status] || 'bg-gray-100'
}

const getStatusTextColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'text-yellow-900',
    'APPROVED': 'text-green-900',
    'REJECTED': 'text-red-900'
  }
  return colors[status] || 'text-gray-900'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    'PENDING': ClockIcon,
    'APPROVED': CheckCircleIcon,
    'REJECTED': XCircleIcon
  }
  return icons[status] || ClockIcon
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'PENDING': '매칭 요청 대기 중',
    'APPROVED': '매칭 승인 완료',
    'REJECTED': '매칭 요청 반려'
  }
  return labels[status] || '알 수 없음'
}

const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    'PENDING': '대학 담당자가 검토 중입니다. 승인되면 기관에 초대 메일이 발송됩니다.',
    'APPROVED': '기관 매칭이 완료되었습니다. 실습을 시작할 수 있습니다.',
    'REJECTED': '매칭 요청이 반려되었습니다. 다른 기관을 선택해주세요.'
  }
  return descriptions[status] || ''
}
</script>
