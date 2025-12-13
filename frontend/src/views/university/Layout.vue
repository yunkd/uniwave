<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 사이드바 -->
    <Sidebar ref="sidebarRef" />

    <!-- 메인 컨텐츠 -->
    <div class="flex-1 lg:ml-64">
      <!-- 통합 헤더 (모바일 + 데스크톱) -->
      <header class="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
        <div class="flex items-center justify-between">
          <!-- 왼쪽: 모바일 메뉴 + 로고 -->
          <div class="flex items-center gap-3">
            <button @click="openMobileMenu" class="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Bars3Icon class="w-5 h-5 text-gray-700" />
            </button>
            <h1 class="text-base lg:text-lg font-semibold text-gray-900">Uniwave</h1>
          </div>
          
          <!-- 오른쪽: 헤더 메뉴 -->
          <HeaderMenu />
        </div>
      </header>

      <!-- 페이지 컨텐츠 -->
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

const sidebarRef = ref()

const openMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.isMobileMenuOpen = true
  }
}
</script>
