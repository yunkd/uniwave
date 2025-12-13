<template>
  <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 뒤로 가기 -->
    <Button
      variant="ghost"
      size="sm"
      @click="router.back()"
      class="mb-4 text-xs sm:text-sm"
    >
      <ChevronLeftIcon class="w-4 h-4 mr-1" />
      목록으로
    </Button>

    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">협력 기관 등록</h1>
      <p class="text-xs sm:text-sm text-gray-600">전국 기관 DB에서 검색하여 협력 관계를 맺으세요</p>
    </div>

    <!-- 안내 메시지 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card class="p-3 sm:p-4 bg-blue-50 border-blue-200">
        <div class="flex gap-3">
          <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-blue-900 mb-1">전국 기관 DB 공유</h3>
            <p class="text-xs text-blue-800 leading-relaxed">
              전국 모든 실습 기관 정보가 공유됩니다. 원하는 기관을 검색하여 협력 관계를 맺으세요.
            </p>
          </div>
        </div>
      </Card>
      <Card class="p-3 sm:p-4 bg-amber-50 border-amber-200">
        <div class="flex gap-3">
          <InformationCircleIcon class="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-amber-900 mb-1">매칭 코드 발급</h3>
            <p class="text-xs text-amber-800 leading-relaxed">
              협력 등록 시 고유 매칭 코드가 생성됩니다. 이 코드를 기관에 전달하면 학생이 매칭 신청할 수 있습니다.
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- 등록 폼 -->
    <Card class="p-4 sm:p-6">
      <form @submit.prevent="handleSubmit">
        <!-- 기본 정보 -->
        <div class="mb-6">
          <h2 class="text-base font-bold text-gray-900 mb-4">기본 정보</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                기관명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="예: 서울사회복지관"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                기관 유형 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              >
                <option value="">선택하세요</option>
                <option value="사회복지관">사회복지관</option>
                <option value="노인복지시설">노인복지시설</option>
                <option value="아동복지시설">아동복지시설</option>
                <option value="장애인복지시설">장애인복지시설</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                주소 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.address"
                type="text"
                required
                placeholder="기관 주소를 입력하세요"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 담당자 정보 -->
        <div class="mb-6">
          <h2 class="text-base font-bold text-gray-900 mb-4">담당자 정보</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                담당자명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.managerName"
                type="text"
                required
                placeholder="홍길동"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.managerPhone"
                type="tel"
                required
                placeholder="010-0000-0000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 연락 정보 -->
        <div class="mb-6">
          <h2 class="text-base font-bold text-gray-900 mb-4">연락 정보</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="institution@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
              <input
                v-model="form.phone"
                type="tel"
                placeholder="02-000-0000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 추가 정보 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">메모</label>
          <textarea
            v-model="form.memo"
            rows="4"
            placeholder="기관에 대한 메모를 입력하세요"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          ></textarea>
        </div>

        <!-- 버튼 -->
        <div class="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            @click="router.back()"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            등록하기
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import { ChevronLeftIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const form = ref({
  name: '',
  type: '',
  address: '',
  managerName: '',
  managerPhone: '',
  email: '',
  phone: '',
  memo: ''
})

const handleSubmit = () => {
  console.log('기관 등록:', form.value)
  // TODO: API 호출
  // - 대학 기관 목록에 추가
  // - 학생 기관 검색 목록에 자동 노출 (status: ACTIVE)
  // - 기관 초대 이메일 발송 옵션 (선택)
  alert('기관이 등록되었습니다.\n학생 기관 검색에 자동으로 노출됩니다.')
  router.push('/university/institutions')
}
</script>
