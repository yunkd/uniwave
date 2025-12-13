<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 뒤로 가기 -->
    <Button
      variant="ghost"
      size="sm"
      @click="router.back()"
      class="mb-4 text-xs sm:text-sm"
    >
      <ChevronLeftIcon class="w-4 h-4 mr-1" />
      목록으로
    </Button>

    <!-- 기관 기본 정보 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ institutionInfo.name }}</h1>
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {{ institutionInfo.type }}
            </span>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                institutionInfo.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ institutionInfo.status === 'ACTIVE' ? '활성' : '비활성' }}
            </span>
          </div>
        </div>
        <Button variant="outline" class="text-xs sm:text-sm">
          정보 수정
        </Button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500 mb-1">주소</p>
          <p class="text-sm font-medium text-gray-900">{{ institutionInfo.address }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">담당자</p>
          <p class="text-sm font-medium text-gray-900">{{ institutionInfo.managerName }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">연락처</p>
          <p class="text-sm font-medium text-gray-900">{{ institutionInfo.managerPhone }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-1">이메일</p>
          <p class="text-sm font-medium text-gray-900">{{ institutionInfo.email }}</p>
        </div>
      </div>
    </Card>

    <!-- 통계 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">매칭 학생</p>
          <p class="text-lg sm:text-2xl font-bold text-primary-600">{{ institutionInfo.studentCount }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">평균 만족도</p>
          <p class="text-lg sm:text-2xl font-bold text-yellow-600">{{ institutionInfo.rating }}</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">총 실습생</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ institutionInfo.totalStudents }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">완료 학생</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ institutionInfo.completedStudents }}명</p>
        </div>
      </Card>
    </div>

    <!-- 매칭된 학생 목록 -->
    <Card class="p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">매칭된 학생</h2>
      
      <div v-if="matchedStudents.length === 0" class="text-center py-8 text-gray-500">
        <UserGroupIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p class="text-sm">매칭된 학생이 없습니다</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="student in matchedStudents"
          :key="student.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {{ student.name[0] }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
              <p class="text-xs text-gray-500">{{ student.department }} · {{ student.studentId }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-xs text-gray-500">실습 시간</p>
              <p class="text-sm font-medium text-gray-900">{{ student.completedHours }} / {{ student.requiredHours }}시간</p>
            </div>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              ]"
            >
              {{ student.status === 'ACTIVE' ? '실습중' : '완료' }}
            </span>
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
import { ChevronLeftIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

// 기관 정보 (Mock)
const institutionInfo = ref({
  name: '서울사회복지관',
  type: '사회복지관',
  address: '서울특별시 강남구 테헤란로 123',
  managerName: '홍길동',
  managerPhone: '02-1234-5678',
  email: 'seoul@welfare.org',
  status: 'ACTIVE',
  studentCount: 18,
  rating: 4.8,
  totalStudents: 45,
  completedStudents: 27
})

// 매칭된 학생 (Mock)
const matchedStudents = ref([
  {
    id: '1',
    name: '김민수',
    studentId: '2021012345',
    department: '사회복지학과',
    completedHours: 144,
    requiredHours: 200,
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: '이영희',
    studentId: '2021023456',
    department: '사회복지학과',
    completedHours: 120,
    requiredHours: 200,
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: '박철수',
    studentId: '2020034567',
    department: '사회복지학과',
    completedHours: 200,
    requiredHours: 200,
    status: 'COMPLETED'
  }
])
</script>
