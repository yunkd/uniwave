<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="true"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleClose"
      >
        <!-- 배경 오버레이 -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- 모달 컨테이너 -->
        <div class="flex min-h-full items-center justify-center p-4">
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              class="relative w-full max-w-lg bg-white rounded-lg shadow-xl"
              @click.stop
            >
              <!-- 헤더 -->
              <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                  <slot name="title">Modal Title</slot>
                </h3>
                <button
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>

              <!-- 내용 -->
              <div class="p-4 sm:p-6">
                <slot name="content">Modal Content</slot>
              </div>

              <!-- 푸터 -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-2 p-4 sm:p-6 border-t border-gray-200 bg-gray-50"
              >
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}
</script>
