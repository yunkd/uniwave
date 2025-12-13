<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">설정</h1>
      <p class="text-xs sm:text-sm text-gray-600">프로필 및 알림 설정을 관리하세요</p>
    </div>

    <!-- 프로필 정보 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">프로필 정보</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
          <input
            v-model="profile.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            readonly
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">학번</label>
            <input
              v-model="profile.studentId"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm"
              readonly
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">학과</label>
            <input
              v-model="profile.department"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm"
              readonly
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input
            v-model="profile.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">연락처</label>
          <input
            v-model="profile.phone"
            type="tel"
            placeholder="010-0000-0000"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div class="flex justify-end pt-4 border-t">
          <Button variant="primary" @click="saveProfile">
            프로필 저장
          </Button>
        </div>
      </div>
    </Card>

    <!-- 알림 설정 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">알림 설정</h2>
      
      <!-- 이메일 알림 -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">이메일 알림</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.attendance"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">출석 승인/반려 알림</span>
              <p class="text-xs text-gray-500">기관에서 출석을 승인하거나 반려할 때 알림을 받습니다</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.journal"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">일지 승인/반려 알림</span>
              <p class="text-xs text-gray-500">기관에서 일지를 승인하거나 반려할 때 알림을 받습니다</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.documents"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">서류 발급 알림</span>
              <p class="text-xs text-gray-500">기관에서 확인서/평가서를 발급하면 알림을 받습니다</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.notices"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">공지사항 알림</span>
              <p class="text-xs text-gray-500">대학에서 새 공지사항을 등록하면 알림을 받습니다</p>
            </div>
          </label>
        </div>
      </div>

      <!-- SMS 알림 (신규) -->
      <div class="mb-6 border-t pt-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">
          <span class="inline-flex items-center">
            SMS 알림
            <span class="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">NEW</span>
          </span>
        </h3>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p class="text-xs text-blue-800">
            📱 휴대폰 번호를 등록하면 중요한 알림을 SMS로 받을 수 있습니다.
          </p>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.sms.enabled"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm font-medium text-gray-700">SMS 알림 사용</span>
              <p class="text-xs text-gray-500">SMS 알림을 받으려면 체크하세요 (상단 연락처 필수)</p>
            </div>
          </label>

          <div v-if="notifications.sms.enabled" class="pl-7 space-y-3 border-l-2 border-primary-200 ml-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.attendance"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">출석 승인/반려</span>
            </label>
            
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.journal"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">일지 승인/반려</span>
            </label>
            
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.documents"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">서류 발급</span>
            </label>
            
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.urgent"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">긴급 공지사항</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <Button variant="primary" @click="saveNotifications">
          알림 설정 저장
        </Button>
      </div>
    </Card>

    <!-- 비밀번호 변경 -->
    <Card class="p-4 sm:p-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">비밀번호 변경</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
          <input
            v-model="password.current"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
          <input
            v-model="password.new"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
          <input
            v-model="password.confirm"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div class="flex justify-end pt-4 border-t">
          <Button variant="primary" @click="changePassword">
            비밀번호 변경
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'

// 프로필 정보 (Mock)
const profile = ref({
  name: '홍길동',
  studentId: '2021012345',
  department: '사회복지학과',
  email: 'hong@example.com',
  phone: '010-1234-5678'
})

// 알림 설정 (Mock)
const notifications = ref({
  email: {
    attendance: true,
    journal: true,
    documents: true,
    notices: true
  },
  sms: {
    enabled: false,
    attendance: false,
    journal: false,
    documents: false,
    urgent: false
  }
})

// 비밀번호 변경
const password = ref({
  current: '',
  new: '',
  confirm: ''
})

// 프로필 저장
const saveProfile = () => {
  console.log('프로필 저장:', profile.value)
  // TODO: API 호출
  alert('프로필이 저장되었습니다.')
}

// 알림 설정 저장
const saveNotifications = () => {
  console.log('알림 설정 저장:', notifications.value)
  
  // SMS 알림 활성화 시 연락처 필수
  if (notifications.value.sms.enabled && !profile.value.phone) {
    alert('SMS 알림을 사용하려면 연락처를 먼저 입력해주세요.')
    return
  }
  
  // TODO: API 호출
  alert('알림 설정이 저장되었습니다.')
}

// 비밀번호 변경
const changePassword = () => {
  if (!password.value.current || !password.value.new || !password.value.confirm) {
    alert('모든 필드를 입력해주세요.')
    return
  }
  
  if (password.value.new !== password.value.confirm) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }
  
  console.log('비밀번호 변경')
  // TODO: API 호출
  alert('비밀번호가 변경되었습니다.')
  
  // 초기화
  password.value = {
    current: '',
    new: '',
    confirm: ''
  }
}
</script>
