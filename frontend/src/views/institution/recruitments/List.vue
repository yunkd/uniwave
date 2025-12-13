<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6">
    <!-- 페이지 헤더 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">모집공고 관리</h1>
        <p class="mt-1 text-sm text-gray-600">실습생 모집공고를 작성하고 관리하세요</p>
      </div>
      <Button variant="primary" @click="router.push('/institution/recruitments/create')">
        <PlusIcon class="w-5 h-5 mr-2" />
        모집공고 작성
      </Button>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="제목으로 검색..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="RECRUITING">모집중</option>
          <option value="CLOSED">마감</option>
        </select>
      </div>
    </Card>

    <!-- 모집공고 목록 -->
    <Card>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">모집분야</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">모집인원</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">실습기간</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">마감일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">지원자</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="recruitment in filteredRecruitments" :key="recruitment.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ recruitment.title }}</div>
                <div class="text-xs text-gray-500">{{ recruitment.createdAt }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ recruitment.field }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <span :class="recruitment.applicants >= recruitment.positions ? 'text-red-600 font-medium' : ''">
                  {{ recruitment.applicants }}/{{ recruitment.positions }}명
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{{ recruitment.duration }}</td>
              <td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                <div>{{ recruitment.deadline }}</div>
                <div v-if="recruitment.daysLeft > 0" class="text-xs text-orange-600">D-{{ recruitment.daysLeft }}</div>
                <div v-else class="text-xs text-gray-500">마감</div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    recruitment.status === 'RECRUITING'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ recruitment.status === 'RECRUITING' ? '모집중' : '마감' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <button
                  @click="viewApplicants(recruitment.id)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  {{ recruitment.applicants }}명 확인
                </button>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <button
                  @click="router.push(`/institution/recruitments/${recruitment.id}`)"
                  class="text-primary-600 hover:text-primary-900 mr-3"
                >
                  수정
                </button>
                <button
                  @click="deleteRecruitment(recruitment.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
            <tr v-if="filteredRecruitments.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-sm text-gray-500">
                <p class="mb-2">등록된 모집공고가 없습니다.</p>
                <Button variant="outline" @click="router.push('/institution/recruitments/create')">
                  첫 모집공고 작성하기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('ALL')

// Mock 데이터
const recruitments = ref([
  {
    id: 1,
    title: '2025년 상반기 사회복지 현장실습생 모집',
    field: '노인복지',
    positions: 5,
    applicants: 2,
    duration: '2025.03.01 ~ 06.30',
    deadline: '2025.02.28',
    daysLeft: 77,
    status: 'RECRUITING',
    createdAt: '2024.12.01'
  },
  {
    id: 2,
    title: '아동복지 현장실습생 모집',
    field: '아동복지',
    positions: 3,
    applicants: 3,
    duration: '2025.03.01 ~ 06.30',
    deadline: '2025.02.15',
    daysLeft: 64,
    status: 'CLOSED',
    createdAt: '2024.11.20'
  }
])

const filteredRecruitments = computed(() => {
  let result = recruitments.value

  if (searchQuery.value) {
    result = result.filter(r =>
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (statusFilter.value !== 'ALL') {
    result = result.filter(r => r.status === statusFilter.value)
  }

  return result
})

const viewApplicants = (id: number) => {
  // TODO: 지원자 목록 모달 또는 페이지로 이동
  alert(`모집공고 ${id}번의 지원자 목록을 확인합니다.`)
}

const deleteRecruitment = (id: number) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    recruitments.value = recruitments.value.filter(r => r.id !== id)
    alert('삭제되었습니다.')
  }
}
</script>
