<template>
  <div id="app" class="min-h-screen">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // 페이지 로드 시 로컬 스토리지에서 사용자 정보 복원
  authStore.loadUserFromStorage()
})
</script>
