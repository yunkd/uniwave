<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 헤더 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">목록으로</span>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">공지사항 작성</h1>
      </div>

      <!-- 작성 폼 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <form @submit.prevent="handleSubmit">
          <!-- 제목 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              제목 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              maxlength="200"
              placeholder="공지사항 제목을 입력하세요"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p class="mt-1 text-xs text-gray-500">{{ form.title.length }} / 200자</p>
          </div>

          <!-- 공지 대상 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              공지 대상 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="form.target === 'ALL' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'">
                <input
                  v-model="form.target"
                  type="radio"
                  value="ALL"
                  required
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">전체</span>
                  <p class="text-xs text-gray-500">학생 + 기관</p>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="form.target === 'STUDENT' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'">
                <input
                  v-model="form.target"
                  type="radio"
                  value="STUDENT"
                  required
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">학생만</span>
                  <p class="text-xs text-gray-500">학생 대상</p>
                </div>
              </label>
              
              <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="form.target === 'INSTITUTION' ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'">
                <input
                  v-model="form.target"
                  type="radio"
                  value="INSTITUTION"
                  required
                  class="w-5 h-5 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">기관만</span>
                  <p class="text-xs text-gray-500">기관 대상</p>
                </div>
              </label>
            </div>
          </div>

          <!-- 카테고리 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">선택하세요</option>
              <option value="OT">OT (오리엔테이션)</option>
              <option value="SEMINAR">세미나</option>
              <option value="DOCUMENT">서류</option>
              <option value="SCHEDULE">일정</option>
              <option value="ETC">기타</option>
            </select>
          </div>

          <!-- 상단 고정 -->
          <div class="mb-6">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.is_pinned"
                type="checkbox"
                class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <span class="text-sm font-medium text-gray-700">중요 공지로 설정</span>
                <p class="text-xs text-gray-500">상단에 고정되어 표시됩니다</p>
              </div>
            </label>
          </div>

          <!-- 내용 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              내용 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.content"
              required
              rows="15"
              maxlength="10000"
              placeholder="공지사항 내용을 입력하세요. HTML 태그를 사용할 수 있습니다."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ form.content.length }} / 10,000자</p>
          </div>

          <!-- 게시 기간 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              게시 기간 (선택)
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">시작일</label>
                <input
                  v-model="form.start_date"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">종료일</label>
                <input
                  v-model="form.end_date"
                  type="date"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- 첨부파일 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              첨부파일 (선택)
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                @change="handleFileUpload"
                class="hidden"
                id="file-upload"
              />
              <label for="file-upload" class="cursor-pointer">
                <DocumentPlusIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-600">클릭하여 파일 선택</p>
                <p class="text-xs text-gray-500 mt-1">PDF, 이미지, 문서 (최대 3개, 각 10MB)</p>
              </label>
            </div>
            
            <!-- 업로드된 파일 목록 -->
            <div v-if="form.attachments.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(file, index) in form.attachments"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <DocumentIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-700 truncate">{{ file.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
                </div>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              @click="saveAsDraft"
              class="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              임시저장
            </button>
            <button
              type="button"
              @click="showPreview = true"
              class="flex-1 px-6 py-3 bg-white border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 font-medium transition-colors"
            >
              미리보기
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              게시하기
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 미리보기 모달 -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="showPreview = false"
    >
      <div
        class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">미리보기</h2>
          <button
            @click="showPreview = false"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {{ getTargetLabel(form.target) }}
            </span>
            <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', getCategoryColor(form.category)]">
              {{ getCategoryLabel(form.category) }}
            </span>
            <span v-if="form.is_pinned" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
              <BellIcon class="w-4 h-4 mr-1" />
              중요
            </span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ form.title || '제목 없음' }}</h1>
          <div class="prose prose-sm max-w-none" v-html="form.content || '내용 없음'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  DocumentPlusIcon,
  DocumentIcon,
  XMarkIcon,
  BellIcon
} from '@heroicons/vue/24/outline'
import { categoryConfig, formatFileSize } from '@/data/mockNotices'

const router = useRouter()

// 폼 상태
const form = ref({
  title: '',
  target: 'ALL' as 'ALL' | 'STUDENT' | 'INSTITUTION',
  category: '',
  is_pinned: false,
  content: '',
  start_date: '',
  end_date: '',
  attachments: [] as File[]
})

const showPreview = ref(false)

// 파일 업로드
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  if (form.value.attachments.length + files.length > 3) {
    alert('최대 3개의 파일만 업로드할 수 있습니다')
    return
  }
  
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name}은(는) 10MB를 초과합니다`)
      continue
    }
    form.value.attachments.push(file)
  }
  
  target.value = ''
}

const removeFile = (index: number) => {
  form.value.attachments.splice(index, 1)
}

// 대상 정보
const getTargetLabel = (target: string): string => {
  const labels: Record<string, string> = {
    ALL: '전체',
    STUDENT: '학생',
    INSTITUTION: '기관'
  }
  return labels[target] || target
}

// 카테고리 정보
const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    OT: 'OT',
    SEMINAR: '세미나',
    DOCUMENT: '서류',
    SCHEDULE: '일정',
    ETC: '기타'
  }
  return labels[category] || category
}

const getCategoryColor = (category: string): string => {
  return categoryConfig[category as keyof typeof categoryConfig]?.color || 'bg-gray-100 text-gray-800'
}

// 임시저장
const saveAsDraft = () => {
  localStorage.setItem('notice_draft', JSON.stringify(form.value))
  alert('임시저장되었습니다')
}

// 게시
const handleSubmit = () => {
  if (!form.value.title || !form.value.target || !form.value.category || !form.value.content) {
    alert('필수 항목을 모두 입력해주세요')
    return
  }
  
  // 실제로는 API 호출
  console.log('게시할 내용:', form.value)
  
  const targetText = getTargetLabel(form.value.target)
  alert(`공지사항이 ${targetText}에게 게시되었습니다`)
  localStorage.removeItem('notice_draft')
  router.push('/university/notices')
}

// 페이지 로드 시 임시저장 불러오기
const loadDraft = () => {
  const draft = localStorage.getItem('notice_draft')
  if (draft) {
    const confirmed = confirm('임시저장된 내용이 있습니다. 불러오시겠습니까?')
    if (confirmed) {
      const parsed = JSON.parse(draft)
      form.value = { ...form.value, ...parsed, attachments: [] }
    }
  }
}

loadDraft()
</script>
