<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">제본 신청 내역</h1>
        <p class="text-xs sm:text-sm text-gray-600">제본 신청 현황과 배송 정보를 확인하세요</p>
      </div>
      <Button
        variant="primary"
        @click="router.push('/student/binding')"
        class="text-xs sm:text-sm"
      >
        <PlusIcon class="w-4 h-4 mr-1.5" />
        새 제본 신청
      </Button>
    </div>

    <!-- 신청 내역 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="bindingRequests.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <TruckIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-sm sm:text-base text-gray-600 mb-4">제본 신청 내역이 없습니다</p>
        <Button
          variant="primary"
          @click="router.push('/student/binding')"
          class="text-xs sm:text-sm"
        >
          <PlusIcon class="w-4 h-4 mr-1.5" />
          첫 제본 신청하기
        </Button>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신청일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                받는 사람
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                배송지
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                송장번호
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="request in bindingRequests" :key="request.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ request.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ request.recipientName }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <p class="line-clamp-1">{{ request.address }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(request.status)
                  ]"
                >
                  {{ getStatusLabel(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span v-if="request.trackingNumber" class="font-mono">{{ request.trackingNumber }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="handleView(request)"
                    class="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    상세
                  </button>
                  <button
                    v-if="request.trackingNumber"
                    @click="trackDelivery(request.trackingNumber)"
                    class="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    배송추적
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 -->
      <div v-if="bindingRequests.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="request in bindingRequests"
          :key="request.id"
          class="p-3 sm:p-4 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs text-gray-500">{{ request.createdAt }}</span>
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(request.status)
              ]"
            >
              {{ getStatusLabel(request.status) }}
            </span>
          </div>
          <p class="text-sm font-medium text-gray-900 mb-1">{{ request.recipientName }}</p>
          <p class="text-xs text-gray-600 mb-2 line-clamp-1">{{ request.address }}</p>
          <div v-if="request.trackingNumber" class="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <TruckIcon class="w-3 h-3" />
            <span class="font-mono">{{ request.trackingNumber }}</span>
          </div>
          <div class="flex items-center justify-end gap-2 text-xs">
            <button
              @click="handleView(request)"
              class="text-primary-600 font-medium"
            >
              상세
            </button>
            <button
              v-if="request.trackingNumber"
              @click="trackDelivery(request.trackingNumber)"
              class="text-gray-600 font-medium"
            >
              배송추적
            </button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  TruckIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 임시 데이터: 제본 신청 내역 (추후 API 연동)
const bindingRequests = ref([
  {
    id: '1',
    recipientName: '김학생',
    recipientPhone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 101동 1001호',
    postalCode: '06234',
    status: 'DELIVERED',
    trackingNumber: '123456789012',
    createdAt: '2024-12-01',
    deliveredAt: '2024-12-05'
  },
  {
    id: '2',
    recipientName: '김학생',
    recipientPhone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 101동 1001호',
    postalCode: '06234',
    status: 'SHIPPED',
    trackingNumber: '987654321098',
    createdAt: '2024-12-10',
    shippedAt: '2024-12-12'
  },
  {
    id: '3',
    recipientName: '김학생',
    recipientPhone: '010-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 101동 1001호',
    postalCode: '06234',
    status: 'PENDING',
    trackingNumber: null,
    createdAt: '2024-12-13'
  }
])

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '접수',
    CONFIRMED: '확인됨',
    PRINTING: '인쇄중',
    SHIPPED: '배송중',
    DELIVERED: '배송완료',
    CANCELLED: '취소'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PRINTING: 'bg-yellow-100 text-yellow-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const handleView = (request: any) => {
  alert(`신청 상세 정보 (추후 모달 구현)\n\n받는 사람: ${request.recipientName}\n주소: ${request.address}\n상태: ${getStatusLabel(request.status)}`)
}

const trackDelivery = (trackingNumber: string) => {
  alert(`배송 추적 (추후 구현)\n송장번호: ${trackingNumber}`)
  // 추후 구현: 택배사 API 연동
}
</script>
