<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-200">404</h1>
      <h2 class="text-3xl font-semibold text-gray-900 mt-4 mb-2">
        페이지를 찾을 수 없습니다
      </h2>
      <p class="text-gray-600 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button
        variant="primary"
        @click="$router.push('/login')"
      >
        홈으로 돌아가기
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'
</script>
