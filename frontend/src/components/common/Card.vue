<template>
  <div :class="cardClasses">
    <!-- 헤더 -->
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>

    <!-- 본문 -->
    <div :class="bodyClasses">
      <slot />
    </div>

    <!-- 푸터 -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  padding?: boolean
  hover?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  hover: false,
  clickable: false
})

const cardClasses = computed(() => {
  const base = 'bg-white rounded-lg border border-gray-200 shadow-soft'
  const hover = props.hover ? 'hover:shadow-medium transition-shadow duration-200' : ''
  const clickable = props.clickable ? 'cursor-pointer' : ''
  
  return `${base} ${hover} ${clickable}`
})

const bodyClasses = computed(() => {
  return props.padding ? 'px-6 py-4' : ''
})
</script>
