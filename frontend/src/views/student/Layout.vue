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

// 학생용 챗봇 설정
const chatbotConfig = {
  name: '실습 도우미',
  description: '실습 관련 질문을 도와드립니다',
  welcomeMessage: '안녕하세요! 실습 도우미입니다 👋\n\n실습 기관 찾기, 출석 체크, 일지 작성 등 실습 과정에서 궁금한 점이 있으면 언제든 물어보세요!',
  quickQuestions: [
    '실습 기관은 어떻게 찾나요?',
    '출석은 어떻게 체크하나요?',
    '실습 일지 작성 방법이 궁금해요',
    '서류는 어디서 업로드하나요?'
  ],
  role: 'student' as const
}

const sidebarRef = ref()

const openMobileMenu = () => {
  if (sidebarRef.value) {
    sidebarRef.value.isMobileMenuOpen = true
  }
}
</script>
