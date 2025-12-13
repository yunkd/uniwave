<template>
  <Card class="p-3 sm:p-4 lg:p-6">
    <div class="flex items-center justify-between mb-3 sm:mb-4">
      <h3 class="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">메모</h3>
      <button
        @click="isEditing = !isEditing"
        class="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        {{ isEditing ? '완료' : '편집' }}
      </button>
    </div>

    <!-- 편집 모드 -->
    <div v-if="isEditing" class="space-y-2 sm:space-y-3">
      <textarea
        v-model="memoText"
        rows="6"
        class="w-full px-2.5 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-xs sm:text-sm"
        placeholder="메모를 입력하세요..."
      ></textarea>
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500">{{ memoText.length }} / 500자</span>
        <div class="flex gap-1.5 sm:gap-2">
          <button
            @click="cancelEdit"
            class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            @click="saveMemo"
            class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>

    <!-- 읽기 모드 -->
    <div v-else>
      <div v-if="memos.length > 0" class="space-y-2 sm:space-y-3">
        <div
          v-for="(memo, index) in memos"
          :key="index"
          class="p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg group"
        >
          <div class="flex items-start justify-between mb-1 sm:mb-2">
            <span class="text-xs text-gray-500">{{ formatDate(memo.createdAt) }}</span>
            <button
              @click="deleteMemo(index)"
              class="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <XMarkIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <p class="text-xs sm:text-sm text-gray-900 whitespace-pre-wrap break-words">{{ memo.text }}</p>
        </div>
      </div>
      <div v-else class="text-center py-6 sm:py-8 text-gray-500">
        <DocumentTextIcon class="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2 text-gray-400" />
        <p class="text-xs sm:text-sm">메모가 없습니다</p>
        <p class="text-xs mt-0.5 sm:mt-1">편집 버튼을 눌러 메모를 추가하세요</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/common/Card.vue'
import { XMarkIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const isEditing = ref(false)
const memoText = ref('')

// 임시 메모 데이터
const memos = ref([
  {
    text: '오늘 실습 일지 작성 완료\n내일 출석 체크 잊지 말기',
    createdAt: new Date().toISOString()
  }
])

const saveMemo = () => {
  if (memoText.value.trim()) {
    memos.value.unshift({
      text: memoText.value,
      createdAt: new Date().toISOString()
    })
    memoText.value = ''
    isEditing.value = false
  }
}

const cancelEdit = () => {
  memoText.value = ''
  isEditing.value = false
}

const deleteMemo = (index: number) => {
  if (confirm('메모를 삭제하시겠습니까?')) {
    memos.value.splice(index, 1)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
