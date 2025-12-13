<template>
  <Card>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900">일정</h3>
      <div class="flex items-center gap-2">
        <button
          @click="previousMonth"
          class="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
        </button>
        <span class="text-sm font-medium text-gray-700 min-w-[100px] text-center">
          {{ currentMonthLabel }}
        </span>
        <button
          @click="nextMonth"
          class="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRightIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-medium text-gray-600 py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- 날짜 그리드 -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(date, index) in calendarDates"
        :key="index"
        @click="selectDate(date)"
        :class="[
          'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors',
          date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
          date.isToday ? 'bg-primary-600 text-white font-bold' : 'hover:bg-gray-100',
          date.hasEvent ? 'ring-2 ring-primary-300' : ''
        ]"
        :disabled="!date.isCurrentMonth"
      >
        <span>{{ date.day }}</span>
        <span v-if="date.hasEvent" class="w-1 h-1 bg-primary-600 rounded-full mt-0.5"></span>
      </button>
    </div>

    <!-- 오늘의 일정 -->
    <div v-if="todayEvents.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-900 mb-2">오늘의 일정</h4>
      <div class="space-y-2">
        <div
          v-for="event in todayEvents"
          :key="event.id"
          class="flex items-start gap-2 p-2 bg-primary-50 rounded-lg"
        >
          <div :class="['w-2 h-2 rounded-full mt-1.5 flex-shrink-0', getEventColor(event.type)]"></div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
            <p class="text-xs text-gray-600">{{ event.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 pt-4 border-t border-gray-200 text-center py-4">
      <p class="text-sm text-gray-500">오늘 일정이 없습니다</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/common/Card.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const currentDate = ref(new Date())
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 임시 일정 데이터
const events = ref([
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: '출석 체크',
    time: '09:00',
    type: 'attendance'
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    title: '실습 일지 작성',
    time: '17:00',
    type: 'journal'
  }
])

const currentMonthLabel = computed(() => {
  return currentDate.value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const prevLastDay = new Date(year, month, 0)
  
  const dates = []
  const today = new Date().toDateString()
  
  // 이전 달 날짜
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevLastDay.getDate() - i
    dates.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false,
      date: new Date(year, month - 1, day)
    })
  }
  
  // 현재 달 날짜
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split('T')[0]
    dates.push({
      day,
      isCurrentMonth: true,
      isToday: date.toDateString() === today,
      hasEvent: events.value.some(e => e.date === dateString),
      date
    })
  }
  
  // 다음 달 날짜
  const remainingDays = 42 - dates.length
  for (let day = 1; day <= remainingDays; day++) {
    dates.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: false,
      date: new Date(year, month + 1, day)
    })
  }
  
  return dates
})

const todayEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return events.value.filter(e => e.date === today)
})

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const selectDate = (date: any) => {
  if (!date.isCurrentMonth) return
  console.log('선택한 날짜:', date.date)
}

const getEventColor = (type: string) => {
  const colors: Record<string, string> = {
    'attendance': 'bg-green-500',
    'journal': 'bg-blue-500',
    'notice': 'bg-yellow-500'
  }
  return colors[type] || 'bg-gray-500'
}
</script>
