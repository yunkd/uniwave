<template>
  <div class="max-w-7xl mx-auto">
    <!-- 페이지 헤더 -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">대시보드</h1>
      <p class="text-sm sm:text-base text-gray-600">실습 현황을 한눈에 확인하세요</p>
    </div>

    <!-- 승인된 기관 정보 -->
    <Card v-if="matchedInstitution" class="mb-6 sm:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircleIcon class="w-6 h-6 text-green-600" />
        </div>
        <div class="flex-1">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">{{ matchedInstitution.name }}</h3>
              <span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                {{ matchedInstitution.field }}
              </span>
            </div>
            <router-link to="/student/institution-status">
              <Button variant="outline" size="sm">
                매칭 현황
              </Button>
            </router-link>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div class="flex items-center gap-2">
              <MapPinIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p class="text-sm text-gray-600 truncate">{{ matchedInstitution.address }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UserIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p class="text-sm text-gray-600">{{ matchedInstitution.contactName }}</p>
            </div>
            <div class="flex items-center gap-2">
              <PhoneIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p class="text-sm text-gray-600">{{ matchedInstitution.contactPhone }}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 기관 매칭 안된 경우 -->
    <Card v-else class="mb-6 sm:mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <BuildingOfficeIcon class="w-6 h-6 text-yellow-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">실습 기관 매칭 필요</h3>
          <p class="text-sm text-gray-600 mb-3">
            실습을 시작하려면 기관 매칭이 필요합니다
          </p>
          <router-link to="/student/institution-search">
            <Button variant="primary" size="sm">
              <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
              기관 검색하기
            </Button>
          </router-link>
        </div>
      </div>
    </Card>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">총 실습 시간</p>
            <p class="text-3xl font-bold text-gray-900">0h</p>
            <p class="text-xs text-gray-500 mt-1">/ 160h 필요</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full" style="width: 0%"></div>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 대기</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ExclamationCircleIcon class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">승인 완료</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">제본 신청</p>
            <p class="text-3xl font-bold text-gray-900">0</p>
            <p class="text-xs text-gray-500 mt-1">건</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- 위젯 그리드 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- 캘린더 -->
      <CalendarWidget />

      <!-- 메모 -->
      <MemoWidget />

      <!-- 최근 출석 기록 -->
      <Card>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">최근 출석 기록</h3>
          <router-link
            to="/student/attendance/history"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체보기
          </router-link>
        </div>

        <div class="text-center py-8 sm:py-12 text-gray-500">
          <ClipboardDocumentListIcon class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-sm">출석 기록이 없습니다</p>
          <p class="text-xs mt-1">출석 체크를 시작해보세요</p>
        </div>
      </Card>

      <!-- 실습 일지 -->
      <Card>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">실습 일지</h3>
          <router-link
            to="/student/journal/list"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체보기
          </router-link>
        </div>

        <div class="text-center py-8 sm:py-12 text-gray-500">
          <DocumentTextIcon class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400" />
          <p class="text-sm">실습 일지가 없습니다</p>
          <p class="text-xs mt-1">일지를 작성해보세요</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
import CalendarWidget from '@/components/student/CalendarWidget.vue'
import MemoWidget from '@/components/student/MemoWidget.vue'
import {
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

// 임시: 매칭된 기관 정보 (승인된 경우)
const matchedInstitution = ref({
  id: '1',
  name: '사회복지법인 희망나눔',
  field: '노인복지',
  address: '서울시 강남구 테헤란로 123',
  contactName: '김지도 사회복지사',
  contactPhone: '02-1234-5678',
  email: 'contact@hopeshare.org'
})

// 매칭 안된 경우 테스트: matchedInstitution.value = null
</script>
