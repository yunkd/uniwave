<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">실습 기관 찾기</h1>
      <p class="text-sm sm:text-base text-gray-600">실습을 진행할 기관을 검색하고 매칭 요청하세요</p>
      <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-xs text-blue-800">
          💡 <strong>대학에서 등록한 협력 기관</strong>들이 자동으로 표시됩니다. 
          원하는 기관을 선택하여 매칭을 요청하세요.
        </p>
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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- 검색어 -->
        <div class="sm:col-span-2">
          <Input
            v-model="searchQuery"
            placeholder="기관명, 주소, 분야로 검색"
            :icon-left="MagnifyingGlassIcon"
          />
        </div>

        <!-- 분야 필터 -->
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
      </div>

      <div class="mt-4 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          총 <span class="font-medium text-primary-600">{{ filteredInstitutions.length }}</span>개의 기관
        </p>
        <Button @click="handleSearch" size="sm">
          검색
        </Button>
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
        </div>

        <Button
          @click="requestMatching(institution)"
          variant="primary"
          full-width
          :disabled="!!matchingStatus"
        >
          <CheckCircleIcon class="w-5 h-5 mr-2" />
          매칭 요청
        </Button>
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
  XCircleIcon
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const filterField = ref('')

// 임시: 현재 매칭 상태
const matchingStatus = ref<any>(null)

// 임시: 기관 목록 데이터
const institutions = ref([
  {
    id: '1',
    name: '사회복지법인 희망나눔',
    field: '노인복지',
    address: '서울시 강남구 테헤란로 123',
    contactName: '김지도',
    contactPhone: '02-1234-5678'
  },
  {
    id: '2',
    name: '행복한우리요양원',
    field: '노인복지',
    address: '서울시 서초구 서초대로 456',
    contactName: '이담당',
    contactPhone: '02-2345-6789'
  },
  {
    id: '3',
    name: '꿈나무아동센터',
    field: '아동복지',
    address: '서울시 송파구 올림픽로 789',
    contactName: '박선생',
    contactPhone: '02-3456-7890'
  },
  {
    id: '4',
    name: '함께하는장애인복지관',
    field: '장애인복지',
    address: '서울시 강동구 천호대로 321',
    contactName: '최팀장',
    contactPhone: '02-4567-8901'
  }
])

const filteredInstitutions = computed(() => {
  let result = institutions.value

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

const handleSearch = () => {
  // 검색 로직 (백엔드 연동 시 API 호출)
  console.log('검색:', searchQuery.value, filterField.value)
}

const requestMatching = (institution: any) => {
  if (confirm(`${institution.name}에 매칭을 요청하시겠습니까?`)) {
    matchingStatus.value = {
      status: 'PENDING',
      institution: institution,
      requestedAt: new Date().toISOString()
    }
    alert('매칭 요청이 완료되었습니다. 대학 담당자의 승인을 기다려주세요.')
  }
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
