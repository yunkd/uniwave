<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- 상단 네비게이션 -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        <span>목록으로</span>
      </button>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 왼쪽: 공고 상세 정보 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 공고 헤더 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <!-- 상태 배지 -->
          <div class="flex items-center justify-between mb-4">
            <span
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold',
                getStatusClass(recruitment.status)
              ]"
            >
              {{ getStatusLabel(recruitment.status) }}
            </span>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <EyeIcon class="w-4 h-4" />
              <span>조회 {{ recruitment.views }}</span>
            </div>
          </div>

          <!-- 제목 -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            {{ recruitment.title }}
          </h1>

          <!-- 기관 정보 -->
          <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div class="w-16 h-16 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <BuildingOfficeIcon class="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ recruitment.institutionName }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                  <MapPinIcon class="w-3 h-3" />
                  {{ recruitment.region }}
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                  <BriefcaseIcon class="w-3 h-3" />
                  {{ recruitment.field }}
                </span>
              </div>
            </div>
          </div>

          <!-- 주요 정보 그리드 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserGroupIcon class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">모집 인원</p>
                <p class="text-lg font-semibold text-gray-900">{{ recruitment.positions }}명</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarIcon class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">실습 기간</p>
                <p class="text-lg font-semibold text-gray-900">{{ recruitment.duration }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon class="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">모집 마감일</p>
                <p class="text-lg font-semibold text-gray-900">{{ recruitment.deadline }}</p>
                <p v-if="recruitment.daysLeft !== null" :class="['text-sm font-medium', getDaysLeftClass(recruitment.daysLeft)]">
                  {{ recruitment.daysLeft === 0 ? '오늘 마감' : `D-${recruitment.daysLeft}` }}
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <DocumentTextIcon class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p class="text-sm text-gray-600">지원 현황</p>
                <p class="text-lg font-semibold text-gray-900">{{ recruitment.applicants }}/{{ recruitment.positions }}명</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 공고 내용 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon class="w-6 h-6 text-primary-600" />
            모집 내용
          </h3>
          <div class="prose max-w-none text-gray-700 leading-relaxed">
            <p class="mb-4">{{ recruitment.description }}</p>
            
            <h4 class="text-lg font-semibold text-gray-900 mt-6 mb-3">주요 업무</h4>
            <ul class="list-disc list-inside space-y-2 ml-2">
              <li v-for="(task, index) in recruitment.tasks" :key="index">{{ task }}</li>
            </ul>

            <h4 class="text-lg font-semibold text-gray-900 mt-6 mb-3">우대 사항</h4>
            <ul class="list-disc list-inside space-y-2 ml-2">
              <li v-for="(benefit, index) in recruitment.benefits" :key="index">{{ benefit }}</li>
            </ul>
          </div>
        </div>

        <!-- 기관 소개 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
            기관 소개
          </h3>
          <p class="text-gray-700 leading-relaxed mb-4">{{ recruitment.institutionInfo }}</p>
          
          <!-- 기관 상세 정보 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-start gap-2">
              <MapPinIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-gray-600">주소</p>
                <p class="text-sm font-medium text-gray-900">{{ recruitment.address }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <PhoneIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-gray-600">연락처</p>
                <p class="text-sm font-medium text-gray-900">{{ recruitment.phone }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <EnvelopeIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-gray-600">이메일</p>
                <p class="text-sm font-medium text-gray-900">{{ recruitment.email }}</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <GlobeAltIcon class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-gray-600">웹사이트</p>
                <a :href="recruitment.website" target="_blank" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                  {{ recruitment.website }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- 태그 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">키워드</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in recruitment.tags"
              :key="tag"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 지원 패널 -->
      <div class="lg:col-span-1">
        <div class="sticky top-6 space-y-4">
          <!-- 지원 카드 -->
          <div class="bg-white rounded-lg shadow-md border-2 border-primary-200 p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">지원하기</h3>
            
            <!-- D-Day 표시 -->
            <div
              v-if="recruitment.daysLeft !== null && recruitment.daysLeft <= 7"
              :class="[
                'px-4 py-3 rounded-lg text-center font-bold text-lg mb-4',
                recruitment.daysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              ]"
            >
              {{ recruitment.daysLeft === 0 ? '오늘 마감!' : `마감까지 ${recruitment.daysLeft}일` }}
            </div>

            <!-- 지원 정보 -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">지원 현황</span>
                <span class="font-semibold text-gray-900">{{ recruitment.applicants }}/{{ recruitment.positions }}명</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :style="{ width: `${(recruitment.applicants / recruitment.positions) * 100}%` }"
                  :class="[
                    'h-2 rounded-full transition-all',
                    recruitment.applicants / recruitment.positions >= 0.8 ? 'bg-red-500' : 'bg-primary-600'
                  ]"
                ></div>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">모집 마감일</span>
                <span class="font-semibold text-gray-900">{{ recruitment.deadline }}</span>
              </div>
            </div>

            <!-- 지원 버튼 -->
            <button
              v-if="recruitment.status === 'RECRUITING' || recruitment.status === 'CLOSING_SOON'"
              @click="showApplicationModal = true"
              :disabled="recruitment.applicants >= recruitment.positions"
              class="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ recruitment.applicants >= recruitment.positions ? '정원 마감' : '지원하기' }}
            </button>
            <button
              v-else
              disabled
              class="w-full py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              모집 마감
            </button>

            <!-- 안내 문구 -->
            <p class="text-xs text-gray-500 text-center mt-4">
              이력서를 첨부하여 지원하세요
            </p>
          </div>

          <!-- 공유 & 저장 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="shareRecruitment"
                class="flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon class="w-4 h-4" />
                <span class="text-sm font-medium">공유</span>
              </button>
              <button
                @click="bookmarkRecruitment"
                class="flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookmarkIcon class="w-4 h-4" />
                <span class="text-sm font-medium">저장</span>
              </button>
            </div>
          </div>

          <!-- 문의하기 -->
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <InformationCircleIcon class="w-5 h-5 text-blue-600" />
              문의사항이 있으신가요?
            </h4>
            <p class="text-sm text-gray-700 mb-3">
              공고에 대해 궁금한 점이 있다면 기관에 직접 문의해보세요.
            </p>
            <a
              :href="`tel:${recruitment.phone}`"
              class="block w-full py-2 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              전화 문의하기
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 지원 모달 -->
    <Modal
      :show="showApplicationModal"
      @close="closeApplicationModal"
      title="모집공고 지원하기"
      size="lg"
    >
      <div class="space-y-6">
        <!-- 공고 정보 요약 -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 class="font-semibold text-gray-900 mb-2">지원 공고</h4>
          <p class="text-sm text-gray-700 font-medium">{{ recruitment.institutionName }}</p>
          <p class="text-sm text-gray-600">{{ recruitment.title }}</p>
        </div>

        <!-- 지원자 정보 -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            지원자 정보
          </label>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                v-model="applicationForm.name"
                type="text"
                placeholder="홍길동"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input
                v-model="applicationForm.phone"
                type="tel"
                placeholder="010-1234-5678"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                v-model="applicationForm.email"
                type="email"
                placeholder="example@email.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 이력서 업로드 -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            이력서 첨부 <span class="text-red-500">*</span>
          </label>
          <div
            @click="triggerFileUpload"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            ]"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".pdf,.doc,.docx,.hwp"
              @change="handleFileSelect"
              class="hidden"
            />
            
            <div v-if="!applicationForm.resume" class="space-y-2">
              <DocumentArrowUpIcon class="w-12 h-12 text-gray-400 mx-auto" />
              <p class="text-sm font-medium text-gray-700">
                클릭하거나 파일을 드래그하여 업로드
              </p>
              <p class="text-xs text-gray-500">
                PDF, DOC, DOCX, HWP 형식 (최대 10MB)
              </p>
            </div>

            <div v-else class="space-y-2">
              <div class="flex items-center justify-center gap-2">
                <DocumentCheckIcon class="w-8 h-8 text-green-600" />
              </div>
              <p class="text-sm font-medium text-gray-900">{{ applicationForm.resume.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(applicationForm.resume.size) }}</p>
              <button
                @click.stop="removeFile"
                class="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                파일 삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 자기소개 (선택) -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">
            자기소개 (선택사항)
          </label>
          <textarea
            v-model="applicationForm.introduction"
            rows="4"
            placeholder="간단한 자기소개나 지원 동기를 작성해주세요"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- 개인정보 동의 -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <label class="flex items-start gap-3 cursor-pointer">
            <input
              v-model="applicationForm.agreedToPrivacy"
              type="checkbox"
              class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div class="text-sm">
              <span class="font-medium text-gray-900">개인정보 수집 및 이용 동의</span>
              <span class="text-red-500">*</span>
              <p class="text-gray-600 mt-1">
                지원 처리를 위해 제공하신 개인정보(이름, 연락처, 이메일, 이력서)는 채용 목적으로만 사용되며, 
                지원 종료 후 즉시 파기됩니다.
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- 모달 버튼 -->
      <template #footer>
        <div class="flex gap-3">
          <button
            @click="closeApplicationModal"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            @click="submitApplication"
            :disabled="!isFormValid"
            class="flex-1 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            지원 제출
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Modal from '@/components/common/Modal.vue'
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  EyeIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ShareIcon,
  BookmarkIcon,
  InformationCircleIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// Mock 데이터 (실제로는 API에서 가져옴)
const recruitment = ref({
  id: 1,
  institutionName: '서울시립노인종합복지관',
  region: '서울',
  field: '노인복지',
  title: '2025년 상반기 사회복지 현장실습생 모집',
  positions: 4,
  applicants: 2,
  duration: '4주 (160시간)',
  deadline: '2025.02.28',
  daysLeft: 2,
  views: 245,
  status: 'CLOSING_SOON',
  tags: ['주말가능', '교통편리', '슈퍼비전', '우수기관'],
  description: '서울시립노인종합복지관에서 2025년 상반기 사회복지 현장실습생을 모집합니다. 노인복지 분야에 관심이 있는 학생들의 많은 지원 바랍니다.',
  tasks: [
    '노인 프로그램 운영 보조',
    '상담 및 사례관리 실습',
    '행정업무 보조',
    '노인 여가활동 지원',
    '실습일지 작성 및 슈퍼비전'
  ],
  benefits: [
    '전문 슈퍼바이저 배정',
    '주말 실습 가능 (평일 어려운 학생)',
    '교통비 일부 지원',
    '우수 실습생 채용 연계',
    '실습 수료증 발급'
  ],
  institutionInfo: '서울시립노인종합복지관은 1995년 설립된 서울시 직영 종합사회복지관으로, 노인복지 분야의 선도적인 역할을 수행하고 있습니다. 다양한 프로그램과 전문 인력을 갖추고 있으며, 실습생 교육에 많은 노력을 기울이고 있습니다.',
  address: '서울시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  email: 'info@seoulsenior.or.kr',
  website: 'https://www.seoulsenior.or.kr'
})

// 뒤로가기
const goBack = () => {
  router.push({ name: 'StudentRecruitments' })
}

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    RECRUITING: '모집중',
    CLOSING_SOON: '마감임박',
    CLOSED: '마감'
  }
  return labels[status] || status
}

// 상태 스타일
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    RECRUITING: 'bg-green-100 text-green-700',
    CLOSING_SOON: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-100 text-gray-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// 남은 일수 스타일
const getDaysLeftClass = (daysLeft: number | null) => {
  if (daysLeft === null) return 'text-gray-900'
  if (daysLeft <= 3) return 'text-red-600'
  if (daysLeft <= 7) return 'text-orange-600'
  return 'text-gray-900'
}

// 지원 모달 상태
const showApplicationModal = ref(false)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// 지원 폼
const applicationForm = ref({
  name: '',
  phone: '',
  email: '',
  resume: null as File | null,
  introduction: '',
  agreedToPrivacy: false
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    applicationForm.value.name.trim() !== '' &&
    applicationForm.value.phone.trim() !== '' &&
    applicationForm.value.email.trim() !== '' &&
    applicationForm.value.resume !== null &&
    applicationForm.value.agreedToPrivacy
  )
})

// 파일 업로드 트리거
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 파일 선택
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    validateAndSetFile(file)
  }
}

// 파일 드롭
const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    validateAndSetFile(files[0])
  }
}

// 파일 검증 및 설정
const validateAndSetFile = (file: File) => {
  // 파일 크기 검증 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('파일 크기는 10MB를 초과할 수 없습니다.')
    return
  }

  // 파일 형식 검증
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['pdf', 'doc', 'docx', 'hwp']
  
  if (!allowedExtensions.includes(fileExtension || '')) {
    alert('PDF, DOC, DOCX, HWP 형식의 파일만 업로드 가능합니다.')
    return
  }

  applicationForm.value.resume = file
}

// 파일 삭제
const removeFile = () => {
  applicationForm.value.resume = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 모달 닫기
const closeApplicationModal = () => {
  showApplicationModal.value = false
  // 폼 초기화
  applicationForm.value = {
    name: '',
    phone: '',
    email: '',
    resume: null,
    introduction: '',
    agreedToPrivacy: false
  }
  isDragging.value = false
}

// 지원 제출
const submitApplication = async () => {
  if (!isFormValid.value) {
    alert('필수 항목을 모두 입력해주세요.')
    return
  }

  // TODO: 실제 API 호출로 교체
  // FormData 생성
  const formData = new FormData()
  formData.append('recruitmentId', recruitment.value.id.toString())
  formData.append('name', applicationForm.value.name)
  formData.append('phone', applicationForm.value.phone)
  formData.append('email', applicationForm.value.email)
  if (applicationForm.value.resume) {
    formData.append('resume', applicationForm.value.resume)
  }
  if (applicationForm.value.introduction) {
    formData.append('introduction', applicationForm.value.introduction)
  }

  try {
    // 임시: 성공 알림
    alert('지원이 완료되었습니다!\n\n이력서가 기관에 전달되었으며,\n기관에서 검토 후 연락드릴 예정입니다.')
    closeApplicationModal()
    router.push({ name: 'StudentRecruitments' })
  } catch (error) {
    alert('지원 제출 중 오류가 발생했습니다.')
    console.error(error)
  }
}

// 공유하기
const shareRecruitment = () => {
  if (navigator.share) {
    navigator.share({
      title: recruitment.value.title,
      text: `${recruitment.value.institutionName} - ${recruitment.value.title}`,
      url: window.location.href
    })
  } else {
    alert('링크가 복사되었습니다!')
  }
}

// 북마크
const bookmarkRecruitment = () => {
  alert('공고가 저장되었습니다!')
}
</script>
