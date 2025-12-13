<template>
  <div class="w-full">
    <!-- 라벨 -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 입력 필드 -->
    <div class="relative">
      <!-- 왼쪽 아이콘 -->
      <div
        v-if="iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
      </div>

      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- 오른쪽 아이콘 -->
      <div
        v-if="iconRight"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component :is="iconRight" class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <!-- 에러 메시지 -->
    <p v-if="error" class="mt-1.5 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- 도움말 -->
    <p v-else-if="hint" class="mt-1.5 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 bg-white text-gray-900'
  const icon = props.iconLeft ? 'pl-10' : props.iconRight ? 'pr-10' : ''
  const error = props.error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  
  return `${base} ${icon} ${error} ${disabled}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}
</script>
