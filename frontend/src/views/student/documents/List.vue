<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">내 서류</h1>
      <p class="text-xs sm:text-sm text-gray-600">기관에서 발급한 평가서와 확인서를 확인하세요</p>
    </div>

    <!-- 서류 통계 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-0.5">평가서</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ evaluationCount }}개</p>
          </div>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardDocumentCheckIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-0.5">확인서</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ certificateCount }}개</p>
          </div>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <DocumentDuplicateIcon class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm text-gray-600 mb-0.5">전체 서류</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ totalCount }}개</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- 필터 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedType"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 서류</option>
          <option value="INSTITUTION_EVAL">평가서</option>
          <option value="INSTITUTION_CERT">확인서</option>
        </select>
        <div class="flex-1 relative">
          <CalendarIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchDate"
            type="text"
            placeholder="발급일 검색 (YYYY-MM-DD)"
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
        <p class="text-sm sm:text-base text-gray-600 mb-1">발급된 서류가 없습니다</p>
        <p class="text-xs sm:text-sm text-gray-500">기관에서 평가서 또는 확인서를 발급하면 여기에 표시됩니다</p>
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
                발급 기관
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                발급일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                파일명
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <component
                    :is="getDocumentIcon(doc.type)"
                    :class="getDocumentIconColor(doc.type)"
                    class="w-5 h-5"
                  />
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      doc.type === 'INSTITUTION_EVAL'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ getDocumentTypeLabel(doc.type) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ doc.institutionName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ doc.createdAt }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <DocumentArrowDownIcon class="w-4 h-4 text-gray-400" />
                  <span class="truncate max-w-xs">{{ doc.fileName }}</span>
                </div>
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
                    @click="handleDownload(doc)"
                    class="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    다운로드
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
          class="p-3 sm:p-4 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <component
                :is="getDocumentIcon(doc.type)"
                :class="getDocumentIconColor(doc.type)"
                class="w-5 h-5"
              />
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  doc.type === 'INSTITUTION_EVAL'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ getDocumentTypeLabel(doc.type) }}
              </span>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900 mb-1">{{ doc.institutionName }}</p>
          <p class="text-xs text-gray-600 mb-2 flex items-center gap-1">
            <DocumentArrowDownIcon class="w-3 h-3" />
            <span class="truncate">{{ doc.fileName }}</span>
          </p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ doc.createdAt }}</span>
            <div class="flex items-center gap-2">
              <button
                @click="handleView(doc)"
                class="text-primary-600 font-medium"
              >
                보기
              </button>
              <button
                @click="handleDownload(doc)"
                class="text-gray-600 font-medium"
              >
                다운로드
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- 안내 메시지 -->
    <Card class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border-blue-200">
      <div class="flex items-start gap-3">
        <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="text-sm font-medium text-blue-900 mb-1">제본 신청 안내</p>
          <p class="text-xs text-blue-800">
            평가서와 확인서가 모두 발급되면 제본 신청이 가능합니다. 
            제본 신청 시 출석부, 실습 일지, 평가서, 확인서가 하나의 PDF로 결합됩니다.
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/common/Card.vue'
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const selectedType = ref('ALL')
const searchDate = ref('')

// 임시 데이터: 학생 서류 목록 (추후 API 연동)
const documents = ref([
  {
    id: '1',
    type: 'INSTITUTION_EVAL',
    institutionName: '사회복지법인 희망나눔',
    fileName: '실습평가서_김학생_2024.pdf',
    fileUrl: '/documents/evaluation_1.pdf',
    createdAt: '2024-12-10'
  },
  {
    id: '2',
    type: 'INSTITUTION_CERT',
    institutionName: '사회복지법인 희망나눔',
    fileName: '실습확인서_김학생_2024.pdf',
    fileUrl: '/documents/certificate_1.pdf',
    createdAt: '2024-12-10'
  },
  {
    id: '3',
    type: 'INSTITUTION_EVAL',
    institutionName: '서울시립복지관',
    fileName: '실습평가서_김학생_2024_2.pdf',
    fileUrl: '/documents/evaluation_2.pdf',
    createdAt: '2024-12-11'
  }
])

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesType = selectedType.value === 'ALL' || doc.type === selectedType.value
    const matchesDate = !searchDate.value || doc.createdAt.includes(searchDate.value)
    return matchesType && matchesDate
  })
})

const evaluationCount = computed(() => {
  return documents.value.filter(d => d.type === 'INSTITUTION_EVAL').length
})

const certificateCount = computed(() => {
  return documents.value.filter(d => d.type === 'INSTITUTION_CERT').length
})

const totalCount = computed(() => {
  return documents.value.length
})

const getDocumentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'INSTITUTION_EVAL': '평가서',
    'INSTITUTION_CERT': '확인서'
  }
  return labels[type] || type
}

const getDocumentIcon = (type: string) => {
  return type === 'INSTITUTION_EVAL' ? DocumentTextIcon : ClipboardDocumentCheckIcon
}

const getDocumentIconColor = (type: string) => {
  return type === 'INSTITUTION_EVAL' ? 'text-blue-600' : 'text-green-600'
}

const handleView = (doc: any) => {
  alert(`${getDocumentTypeLabel(doc.type)} 보기 (추후 PDF 뷰어 구현)\n파일: ${doc.fileName}`)
}

const handleDownload = (doc: any) => {
  alert(`${getDocumentTypeLabel(doc.type)} 다운로드 (추후 구현)\n파일: ${doc.fileName}`)
  // 추후 구현:
  // const link = document.createElement('a')
  // link.href = doc.fileUrl
  // link.download = doc.fileName
  // link.click()
}
</script>
