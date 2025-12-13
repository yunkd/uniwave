<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">매칭 현황</h1>
      <p class="text-sm sm:text-base text-gray-600">기관 매칭 요청 및 승인 상태를 확인하세요</p>
    </div>

    <!-- 승인됨 -->
    <Card v-if="matchingStatus === 'APPROVED'" class="mb-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircleIcon class="w-6 h-6 text-green-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-green-900 mb-1">기관 매칭 승인 완료</h3>
          <p class="text-sm text-gray-600">
            대학 담당자가 승인했습니다. 아래 기관에서 실습을 진행하실 수 있습니다.
          </p>
        </div>
      </div>

      <!-- 승인된 기관 정보 -->
      <div class="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-xl font-bold text-gray-900 mb-2">{{ institution.name }}</h4>
            <span class="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
              {{ institution.field }}
            </span>
          </div>
          <BuildingOfficeIcon class="w-12 h-12 text-green-600" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div class="flex items-start gap-3">
            <MapPinIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-xs text-gray-600 mb-1">주소</p>
              <p class="text-sm font-medium text-gray-900">{{ institution.address }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <UserIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-xs text-gray-600 mb-1">담당자</p>
              <p class="text-sm font-medium text-gray-900">{{ institution.contactName }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <PhoneIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-xs text-gray-600 mb-1">연락처</p>
              <p class="text-sm font-medium text-gray-900">{{ institution.contactPhone }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <EnvelopeIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-xs text-gray-600 mb-1">이메일</p>
              <p class="text-sm font-medium text-gray-900">{{ institution.contactEmail }}</p>
            </div>
          </div>
        </div>

        <!-- 승인 정보 -->
        <div class="mt-6 pt-4 border-t border-green-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">승인 일시</span>
            <span class="font-medium text-gray-900">{{ formatDate(approvedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 안내 사항 -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex gap-3">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <h5 class="text-sm font-medium text-blue-900 mb-1">다음 단계</h5>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• 기관 담당자에게 연락하여 실습 일정을 조율하세요</li>
              <li>• 출석 체크 및 실습 일지 작성을 시작할 수 있습니다</li>
              <li>• 궁금한 사항은 기관 담당자 또는 대학 담당자에게 문의하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>

    <!-- 대기 중 -->
    <Card v-else-if="matchingStatus === 'PENDING'" class="mb-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ClockIcon class="w-6 h-6 text-yellow-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-yellow-900 mb-1">승인 대기 중</h3>
          <p class="text-sm text-gray-600">
            대학 담당자가 검토 중입니다. 승인되면 알림을 보내드립니다.
          </p>
        </div>
      </div>

      <!-- 요청한 기관 정보 -->
      <div class="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">{{ institution.name }}</h4>
            <span class="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
              {{ institution.field }}
            </span>
          </div>
          <BuildingOfficeIcon class="w-10 h-10 text-yellow-600" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div class="flex items-center gap-2">
            <MapPinIcon class="w-4 h-4 text-gray-400" />
            <p class="text-sm text-gray-600">{{ institution.address }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UserIcon class="w-4 h-4 text-gray-400" />
            <p class="text-sm text-gray-600">{{ institution.contactName }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-yellow-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">요청 일시</span>
            <span class="font-medium text-gray-900">{{ formatDate(requestedAt) }}</span>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <Button variant="outline" @click="cancelRequest">
          요청 취소
        </Button>
      </div>
    </Card>

    <!-- 반려됨 -->
    <Card v-else-if="matchingStatus === 'REJECTED'" class="mb-6">
      <div class="flex items-start gap-4 mb-6">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <XCircleIcon class="w-6 h-6 text-red-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-900 mb-1">매칭 요청 반려</h3>
          <p class="text-sm text-gray-600">
            대학 담당자가 요청을 반려했습니다.
          </p>
        </div>
      </div>

      <!-- 반려 이유 -->
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <h5 class="text-sm font-medium text-red-900 mb-2">반려 사유</h5>
        <p class="text-sm text-red-800">{{ rejectionReason }}</p>
      </div>

      <!-- 요청했던 기관 정보 -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h5 class="text-sm font-medium text-gray-900 mb-1">{{ institution.name }}</h5>
            <p class="text-xs text-gray-600">{{ institution.field }}</p>
          </div>
          <BuildingOfficeIcon class="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <div class="flex justify-end">
        <router-link to="/student/institution-search">
          <Button variant="primary">
            <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
            다른 기관 찾기
          </Button>
        </router-link>
      </div>
    </Card>

    <!-- 매칭 요청 없음 -->
    <Card v-else class="text-center py-12">
      <BuildingOfficeIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">매칭 요청 내역이 없습니다</h3>
      <p class="text-sm text-gray-600 mb-6">
        실습을 진행할 기관을 검색하고 매칭을 요청하세요
      </p>
      <router-link to="/student/institution-search">
        <Button variant="primary">
          <MagnifyingGlassIcon class="w-5 h-5 mr-2" />
          기관 검색하기
        </Button>
      </router-link>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 임시: 매칭 상태 ('APPROVED' | 'PENDING' | 'REJECTED' | null)
const matchingStatus = ref('APPROVED')

const institution = ref({
  name: '사회복지법인 희망나눔',
  field: '노인복지',
  address: '서울시 강남구 테헤란로 123',
  contactName: '김지도 사회복지사',
  contactPhone: '02-1234-5678',
  contactEmail: 'contact@hopeshare.org'
})

const approvedAt = ref(new Date().toISOString())
const requestedAt = ref(new Date(Date.now() - 86400000).toISOString())
const rejectionReason = ref('해당 기관의 실습생 정원이 초과되었습니다. 다른 기관을 선택해주세요.')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cancelRequest = () => {
  if (confirm('매칭 요청을 취소하시겠습니까?')) {
    matchingStatus.value = null
    alert('매칭 요청이 취소되었습니다.')
    router.push('/student/institution-search')
  }
}

// 상태 테스트용:
// matchingStatus.value = 'APPROVED'  // 승인됨
// matchingStatus.value = 'PENDING'   // 대기 중
// matchingStatus.value = 'REJECTED'  // 반려됨
// matchingStatus.value = null        // 요청 없음
</script>
