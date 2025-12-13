<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div v-if="!notice" class="bg-white rounded-lg p-8 sm:p-12 text-center">
      <p class="text-gray-500">공지사항을 찾을 수 없습니다</p>
      <button
        @click="router.back()"
        class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        목록으로 돌아가기
      </button>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <!-- 헤더 -->
      <div class="mb-6">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="text-sm font-medium">취소</span>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">공지사항 수정</h1>
      </div>

      <!-- 수정 폼 -->
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

          <!-- 기존 첨부파일 -->
          <div v-if="notice.attachments && notice.attachments.length > 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              기존 첨부파일
            </label>
            <div class="space-y-2">
              <div
                v-for="(file, index) in notice.attachments"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <DocumentIcon class="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span class="text-sm text-gray-700 truncate">{{ file.name }}</span>
                </div>
                <a
                  :href="file.url"
                  download
                  class="text-sm text-primary-600 hover:text-primary-700"
                >
                  다운로드
                </a>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              @click="router.back()"
              class="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronLeftIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'
import { mockNotices } from '@/data/mockNotices'
import type { Notice } from '@/data/mockNotices'

const route = useRoute()
const router = useRouter()

const notice = ref<Notice | null>(null)

// 폼 상태
const form = ref({
  title: '',
  category: '',
  is_pinned: false,
  content: '',
  start_date: '',
  end_date: ''
})

onMounted(() => {
  const id = route.params.id as string
  const found = mockNotices.find(n => n.id === id && !n.is_deleted)
  
  if (found) {
    notice.value = found
    
    // 폼에 기존 데이터 로드
    form.value = {
      title: found.title,
      category: found.category,
      is_pinned: found.is_pinned,
      content: found.content,
      start_date: found.start_date ? new Date(found.start_date).toISOString().split('T')[0] : '',
      end_date: found.end_date ? new Date(found.end_date).toISOString().split('T')[0] : ''
    }
  }
})

// 수정 완료
const handleSubmit = () => {
  if (!form.value.title || !form.value.category || !form.value.content) {
    alert('필수 항목을 모두 입력해주세요')
    return
  }
  
  // 실제로는 API 호출
  if (notice.value) {
    notice.value.title = form.value.title
    notice.value.category = form.value.category as any
    notice.value.is_pinned = form.value.is_pinned
    notice.value.content = form.value.content
    notice.value.start_date = form.value.start_date ? new Date(form.value.start_date).toISOString() : undefined
    notice.value.end_date = form.value.end_date ? new Date(form.value.end_date).toISOString() : undefined
    notice.value.updated_at = new Date().toISOString()
  }
  
  alert('공지사항이 수정되었습니다')
  router.push(`/university/notices/${notice.value?.id}`)
}
</script>
