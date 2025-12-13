<template>
  <div class="relative">
    <button
      @click="toggleNotifications"
      class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <BellIcon class="w-6 h-6 text-gray-700" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- 알림 드롭다운 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <!-- 헤더 -->
        <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">알림</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            모두 읽음
          </button>
        </div>

        <!-- 알림 목록 -->
        <div class="max-h-96 overflow-y-auto">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            :class="[
              'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
              !notification.isRead ? 'bg-primary-50' : ''
            ]"
          >
            <div class="flex gap-3">
              <div
                :class="[
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  getNotificationColor(notification.type)
                ]"
              >
                <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 mb-1">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-gray-600 mb-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(notification.createdAt) }}
                </p>
              </div>
              <div v-if="!notification.isRead" class="flex-shrink-0">
                <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div v-if="notifications.length === 0" class="px-4 py-12 text-center">
            <BellIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-600">새로운 알림이 없습니다</p>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="px-4 py-3 border-t border-gray-200 text-center">
          <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            모든 알림 보기
          </button>
        </div>
      </div>
    </transition>

    <!-- 외부 클릭 감지 -->
    <div
      v-if="isOpen"
      @click="closeNotifications"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const isOpen = ref(false)

// 임시 알림 데이터
const notifications = ref([
  {
    id: '1',
    type: 'INSTITUTION_APPROVED',
    title: '기관 매칭 승인',
    message: '사회복지법인 희망나눔과의 매칭이 승인되었습니다.',
    createdAt: new Date().toISOString(),
    isRead: false,
    link: '/student/institution-status'
  },
  {
    id: '2',
    type: 'ATTENDANCE_APPROVED',
    title: '출석 승인',
    message: '2025-01-13 출석이 승인되었습니다.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    link: '/student/attendance/history'
  },
  {
    id: '3',
    type: 'JOURNAL_REJECTED',
    title: '일지 반려',
    message: '2025-01-12 실습 일지가 반려되었습니다. 피드백을 확인하세요.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    link: '/student/journal/list'
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

const toggleNotifications = () => {
  isOpen.value = !isOpen.value
}

const closeNotifications = () => {
  isOpen.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
}

const handleNotificationClick = (notification: any) => {
  notification.isRead = true
  if (notification.link) {
    router.push(notification.link)
  }
  closeNotifications()
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    'INSTITUTION_APPROVED': CheckCircleIcon,
    'INSTITUTION_PENDING': ClockIcon,
    'INSTITUTION_REJECTED': XCircleIcon,
    'ATTENDANCE_APPROVED': CheckCircleIcon,
    'ATTENDANCE_REJECTED': XCircleIcon,
    'JOURNAL_APPROVED': CheckCircleIcon,
    'JOURNAL_REJECTED': XCircleIcon,
    'NOTICE': DocumentTextIcon
  }
  return icons[type] || BellIcon
}

const getNotificationColor = (type: string) => {
  const colors: Record<string, string> = {
    'INSTITUTION_APPROVED': 'bg-green-100 text-green-600',
    'INSTITUTION_PENDING': 'bg-yellow-100 text-yellow-600',
    'INSTITUTION_REJECTED': 'bg-red-100 text-red-600',
    'ATTENDANCE_APPROVED': 'bg-green-100 text-green-600',
    'ATTENDANCE_REJECTED': 'bg-red-100 text-red-600',
    'JOURNAL_APPROVED': 'bg-green-100 text-green-600',
    'JOURNAL_REJECTED': 'bg-red-100 text-red-600',
    'NOTICE': 'bg-blue-100 text-blue-600'
  }
  return colors[type] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
