<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 사이드바 (나중에 구현) -->
    <aside class="hidden lg:block w-64 bg-white border-r border-gray-200">
      <div class="h-full flex flex-col">
        <!-- 로고 -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <AcademicCapIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Uniwave Pro</h2>
              <p class="text-xs text-gray-500">학생</p>
            </div>
          </div>
        </div>

        <!-- 메뉴 (임시) -->
        <nav class="flex-1 p-4">
          <div class="space-y-1">
            <router-link
              to="/student/dashboard"
              class="menu-item"
              active-class="active"
            >
              <HomeIcon class="w-5 h-5" />
              <span>대시보드</span>
            </router-link>
          </div>
        </nav>

        <!-- 사용자 정보 -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon class="w-6 h-6 text-gray-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ authStore.user?.email }}
              </p>
              <p class="text-xs text-gray-500">학생</p>
            </div>
            <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 메인 컨텐츠 -->
    <div class="flex-1 flex flex-col">
      <!-- 헤더 (모바일) -->
      <header class="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold text-gray-900">Uniwave Pro</h1>
          <button class="p-2 text-gray-600">
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </header>

      <!-- 페이지 컨텐츠 -->
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AcademicCapIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
