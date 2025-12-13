<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">실습 기관 매칭 신청</h1>
      <p class="text-sm sm:text-base text-gray-600">원하는 기관을 검색하고 매칭을 신청하세요</p>
    </div>

    <!-- 안내 카드 -->
    <Card class="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div class="flex items-start gap-3">
        <InformationCircleIcon class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="text-base font-bold text-blue-900 mb-2">매칭 신청 절차</h3>
          <ol class="text-sm text-blue-800 space-y-2">
            <li class="flex items-start gap-2">
              <span class="font-bold">1.</span>
              <span>아래에서 <strong>원하는 기관 검색</strong> 및 선택</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">2.</span>
              <span>희망 실습 기간 및 신청 메시지 작성</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">3.</span>
              <span>매칭 신청 제출</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold">4.</span>
              <span>대학 담당자 승인 대기 (2-3일 소요)</span>
            </li>
          </ol>
        </div>
      </div>
    </Card>

    <!-- 매칭 신청 폼 -->
    <Card>
      <form @submit.prevent="submitMatching">
        <div class="space-y-6">
          <!-- 기관 검색 및 선택 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              실습 기관 선택 <span class="text-red-500">*</span>
            </label>
            
            <!-- 검색 입력 -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="기관 이름을 입력하세요 (예: 서울사회복지관)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                @input="handleSearch"
                @focus="showDropdown = true"
              />
              <MagnifyingGlassIcon class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <!-- 검색 결과 드롭다운 -->
            <div
              v-if="showDropdown && filteredInstitutions.length > 0"
              class="absolute z-10 mt-1 w-full max-w-3xl bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              <div
                v-for="institution in filteredInstitutions"
                :key="institution.id"
                class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                @click="selectInstitution(institution)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ institution.name }}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      <span class="inline-flex items-center gap-1">
                        <MapPinIcon class="w-4 h-4" />
                        {{ institution.region }} {{ institution.district }}
                      </span>
                      <span class="mx-2">•</span>
                      <span class="inline-flex items-center gap-1">
                        <BriefcaseIcon class="w-4 h-4" />
                        {{ institution.field }}
                      </span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      담당자: {{ institution.contact }} | {{ institution.phone }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <span
                      :class="[
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                        institution.status === 'RECRUITING'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ institution.status === 'RECRUITING' ? '모집중' : '마감' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 검색 결과 없음 -->
            <div
              v-if="showDropdown && searchQuery && filteredInstitutions.length === 0"
              class="absolute z-10 mt-1 w-full max-w-3xl bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500"
            >
              <p>검색 결과가 없습니다.</p>
              <p class="mt-1 text-xs">다른 키워드로 검색해보세요.</p>
            </div>

            <!-- 선택된 기관 표시 -->
            <div v-if="selectedInstitution" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-3">
                  <CheckCircleIcon class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-green-900">선택된 기관</p>
                    <div class="mt-2 text-sm text-green-800">
                      <p class="font-bold text-base">{{ selectedInstitution.name }}</p>
                      <p class="mt-1">
                        <span class="inline-flex items-center gap-1">
                          <MapPinIcon class="w-4 h-4" />
                          {{ selectedInstitution.address }}
                        </span>
                      </p>
                      <p class="mt-1">
                        <span class="inline-flex items-center gap-1">
                          <BriefcaseIcon class="w-4 h-4" />
                          {{ selectedInstitution.field }}
                        </span>
                      </p>
                      <p class="mt-1">
                        <span class="inline-flex items-center gap-1">
                          <PhoneIcon class="w-4 h-4" />
                          {{ selectedInstitution.contact }} - {{ selectedInstitution.phone }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  @click="clearSelection"
                  class="text-green-700 hover:text-green-900 text-sm font-medium"
                >
                  변경
                </button>
              </div>
            </div>

            <p class="mt-2 text-xs text-gray-500">
              💡 기관 이름 또는 지역을 입력하여 검색하세요
            </p>
          </div>

          <!-- 희망 실습 기간 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              희망 실습 기간 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">시작일</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">종료일</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <!-- 신청 메시지 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              신청 메시지 (선택)
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              placeholder="기관 담당자나 대학 담당자에게 전달할 메시지를 작성하세요..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
            ></textarea>
          </div>

          <!-- 제출 버튼 -->
          <div class="flex gap-3">
            <Button
              type="button"
              variant="outline"
              full-width
              @click="router.push('/student/institution-search')"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              full-width
              :disabled="!selectedInstitution || !form.startDate || !form.endDate || isSubmitting"
            >
              <CheckCircleIcon v-if="!isSubmitting" class="w-5 h-5 mr-2" />
              <div v-else class="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSubmitting ? '신청 중...' : '매칭 신청' }}
            </Button>
          </div>
        </div>
      </form>
    </Card>

    <!-- 도움말 -->
    <Card class="mt-6 bg-gray-50">
      <h3 class="text-sm font-bold text-gray-900 mb-3">자주 묻는 질문</h3>
      <div class="space-y-3 text-sm text-gray-600">
        <div>
          <p class="font-medium text-gray-900">Q. 원하는 기관이 검색되지 않아요</p>
          <p class="mt-1">A. "신규기관 등록 신청" 메뉴에서 새로운 기관 등록을 요청할 수 있습니다.</p>
        </div>
        <div>
          <p class="font-medium text-gray-900">Q. 여러 기관에 동시에 신청할 수 있나요?</p>
          <p class="mt-1">A. 아니요, 한 번에 하나의 기관에만 매칭 신청이 가능합니다. 승인 또는 반려 후 다른 기관에 신청할 수 있습니다.</p>
        </div>
        <div>
          <p class="font-medium text-gray-900">Q. 승인까지 얼마나 걸리나요?</p>
          <p class="mt-1">A. 대학 담당자가 검토 후 2-3일 이내에 승인 여부가 결정됩니다. 결과는 이메일과 SMS로 알림을 받게 됩니다.</p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  InformationCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 검색 관련 상태
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedInstitution = ref<any>(null)

// 폼 데이터
const form = ref({
  startDate: '',
  endDate: '',
  message: ''
})

const isSubmitting = ref(false)

// Mock 기관 데이터 (실제로는 API에서 가져옴)
const institutions = ref([
  {
    id: 1,
    name: '서울사회복지관',
    region: '서울',
    district: '강남구',
    address: '서울시 강남구 역삼동 123',
    field: '노인복지',
    contact: '김복지',
    phone: '02-1234-5678',
    status: 'RECRUITING'
  },
  {
    id: 2,
    name: '강남종합사회복지관',
    region: '서울',
    district: '강남구',
    address: '서울시 강남구 삼성동 456',
    field: '종합복지',
    contact: '이담당',
    phone: '02-2234-5678',
    status: 'RECRUITING'
  },
  {
    id: 3,
    name: '부산노인복지센터',
    region: '부산',
    district: '해운대구',
    address: '부산시 해운대구 우동 789',
    field: '노인복지',
    contact: '박관리',
    phone: '051-1234-5678',
    status: 'RECRUITING'
  },
  {
    id: 4,
    name: '대구아동복지센터',
    region: '대구',
    district: '수성구',
    address: '대구시 수성구 범어동 321',
    field: '아동복지',
    contact: '최복지',
    phone: '053-1234-5678',
    status: 'RECRUITING'
  },
  {
    id: 5,
    name: '인천장애인복지관',
    region: '인천',
    district: '남동구',
    address: '인천시 남동구 구월동 654',
    field: '장애인복지',
    contact: '정담당',
    phone: '032-1234-5678',
    status: 'CLOSED'
  },
  {
    id: 6,
    name: '서울시립노인종합복지관',
    region: '서울',
    district: '종로구',
    address: '서울시 종로구 종로1가 100',
    field: '노인복지',
    contact: '강복지',
    phone: '02-3234-5678',
    status: 'RECRUITING'
  },
  {
    id: 7,
    name: '광주청소년복지센터',
    region: '광주',
    district: '동구',
    address: '광주시 동구 금남로 200',
    field: '청소년복지',
    contact: '윤담당',
    phone: '062-1234-5678',
    status: 'RECRUITING'
  },
  {
    id: 8,
    name: '대전가족복지관',
    region: '대전',
    district: '유성구',
    address: '대전시 유성구 봉명동 300',
    field: '가족복지',
    contact: '조복지',
    phone: '042-1234-5678',
    status: 'RECRUITING'
  }
])

// 필터링된 기관 목록
const filteredInstitutions = computed(() => {
  if (!searchQuery.value) return institutions.value

  const query = searchQuery.value.toLowerCase()
  return institutions.value.filter(inst =>
    inst.name.toLowerCase().includes(query) ||
    inst.region.toLowerCase().includes(query) ||
    inst.district.toLowerCase().includes(query) ||
    inst.field.toLowerCase().includes(query) ||
    inst.address.toLowerCase().includes(query)
  )
})

// 검색 입력 핸들러
const handleSearch = () => {
  showDropdown.value = true
}

// 기관 선택
const selectInstitution = (institution: any) => {
  selectedInstitution.value = institution
  searchQuery.value = institution.name
  showDropdown.value = false
}

// 선택 초기화
const clearSelection = () => {
  selectedInstitution.value = null
  searchQuery.value = ''
  showDropdown.value = false
}

// 매칭 신청 제출
const submitMatching = async () => {
  if (!selectedInstitution.value) {
    alert('기관을 선택해주세요.')
    return
  }

  if (!form.value.startDate || !form.value.endDate) {
    alert('희망 실습 기간을 입력해주세요.')
    return
  }

  // 날짜 유효성 검사
  if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
    alert('종료일은 시작일보다 이후여야 합니다.')
    return
  }

  if (confirm(`${selectedInstitution.value.name}에 매칭을 신청하시겠습니까?`)) {
    isSubmitting.value = true

    try {
      // TODO: 실제 API 호출
      // const response = await fetch('/api/student/matching-requests', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     institutionId: selectedInstitution.value.id,
      //     startDate: form.value.startDate,
      //     endDate: form.value.endDate,
      //     message: form.value.message
      //   })
      // })

      // Mock API 응답
      await new Promise(resolve => setTimeout(resolve, 1500))

      alert(`매칭 신청이 완료되었습니다!\n\n기관명: ${selectedInstitution.value.name}\n실습 기간: ${form.value.startDate} ~ ${form.value.endDate}\n\n대학 담당자의 승인을 기다려주세요.\n결과는 이메일과 SMS로 알려드립니다.`)
      router.push('/student/matching/status')
    } catch (error) {
      alert('매칭 신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      isSubmitting.value = false
    }
  }
}

// 드롭다운 외부 클릭 시 닫기
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

// 컴포넌트 마운트 시 이벤트 리스너 추가
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
