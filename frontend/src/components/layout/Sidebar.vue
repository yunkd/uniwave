<template>
  <!-- 모바일 오버레이 -->
  <div
    v-if="isMobileMenuOpen"
    @click="closeMobileMenu"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
  ></div>

  <!-- 사이드바 -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50',
      isCollapsed && !isMobileMenuOpen ? 'w-16' : 'w-64',
      'lg:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- 로고 영역 -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
      <div v-if="!isCollapsed" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <AcademicCapIcon class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-gray-900">Uniwave</span>
      </div>
      <button
        @click="toggleSidebar"
        class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bars3Icon v-if="isCollapsed" class="w-5 h-5 text-gray-600" />
        <ChevronLeftIcon v-else class="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <!-- 사용자 정보 -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <UserCircleIcon class="w-6 h-6 text-primary-600" />
        </div>
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user?.name || '사용자' }}
          </p>
          <p class="text-xs text-gray-500">
            {{ getRoleLabel(user?.role) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 메뉴 -->
    <nav class="flex-1 overflow-y-auto p-3">
      <div v-for="(item, index) in menuItems" :key="index" class="mb-1">
        <!-- 단일 메뉴 -->
        <router-link
          v-if="!item.children"
          :to="item.path"
          :class="menuItemClass(item.path)"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="flex-1">{{ item.label }}</span>
        </router-link>

        <!-- 그룹 메뉴 -->
        <div v-else>
          <button
            @click="toggleGroup(item.key)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors',
              expandedGroups.includes(item.key) ? 'bg-gray-50' : ''
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!isCollapsed" class="flex-1 text-left">{{ item.label }}</span>
            <ChevronDownIcon
              v-if="!isCollapsed"
              :class="[
                'w-4 h-4 transition-transform',
                expandedGroups.includes(item.key) ? 'rotate-180' : ''
              ]"
            />
          </button>

          <!-- 하위 메뉴 -->
          <div
            v-if="!isCollapsed && expandedGroups.includes(item.key)"
            class="ml-4 mt-1 space-y-1"
          >
            <router-link
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              :class="[
                'flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors',
                isActiveRoute(child.path) ? 'text-primary-600 bg-primary-50' : ''
              ]"
            >
              <component :is="child.icon" class="w-4 h-4" />
              <span>{{ child.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 하단 버튼 -->
    <div class="p-4 border-t border-gray-200">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors',
          isCollapsed ? 'justify-center' : ''
        ]"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5" />
        <span v-if="!isCollapsed">로그아웃</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  AcademicCapIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const expandedGroups = ref<string[]>(['institution', 'attendance', 'journal'])

const user = computed(() => authStore.user)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 라우트 변경 시 모바일 메뉴 닫기
router.afterEach(() => {
  isMobileMenuOpen.value = false
})

const toggleGroup = (key: string) => {
  const index = expandedGroups.value.indexOf(key)
  if (index > -1) {
    expandedGroups.value.splice(index, 1)
  } else {
    expandedGroups.value.push(key)
  }
}

const getRoleLabel = (role?: string) => {
  const labels: Record<string, string> = {
    STUDENT: '학생',
    INSTITUTION: '기관',
    UNIVERSITY: '대학'
  }
  return labels[role || ''] || ''
}

// 역할별 메뉴 구조
const menuItems = computed(() => {
  const role = user.value?.role

  if (role === 'STUDENT') {
    return [
      {
        label: '대시보드',
        path: '/student/dashboard',
        icon: HomeIcon
      },
      {
        label: '기관 매칭',
        key: 'institution',
        icon: UserGroupIcon,
        children: [
          { label: '기관 검색', path: '/student/institution-search', icon: MagnifyingGlassIcon },
          { label: '매칭 현황', path: '/student/institution-status', icon: ClipboardDocumentListIcon }
        ]
      },
      {
        label: '출석 관리',
        key: 'attendance',
        icon: ClipboardDocumentCheckIcon,
        children: [
          { label: '출석 체크', path: '/student/attendance/check', icon: CheckCircleIcon },
          { label: '출석 기록', path: '/student/attendance/history', icon: ClockIcon }
        ]
      },
      {
        label: '실습 일지',
        key: 'journal',
        icon: DocumentTextIcon,
        children: [
          { label: '일지 작성', path: '/student/journal/write', icon: DocumentTextIcon },
          { label: '일지 목록', path: '/student/journal/list', icon: DocumentDuplicateIcon }
        ]
      },
      {
        label: '제본 신청',
        path: '/student/binding',
        icon: BookOpenIcon
      },
      {
        label: '공지사항',
        path: '/student/notices',
        icon: BellAlertIcon
      }
    ]
  }

  if (role === 'INSTITUTION') {
    return [
      {
        label: '대시보드',
        path: '/institution/dashboard',
        icon: HomeIcon
      },
      {
        label: '실습생 관리',
        path: '/institution/students',
        icon: UserGroupIcon
      },
      {
        label: '출석 현황',
        path: '/institution/attendance',
        icon: ClipboardDocumentCheckIcon
      },
      {
        label: '일지 승인',
        path: '/institution/journal-approval',
        icon: DocumentTextIcon
      },
      {
        label: '양식 관리',
        path: '/institution/forms',
        icon: DocumentDuplicateIcon
      },
      {
        label: '공지사항',
        path: '/institution/notices',
        icon: BellAlertIcon
      }
    ]
  }

  if (role === 'UNIVERSITY') {
    return [
      {
        label: '대시보드',
        path: '/university/dashboard',
        icon: HomeIcon
      },
      {
        label: '전체 통계',
        path: '/university/statistics',
        icon: ChartBarIcon
      },
      {
        label: '기관 관리',
        path: '/university/institutions',
        icon: UserGroupIcon
      },
      {
        label: '학생 관리',
        path: '/university/students',
        icon: UserGroupIcon
      },
      {
        label: '양식 관리',
        path: '/university/templates',
        icon: DocumentDuplicateIcon
      },
      {
        label: '공지사항',
        path: '/university/notices',
        icon: BellAlertIcon
      },
      {
        label: '시스템 설정',
        path: '/university/settings',
        icon: Cog6ToothIcon
      }
    ]
  }

  return []
})

const menuItemClass = (path: string) => {
  return [
    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
    isActiveRoute(path)
      ? 'bg-primary-600 text-white'
      : 'text-gray-700 hover:bg-gray-50',
    isCollapsed.value ? 'justify-center' : ''
  ]
}

const isActiveRoute = (path: string) => {
  return route.path === path
}

const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    authStore.logout()
    router.push('/login')
  }
}

// 외부에서 모바일 메뉴 제어 가능하도록
defineExpose({
  isMobileMenuOpen
})
</script>
