<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- 헤더 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-2">
        <PlusCircleIcon class="w-8 h-8 text-primary-600" />
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">신규기관 등록 신청</h1>
      </div>
      <p class="text-gray-600">협력 기관 DB에 없는 새로운 기관을 등록 요청하세요</p>
    </div>

    <!-- 안내 카드 -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 mb-6">
      <div class="flex items-start gap-3">
        <InformationCircleIcon class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-900 mb-2">신규기관 등록 절차 안내</h3>
          <ol class="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
            <li>학생이 기관 정보를 입력하여 등록 신청</li>
            <li>대학 담당자가 기관 정보 검토 및 확인</li>
            <li>대학에서 기관 등록 승인 (전국 DB 추가)</li>
            <li>학생-기관 매칭 자동 처리 또는 별도 신청</li>
          </ol>
          <p class="text-sm text-blue-800 mt-3">
            ⚠️ <strong>기관과 사전 협의 후</strong> 정확한 정보를 입력해주세요.
          </p>
        </div>
      </div>
    </div>

    <!-- 등록 신청 폼 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="submitRequest">
        <!-- 기관 기본 정보 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
            기관 기본 정보
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 기관명 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                기관명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.institutionName"
                type="text"
                required
                placeholder="예: 서울시립종합복지관"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 복지 분야 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                복지 분야 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.field"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="노인복지">노인복지</option>
                <option value="아동복지">아동복지</option>
                <option value="장애인복지">장애인복지</option>
                <option value="정신보건">정신보건</option>
                <option value="지역복지">지역복지</option>
                <option value="의료복지">의료복지</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <!-- 기관 유형 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                기관 유형
              </label>
              <select
                v-model="form.institutionType"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="사회복지관">사회복지관</option>
                <option value="요양원">요양원</option>
                <option value="아동센터">아동센터</option>
                <option value="복지센터">복지센터</option>
                <option value="재단법인">재단법인</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 위치 정보 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinIcon class="w-6 h-6 text-primary-600" />
            위치 정보
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- 시/도 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                시/도 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.city"
                @change="onCityChange"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">선택하세요</option>
                <option value="서울시">서울시</option>
                <option value="경기도">경기도</option>
                <option value="인천시">인천시</option>
                <option value="부산시">부산시</option>
                <option value="대구시">대구시</option>
                <option value="광주시">광주시</option>
                <option value="대전시">대전시</option>
                <option value="울산시">울산시</option>
              </select>
            </div>

            <!-- 구/군 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                구/군 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.district"
                type="text"
                required
                placeholder="예: 강남구"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 동/읍/면 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                동/읍/면
              </label>
              <input
                v-model="form.dong"
                type="text"
                placeholder="예: 역삼동"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- 상세 주소 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              상세 주소 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              required
              placeholder="예: 테헤란로 123, 복지빌딩 3층"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- 연락처 정보 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PhoneIcon class="w-6 h-6 text-primary-600" />
            연락처 정보
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 담당자명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                실습 담당자명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.contactName"
                type="text"
                required
                placeholder="예: 김담당"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 전화번호 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                전화번호 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                placeholder="예: 02-1234-5678"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 이메일 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="예: contact@institution.or.kr"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 웹사이트 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                웹사이트
              </label>
              <input
                v-model="form.website"
                type="url"
                placeholder="예: https://www.institution.or.kr"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 실습 정보 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon class="w-6 h-6 text-primary-600" />
            실습 정보
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 실습 기간 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                희망 실습 기간 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.desiredPeriod"
                type="text"
                required
                placeholder="예: 2025.03.01 ~ 2025.03.28 (4주)"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <!-- 모집 인원 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                예상 모집 인원
              </label>
              <input
                v-model.number="form.capacity"
                type="number"
                min="1"
                placeholder="예: 3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- 기관 소개 -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              기관 소개 및 실습 내용
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="기관에 대한 간단한 소개와 주요 실습 내용을 작성해주세요..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- 신청 사유 -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              신청 사유 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.reason"
              rows="3"
              required
              placeholder="이 기관을 등록 신청하는 이유를 작성해주세요 (예: 기관과 사전 협의 완료, 해당 분야 실습 필요 등)"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="goBack"
            class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            등록 신청
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 폼 데이터
const form = ref({
  institutionName: '',
  field: '',
  institutionType: '',
  city: '',
  district: '',
  dong: '',
  address: '',
  contactName: '',
  phone: '',
  email: '',
  website: '',
  desiredPeriod: '',
  capacity: null as number | null,
  description: '',
  reason: ''
})

// 시/도 변경 시
const onCityChange = () => {
  // 필요시 구/군 자동완성 등 추가 로직
}

// 뒤로가기
const goBack = () => {
  if (confirm('작성 중인 내용이 삭제됩니다. 취소하시겠습니까?')) {
    router.back()
  }
}

// 등록 신청 제출
const submitRequest = () => {
  // 유효성 검사는 HTML5 required 속성으로 처리됨
  // TODO: 실제 API 호출
  
  console.log('신규기관 등록 신청:', form.value)
  
  alert(
    `신규기관 등록 신청이 완료되었습니다!\n\n` +
    `기관명: ${form.value.institutionName}\n` +
    `분야: ${form.value.field}\n` +
    `주소: ${form.value.city} ${form.value.district} ${form.value.address}\n\n` +
    `대학 담당자가 검토 후 승인하면 알림을 보내드립니다.`
  )
  
  // 폼 초기화
  form.value = {
    institutionName: '',
    field: '',
    institutionType: '',
    city: '',
    district: '',
    dong: '',
    address: '',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    desiredPeriod: '',
    capacity: null,
    description: '',
    reason: ''
  }
  
  // 매칭 현황 페이지로 이동
  router.push({ name: 'StudentMatchingStatus' })
}
</script>
