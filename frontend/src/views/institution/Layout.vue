<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 사이드바 -->
    <Sidebar ref="sidebarRef" />

    <!-- 메인 컨텐츠 -->
    <div class="flex-1 lg:ml-64 transition-all duration-300">
      <!-- 모바일 헤더 -->
      <header class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <div class="flex items-center justify-between">
          <button @click="openMobileMenu" class="p-2 hover:bg-gray-100 rounded-lg">
            <Bars3Icon class="w-6 h-6 text-gray-700" />
          </button>
          <h1 class="text-lg font-semibold text-gray-900">Uniwave Pro</h1>
          <div class="w-10"></div>
        </div>
      </header>

      <!-- 페이지 컨텐츠 -->
      <main class="min-h-screen p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const sidebarRef = ref()

const openMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.isMobileMenuOpen = true
  }
}
</script>
