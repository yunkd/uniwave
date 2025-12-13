<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 사이드바 -->
    <Sidebar ref="sidebarRef" />

    <!-- 메인 컨텐츠 -->
    <div class="flex-1 lg:ml-64">
      <!-- 헤더 -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="flex items-center justify-between px-4 lg:px-8 h-14">
          <!-- 모바일 햄버거 메뉴 -->
          <button @click="openMobileMenu" class="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <Bars3Icon class="w-5 h-5 text-gray-700" />
          </button>
          
          <!-- 빈 공간 (데스크톱) -->
          <div class="hidden lg:block"></div>
          
          <!-- 헤더 메뉴 -->
          <HeaderMenu />
        </div>
      </header>

      <!-- 페이지 컨텐츠 -->
      <main class="p-6">
        <router-view />
      </main>
    </div>

    <!-- AI 챗봇 -->
    <AIChatbot :config="chatbotConfig" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import AIChatbot from '@/components/chatbot/AIChatbot.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

// 대학용 챗봇 설정
const chatbotConfig = {
  name: '시스템 가이드',
  description: '시스템 사용법을 안내합니다',
  welcomeMessage: '안녕하세요! 실습 관리 시스템 가이드입니다 👋\n\n양식 관리, 학생/기관 관리, 승인 처리 등 시스템 사용법에 대해 안내해드립니다. 궁금한 점을 물어보세요!',
  quickQuestions: [
    '양식은 어떻게 업로드하나요?',
    '기관은 어떻게 등록하나요?',
    '매칭 승인은 어떻게 하나요?',
    '학생에게 알림은 어떻게 보내나요?'
  ],
  role: 'university' as const
}

const sidebarRef = ref()

const openMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.isMobileMenuOpen = true
  }
}
</script>
