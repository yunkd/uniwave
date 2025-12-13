<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    <!-- 페이지 헤더 -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">학생 회원가입 승인</h1>
      <p class="text-xs sm:text-sm text-gray-600">신규 가입한 학생을 검토하고 승인하세요</p>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-gray-600">전체 신청</p>
          <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ stats.total }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-yellow-600">승인 대기</p>
          <p class="text-lg sm:text-2xl font-bold text-yellow-600">{{ stats.pending }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-green-600">승인 완료</p>
          <p class="text-lg sm:text-2xl font-bold text-green-600">{{ stats.approved }}명</p>
        </div>
      </Card>
      <Card class="p-3 sm:p-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs sm:text-sm text-red-600">반려</p>
          <p class="text-lg sm:text-2xl font-bold text-red-600">{{ stats.rejected }}명</p>
        </div>
      </Card>
    </div>

    <!-- 필터 및 검색 -->
    <Card class="mb-4 sm:mb-6 p-3 sm:p-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <select
          v-model="selectedDepartment"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 학과</option>
          <option value="사회복지학과">사회복지학과</option>
          <option value="아동복지학과">아동복지학과</option>
          <option value="노인복지학과">노인복지학과</option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
        >
          <option value="ALL">전체 상태</option>
          <option value="PENDING">승인대기</option>
          <option value="APPROVED">승인완료</option>
          <option value="REJECTED">반려</option>
        </select>
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="학생 이름 또는 학번으로 검색..."
            class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs sm:text-sm"
          />
        </div>
      </div>
    </Card>

    <!-- 학생 목록 -->
    <Card class="overflow-hidden">
      <!-- 빈 상태 -->
      <div v-if="filteredStudents.length === 0" class="p-6 sm:p-8 lg:p-12 text-center">
        <UserGroupIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
        <p class="text-sm sm:text-base text-gray-600">승인 대기 중인 학생이 없습니다</p>
      </div>

      <!-- 데스크톱 테이블 -->
      <div v-else class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학생 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                학과
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신청일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {{ student.name[0] }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                    <p class="text-xs text-gray-500">{{ student.studentId }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ student.department }}</p>
                <p class="text-xs text-gray-500">{{ student.grade }}학년</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ student.phone }}</p>
                <p class="text-xs text-gray-500">{{ student.email }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <p class="text-sm text-gray-900">{{ student.appliedAt }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusColor(student.status)"
                  class="px-2 py-1 text-xs font-medium rounded"
                >
                  {{ getStatusLabel(student.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div v-if="student.status === 'PENDING'" class="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="handleReject(student)"
                  >
                    반려
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    @click="handleApprove(student)"
                  >
                    승인
                  </Button>
                </div>
                <div v-else class="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="handleViewDetail(student)"
                  >
                    상세보기
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 모바일 카드 뷰 -->
      <div v-if="filteredStudents.length > 0" class="lg:hidden divide-y divide-gray-200">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                {{ student.name[0] }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                <p class="text-xs text-gray-500">{{ student.studentId }}</p>
              </div>
            </div>
            <span
              :class="getStatusColor(student.status)"
              class="px-2 py-1 text-xs font-medium rounded"
            >
              {{ getStatusLabel(student.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p class="text-xs text-gray-500 mb-1">학과</p>
              <p class="text-sm font-medium text-gray-900">{{ student.department }}</p>
              <p class="text-xs text-gray-500">{{ student.grade }}학년</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">신청일</p>
              <p class="text-sm font-medium text-gray-900">{{ student.appliedAt }}</p>
            </div>
          </div>

          <div class="mb-3">
            <p class="text-xs text-gray-500 mb-1">연락처</p>
            <p class="text-sm font-medium text-gray-900">{{ student.phone }}</p>
            <p class="text-xs text-gray-500">{{ student.email }}</p>
          </div>

          <div v-if="student.status === 'PENDING'" class="flex gap-2">
            <Button
              variant="outline"
              class="flex-1 text-xs sm:text-sm"
              @click="handleReject(student)"
            >
              반려
            </Button>
            <Button
              variant="primary"
              class="flex-1 text-xs sm:text-sm"
              @click="handleApprove(student)"
            >
              승인
            </Button>
          </div>
          <div v-else>
            <Button
              variant="ghost"
              class="w-full text-xs sm:text-sm"
              @click="handleViewDetail(student)"
            >
              상세보기
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- 반려 사유 모달 -->
    <Modal v-if="showRejectModal" @close="showRejectModal = false">
      <template #title>학생 반려</template>
      <template #content>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-700 mb-2">
              <strong>{{ selectedStudent?.name }}</strong> 학생의 가입 신청을 반려하시겠습니까?
            </p>
            <p class="text-xs text-gray-500">반려 사유는 학생에게 전달됩니다.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">반려 사유 *</label>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="반려 사유를 입력하세요 (예: 학번 오류, 소속 대학 불일치 등)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <Button variant="outline" @click="showRejectModal = false">
            취소
          </Button>
          <Button variant="danger" @click="confirmReject" :disabled="!rejectReason.trim()">
            반려 확정
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import Modal from '@/components/common/Modal.vue'
import {
  UserGroupIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 필터 상태
const selectedDepartment = ref('ALL')
const selectedStatus = ref('PENDING') // 기본값: 승인대기만 표시
const searchQuery = ref('')

// 모달 상태
const showRejectModal = ref(false)
const selectedStudent = ref<any>(null)
const rejectReason = ref('')

// 통계 데이터 (Mock)
const stats = ref({
  total: 23,
  pending: 8,
  approved: 12,
  rejected: 3
})

// 학생 목록 (Mock)
const students = ref([
  {
    id: '1',
    name: '홍길동',
    studentId: '2021012345',
    department: '사회복지학과',
    grade: 3,
    phone: '010-1234-5678',
    email: 'hong@example.com',
    appliedAt: '2024-12-10',
    status: 'PENDING'
  },
  {
    id: '2',
    name: '김영희',
    studentId: '2021023456',
    department: '사회복지학과',
    grade: 3,
    phone: '010-2345-6789',
    email: 'kim@example.com',
    appliedAt: '2024-12-11',
    status: 'PENDING'
  },
  {
    id: '3',
    name: '이철수',
    studentId: '2021034567',
    department: '아동복지학과',
    grade: 4,
    phone: '010-3456-7890',
    email: 'lee@example.com',
    appliedAt: '2024-12-09',
    status: 'APPROVED'
  },
  {
    id: '4',
    name: '박민수',
    studentId: '2021045678',
    department: '노인복지학과',
    grade: 3,
    phone: '010-4567-8901',
    email: 'park@example.com',
    appliedAt: '2024-12-08',
    status: 'REJECTED'
  }
])

// 필터링된 학생 목록
const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesDepartment = selectedDepartment.value === 'ALL' || student.department === selectedDepartment.value
    const matchesStatus = selectedStatus.value === 'ALL' || student.status === selectedStatus.value
    const matchesSearch = !searchQuery.value ||
      student.name.includes(searchQuery.value) ||
      student.studentId.includes(searchQuery.value)
    return matchesDepartment && matchesStatus && matchesSearch
  })
})

// 상태 라벨
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDING: '승인대기',
    APPROVED: '승인완료',
    REJECTED: '반려'
  }
  return labels[status] || status
}

// 상태 색상
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// 승인
const handleApprove = (student: any) => {
  if (confirm(`${student.name} 학생의 가입을 승인하시겠습니까?`)) {
    console.log('학생 승인:', student)
    // TODO: API 호출
    student.status = 'APPROVED'
    stats.value.pending--
    stats.value.approved++
    alert('학생 가입이 승인되었습니다')
  }
}

// 반려 모달 열기
const handleReject = (student: any) => {
  selectedStudent.value = student
  rejectReason.value = ''
  showRejectModal.value = true
}

// 반려 확정
const confirmReject = () => {
  if (!rejectReason.value.trim()) {
    alert('반려 사유를 입력해주세요')
    return
  }

  console.log('학생 반려:', selectedStudent.value, '사유:', rejectReason.value)
  // TODO: API 호출
  selectedStudent.value.status = 'REJECTED'
  selectedStudent.value.rejectReason = rejectReason.value
  stats.value.pending--
  stats.value.rejected++
  
  showRejectModal.value = false
  selectedStudent.value = null
  rejectReason.value = ''
  alert('학생 가입이 반려되었습니다')
}

// 상세 보기
const handleViewDetail = (student: any) => {
  router.push(`/university/students/${student.id}`)
}
</script>
