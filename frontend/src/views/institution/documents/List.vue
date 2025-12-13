<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">작성 서류 목록</h1>
        <p class="text-xs sm:text-sm text-gray-600">작성한 평가서와 확인서를 관리하세요</p>
      </div>
      <div class="flex gap-2">
        <Button
          variant="outline"
          @click="router.push('/institution/evaluation/create')"
          class="flex-1 sm:flex-initial text-xs sm:text-sm"
        >
          평가서 작성
        </Button>
        <Button
          variant="primary"
          @click="router.push('/institution/certificate/create')"
          class="flex-1 sm:flex-initial text-xs sm:text-sm"
        >
          확인서 작성
        </Button>
      </div>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedType"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 서류</option>
          <option value="EVALUATION">평가서</option>
          <option value="CERTIFICATE">확인서</option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="DRAFT">임시저장</option>
          <option value="SUBMITTED">제출완료</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="학생 이름으로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 서류 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredDocuments.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <DocumentTextIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600 mb-4">작성된 서류가 없습니다</p>
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="outline"
            @click="router.push('/institution/evaluation/create')"
            class="text-xs sm:text-sm"
          >
            평가서 작성하기
          </Button>
          <Button
            variant="primary"
            @click="router.push('/institution/certificate/create')"
            class="text-xs sm:text-sm"
          >
            확인서 작성하기
          </Button>
        </div>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서류 타입
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생 이름
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소속 대학
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    doc.type === 'EVALUATION'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ doc.type === 'EVALUATION' ? '평가서' : '확인서' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ doc.studentName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ doc.university }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ doc.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    doc.status === 'SUBMITTED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ doc.status === 'SUBMITTED' ? '제출완료' : '임시저장' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="handleView(doc)"
                    class="text-primary-600 hover:text-primary-900 font-medium"
                  >
                    보기
                  </button>
                  <button
                    v-if="doc.status === 'DRAFT'"
                    @click="handleEdit(doc)"
                    class="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    수정
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 -->
      <div v-if="filteredDocuments.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="doc in filteredDocuments"
          :key="doc.id"
          class="p-3 sm:p-4 hover:bg-gray-50 cursor-pointer"
          @click="handleView(doc)"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  doc.type === 'EVALUATION'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ doc.type === 'EVALUATION' ? '평가서' : '확인서' }}
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  doc.status === 'SUBMITTED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ doc.status === 'SUBMITTED' ? '제출완료' : '임시저장' }}
              </span>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900 mb-1">{{ doc.studentName }}</p>
          <p class="text-xs text-gray-600 mb-2">{{ doc.university }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ doc.createdAt }}</span>
            <div class="flex items-center gap-2">
              <button
                v-if="doc.status === 'DRAFT'"
                @click.stop="handleEdit(doc)"
                class="text-primary-600 font-medium"
              >
                수정
              </button>
              <ChevronRightIcon class="w-4 h-4" />
            </div>
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
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const selectedType = ref('ALL')
const selectedStatus = ref('ALL')
const searchQuery = ref('')

// 임시 데이터: 작성 서류 목록 (추후 API 연동)
const documents = ref([
  {
    id: '1',
    type: 'EVALUATION',
    studentName: '김학생',
    university: '서울대학교',
    createdAt: '2024-12-10',
    status: 'SUBMITTED'
  },
  {
    id: '2',
    type: 'CERTIFICATE',
    studentName: '김학생',
    university: '서울대학교',
    createdAt: '2024-12-10',
    status: 'SUBMITTED'
  },
  {
    id: '3',
    type: 'EVALUATION',
    studentName: '이실습',
    university: '연세대학교',
    createdAt: '2024-12-11',
    status: 'DRAFT'
  },
  {
    id: '4',
    type: 'CERTIFICATE',
    studentName: '박현장',
    university: '고려대학교',
    createdAt: '2024-12-12',
    status: 'SUBMITTED'
  }
])

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesType = selectedType.value === 'ALL' || doc.type === selectedType.value
    const matchesStatus = selectedStatus.value === 'ALL' || doc.status === selectedStatus.value
    const matchesSearch = !searchQuery.value || doc.studentName.includes(searchQuery.value)
    return matchesType && matchesStatus && matchesSearch
  })
})

const handleView = (doc: any) => {
  alert(`${doc.type === 'EVALUATION' ? '평가서' : '확인서'} 상세 보기 (추후 구현)`)
}

const handleEdit = (doc: any) => {
  const path = doc.type === 'EVALUATION' 
    ? '/institution/evaluation/create'
    : '/institution/certificate/create'
  router.push(path)
}
</script>
