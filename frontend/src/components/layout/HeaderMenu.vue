<template>
  <div class="flex items-center gap-2">
    <!-- 알림 -->
    <div class="relative">
      <button
        @click="toggleNotifications"
        class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <BellIcon class="w-6 h-6" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- 알림 드롭다운 -->
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[32rem] overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">알림</h3>
          <button
            v-if="notifications.length > 0"
            @click="markAllAsRead"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            모두 읽음
          </button>
        </div>
        <div class="overflow-y-auto max-h-96">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <BellSlashIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-sm text-gray-500">새로운 알림이 없습니다</p>
          </div>
          <button
            v-else
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            :class="[
              'w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors',
              !notification.read ? 'bg-blue-50' : ''
            ]"
          >
            <div class="flex items-start gap-3">
              <component
                :is="getNotificationIcon(notification.type)"
                :class="[
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  getNotificationColor(notification.type)
                ]"
              />
              <div class="flex-1 min-w-0">
                <p :class="['text-sm mb-1', !notification.read ? 'font-semibold text-gray-900' : 'text-gray-700']">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-gray-500">{{ formatTime(notification.created_at) }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 사용자 메뉴 -->
    <div class="relative">
      <button
        @click="toggleUserMenu"
        class="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <UserCircleIcon class="w-5 h-5 text-primary-600" />
        </div>
        <ChevronDownIcon class="w-4 h-4 hidden sm:block" />
      </button>

      <!-- 사용자 드롭다운 -->
      <div
        v-if="showUserMenu"
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
      >
        <!-- 사용자 정보 -->
        <div class="p-4 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-blue-50">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <UserCircleIcon class="w-8 h-8 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ user?.name || '사용자' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email || '' }}</p>
              <span :class="['inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium', getRoleBadgeColor()]">
                {{ getRoleLabel() }}
              </span>
            </div>
          </div>
        </div>

        <!-- 메뉴 옵션 -->
        <div class="p-2">
          <button
            @click="goToProfile"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <UserIcon class="w-5 h-5 text-gray-400" />
            <span>내 정보</span>
          </button>
          <button
            @click="goToSettings"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Cog6ToothIcon class="w-5 h-5 text-gray-400" />
            <span>설정</span>
          </button>
        </div>

        <!-- 로그아웃 -->
        <div class="p-2 border-t border-gray-200">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 오버레이 (드롭다운 닫기용) -->
  <div
    v-if="showNotifications || showUserMenu"
    @click="closeAllDropdowns"
    class="fixed inset-0 z-40"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  BellIcon,
  BellSlashIcon,
  UserCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const showNotifications = ref(false)
const showUserMenu = ref(false)

const user = computed(() => authStore.user)

// 목 알림 데이터
const notifications = ref([
  {
    id: '1',
    type: 'ATTENDANCE_APPROVED',
    title: '2025년 1월 13일 출석이 승인되었습니다',
    created_at: new Date().toISOString(),
    read: false,
    link: '/student/attendance/history'
  },
  {
    id: '2',
    type: 'NOTICE',
    title: '새 공지사항: [필독] 2025년 1학기 실습 오리엔테이션 안내',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    link: '/student/notices'
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

// 드롭다운 토글
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const closeAllDropdowns = () => {
  showNotifications.value = false
  showUserMenu.value = false
}

// 알림 관련
const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    ATTENDANCE_APPROVED: CheckCircleIcon,
    ATTENDANCE_REJECTED: XCircleIcon,
    JOURNAL_APPROVED: CheckCircleIcon,
    JOURNAL_REJECTED: XCircleIcon,
    NOTICE: InformationCircleIcon,
    WARNING: ExclamationTriangleIcon
  }
  return icons[type] || InformationCircleIcon
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    ATTENDANCE_APPROVED: 'text-green-500',
    ATTENDANCE_REJECTED: 'text-red-500',
    JOURNAL_APPROVED: 'text-green-500',
    JOURNAL_REJECTED: 'text-red-500',
    NOTICE: 'text-blue-500',
    WARNING: 'text-yellow-500'
  }
  return colors[type] || 'text-gray-500'
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

const handleNotificationClick = (notification: any) => {
  notification.read = true
  if (notification.link) {
    router.push(notification.link)
  }
  closeAllDropdowns()
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

// 사용자 메뉴
const getRoleLabel = () => {
  const labels: Record<string, string> = {
    STUDENT: '학생',
    INSTITUTION: '기관',
    UNIVERSITY: '대학'
  }
  return labels[user.value?.role || ''] || ''
}

const getRoleBadgeColor = () => {
  const colors: Record<string, string> = {
    STUDENT: 'bg-blue-100 text-blue-800',
    INSTITUTION: 'bg-green-100 text-green-800',
    UNIVERSITY: 'bg-purple-100 text-purple-800'
  }
  return colors[user.value?.role || ''] || 'bg-gray-100 text-gray-800'
}

const goToProfile = () => {
  // 실제로는 프로필 페이지로 이동
  alert('내 정보 페이지 (개발 예정)')
  closeAllDropdowns()
}

const goToSettings = () => {
  // 실제로는 설정 페이지로 이동
  alert('설정 페이지 (개발 예정)')
  closeAllDropdowns()
}

const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    authStore.logout()
    router.push('/login')
  }
}

// ESC 키로 드롭다운 닫기
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAllDropdowns()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
