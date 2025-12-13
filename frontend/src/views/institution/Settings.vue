<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">설정</h1>
      <p class="text-xs sm:text-sm text-gray-600">기관 정보 및 알림 설정을 관리하세요</p>
    </div>

    <!-- 기관 정보 -->
    <Card class="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">기관 정보</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">기관명</label>
          <input
            v-model="institution.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            readonly
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">기관 유형</label>
          <input
            v-model="institution.type"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm"
            readonly
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">주소</label>
          <input
            v-model="institution.address"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">담당자명</label>
            <input
              v-model="institution.managerName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">담당자 연락처</label>
            <input
              v-model="institution.managerPhone"
              type="tel"
              placeholder="010-0000-0000"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <input
            v-model="institution.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>

        <div class="flex justify-end pt-4 border-t">
          <Button variant="primary" @click="saveInstitution">
            기관 정보 저장
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
              v-model="notifications.email.newStudent"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">신규 실습생 배정 알림</span>
              <p class="text-xs text-gray-500">새로운 실습생이 배정되면 알림을 받습니다</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.attendance"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">출석 승인 요청 알림</span>
              <p class="text-xs text-gray-500">학생이 출석을 제출하면 알림을 받습니다</p>
            </div>
          </label>
          
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="notifications.email.journal"
              type="checkbox"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span class="text-sm text-gray-700">일지 승인 요청 알림</span>
              <p class="text-xs text-gray-500">학생이 일지를 제출하면 알림을 받습니다</p>
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
            📱 담당자 연락처를 등록하면 중요한 알림을 SMS로 받을 수 있습니다.
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
              <p class="text-xs text-gray-500">SMS 알림을 받으려면 체크하세요 (담당자 연락처 필수)</p>
            </div>
          </label>

          <div v-if="notifications.sms.enabled" class="pl-7 space-y-3 border-l-2 border-primary-200 ml-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.newStudent"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">신규 실습생 배정</span>
            </label>
            
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.attendance"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">출석 승인 요청</span>
            </label>
            
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="notifications.sms.journal"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">일지 승인 요청</span>
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

// 기관 정보 (Mock)
const institution = ref({
  name: '사회복지법인 희망나눔',
  type: '노인복지',
  address: '서울시 강남구 테헤란로 123',
  managerName: '김지도',
  managerPhone: '010-1234-5678',
  email: 'contact@hopeshare.org'
})

// 알림 설정 (Mock)
const notifications = ref({
  email: {
    newStudent: true,
    attendance: true,
    journal: true,
    notices: true
  },
  sms: {
    enabled: false,
    newStudent: false,
    attendance: false,
    journal: false,
    urgent: false
  }
})

// 비밀번호 변경
const password = ref({
  current: '',
  new: '',
  confirm: ''
})

// 기관 정보 저장
const saveInstitution = () => {
  console.log('기관 정보 저장:', institution.value)
  // TODO: API 호출
  alert('기관 정보가 저장되었습니다.')
}

// 알림 설정 저장
const saveNotifications = () => {
  console.log('알림 설정 저장:', notifications.value)
  
  // SMS 알림 활성화 시 연락처 필수
  if (notifications.value.sms.enabled && !institution.value.managerPhone) {
    alert('SMS 알림을 사용하려면 담당자 연락처를 먼저 입력해주세요.')
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
