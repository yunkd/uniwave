<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <!-- 헤더 -->
    <div class="max-w-5xl mx-auto mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">서류 업로드</h1>
      <p class="text-sm sm:text-base text-gray-600">제본 신청에 필요한 서류를 업로드하세요</p>
    </div>

    <!-- 업로드 진행 상태 -->
    <div class="max-w-5xl mx-auto mb-6">
      <Card class="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <DocumentTextIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-1">업로드 진행 상태</h3>
              <p class="text-sm text-gray-600">{{ uploadedCount }}/5 서류 업로드 완료</p>
            </div>
          </div>
          <div class="w-full sm:w-auto">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex-1 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ uploadProgress }}%</span>
            </div>
            <p v-if="uploadedCount === 5" class="text-xs text-green-600 font-medium">
              ✓ 모든 서류 업로드 완료! 제본 신청이 가능합니다.
            </p>
            <p v-else class="text-xs text-gray-500">
              {{ 5 - uploadedCount }}개 서류 업로드 필요
            </p>
          </div>
        </div>
      </Card>
    </div>

    <!-- 서류 업로드 섹션 -->
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- 1. 실습일지 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="uploadedDocuments.journal ? 'bg-green-100' : 'bg-gray-100'"
            >
              <CheckCircleIcon 
                v-if="uploadedDocuments.journal" 
                class="w-6 h-6 text-green-600" 
              />
              <span v-else class="text-sm font-semibold text-gray-600">1</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">실습일지</h3>
                <p class="text-sm text-gray-600">날짜별로 작성한 실습일지를 압축파일(ZIP)로 업로드하세요</p>
              </div>
              <button
                @click="downloadJournals"
                class="flex-shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <ArrowDownTrayIcon class="w-4 h-4 inline mr-1" />
                일지 다운로드
              </button>
            </div>
            
            <div
              v-if="!uploadedDocuments.journal"
              @click="triggerFileUpload('journal')"
              @dragover.prevent="handleDragOver($event, 'journal')"
              @dragleave="handleDragLeave('journal')"
              @drop.prevent="handleDrop($event, 'journal')"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                dragStates.journal ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              ]"
            >
              <ArrowUpTrayIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600">
                클릭하거나 파일을 드래그하여 업로드
              </p>
              <p class="text-xs text-gray-500 mt-1">ZIP 파일만 가능 (최대 50MB)</p>
              <input
                ref="journalInput"
                type="file"
                accept=".zip"
                @change="handleFileSelect($event, 'journal')"
                class="hidden"
              />
            </div>
            
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <div>
                    <p class="text-sm font-medium text-green-900">{{ uploadedDocuments.journal.name }}</p>
                    <p class="text-xs text-green-700">{{ formatFileSize(uploadedDocuments.journal.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeDocument('journal')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 2. 출석부 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="uploadedDocuments.attendance ? 'bg-green-100' : 'bg-gray-100'"
            >
              <CheckCircleIcon 
                v-if="uploadedDocuments.attendance" 
                class="w-6 h-6 text-green-600" 
              />
              <span v-else class="text-sm font-semibold text-gray-600">2</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">출석부</h3>
              <p class="text-sm text-gray-600">기관에서 확인한 출석부를 업로드하세요</p>
            </div>
            
            <div
              v-if="!uploadedDocuments.attendance"
              @click="triggerFileUpload('attendance')"
              @dragover.prevent="handleDragOver($event, 'attendance')"
              @dragleave="handleDragLeave('attendance')"
              @drop.prevent="handleDrop($event, 'attendance')"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                dragStates.attendance ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              ]"
            >
              <ArrowUpTrayIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600">클릭하거나 파일을 드래그하여 업로드</p>
              <p class="text-xs text-gray-500 mt-1">PDF, DOCX 파일 가능 (최대 10MB)</p>
              <input
                ref="attendanceInput"
                type="file"
                accept=".pdf,.docx"
                @change="handleFileSelect($event, 'attendance')"
                class="hidden"
              />
            </div>
            
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <div>
                    <p class="text-sm font-medium text-green-900">{{ uploadedDocuments.attendance.name }}</p>
                    <p class="text-xs text-green-700">{{ formatFileSize(uploadedDocuments.attendance.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeDocument('attendance')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 3. 평가서 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="uploadedDocuments.evaluation ? 'bg-green-100' : 'bg-gray-100'"
            >
              <CheckCircleIcon 
                v-if="uploadedDocuments.evaluation" 
                class="w-6 h-6 text-green-600" 
              />
              <span v-else class="text-sm font-semibold text-gray-600">3</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">평가서</h3>
              <p class="text-sm text-gray-600">기관에서 발급한 평가서를 업로드하세요</p>
            </div>
            
            <div
              v-if="!uploadedDocuments.evaluation"
              @click="triggerFileUpload('evaluation')"
              @dragover.prevent="handleDragOver($event, 'evaluation')"
              @dragleave="handleDragLeave('evaluation')"
              @drop.prevent="handleDrop($event, 'evaluation')"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                dragStates.evaluation ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              ]"
            >
              <ArrowUpTrayIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600">클릭하거나 파일을 드래그하여 업로드</p>
              <p class="text-xs text-gray-500 mt-1">PDF 파일만 가능 (최대 10MB)</p>
              <input
                ref="evaluationInput"
                type="file"
                accept=".pdf"
                @change="handleFileSelect($event, 'evaluation')"
                class="hidden"
              />
            </div>
            
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <div>
                    <p class="text-sm font-medium text-green-900">{{ uploadedDocuments.evaluation.name }}</p>
                    <p class="text-xs text-green-700">{{ formatFileSize(uploadedDocuments.evaluation.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeDocument('evaluation')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 4. 확인서 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="uploadedDocuments.certificate ? 'bg-green-100' : 'bg-gray-100'"
            >
              <CheckCircleIcon 
                v-if="uploadedDocuments.certificate" 
                class="w-6 h-6 text-green-600" 
              />
              <span v-else class="text-sm font-semibold text-gray-600">4</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">확인서</h3>
              <p class="text-sm text-gray-600">기관에서 발급한 확인서를 업로드하세요</p>
            </div>
            
            <div
              v-if="!uploadedDocuments.certificate"
              @click="triggerFileUpload('certificate')"
              @dragover.prevent="handleDragOver($event, 'certificate')"
              @dragleave="handleDragLeave('certificate')"
              @drop.prevent="handleDrop($event, 'certificate')"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                dragStates.certificate ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              ]"
            >
              <ArrowUpTrayIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600">클릭하거나 파일을 드래그하여 업로드</p>
              <p class="text-xs text-gray-500 mt-1">PDF 파일만 가능 (최대 10MB)</p>
              <input
                ref="certificateInput"
                type="file"
                accept=".pdf"
                @change="handleFileSelect($event, 'certificate')"
                class="hidden"
              />
            </div>
            
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <div>
                    <p class="text-sm font-medium text-green-900">{{ uploadedDocuments.certificate.name }}</p>
                    <p class="text-xs text-green-700">{{ formatFileSize(uploadedDocuments.certificate.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeDocument('certificate')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 5. 최종보고서 -->
      <Card class="p-4 sm:p-6">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="uploadedDocuments.finalReport ? 'bg-green-100' : 'bg-gray-100'"
            >
              <CheckCircleIcon 
                v-if="uploadedDocuments.finalReport" 
                class="w-6 h-6 text-green-600" 
              />
              <span v-else class="text-sm font-semibold text-gray-600">5</span>
            </div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">최종보고서</h3>
                <p class="text-sm text-gray-600">작성한 최종보고서 PDF를 업로드하세요</p>
              </div>
              <button
                @click="goToReportWrite"
                class="flex-shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <PencilIcon class="w-4 h-4 inline mr-1" />
                보고서 작성
              </button>
            </div>
            
            <div
              v-if="!uploadedDocuments.finalReport"
              @click="triggerFileUpload('finalReport')"
              @dragover.prevent="handleDragOver($event, 'finalReport')"
              @dragleave="handleDragLeave('finalReport')"
              @drop.prevent="handleDrop($event, 'finalReport')"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
                dragStates.finalReport ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              ]"
            >
              <ArrowUpTrayIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p class="text-sm text-gray-600">클릭하거나 파일을 드래그하여 업로드</p>
              <p class="text-xs text-gray-500 mt-1">PDF 파일만 가능 (최대 10MB)</p>
              <input
                ref="finalReportInput"
                type="file"
                accept=".pdf"
                @change="handleFileSelect($event, 'finalReport')"
                class="hidden"
              />
            </div>
            
            <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <DocumentIcon class="w-6 h-6 text-green-600" />
                  <div>
                    <p class="text-sm font-medium text-green-900">{{ uploadedDocuments.finalReport.name }}</p>
                    <p class="text-xs text-green-700">{{ formatFileSize(uploadedDocuments.finalReport.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeDocument('finalReport')"
                  class="text-red-600 hover:text-red-700 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 제본 신청 버튼 -->
      <Card class="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">모든 서류 업로드 완료</h3>
            <p class="text-sm text-gray-600">제본 신청을 진행하시겠습니까?</p>
          </div>
          <Button
            @click="goToBinding"
            :disabled="uploadedCount < 5"
            variant="primary"
            class="w-full sm:w-auto"
          >
            <ClipboardDocumentCheckIcon class="w-5 h-5 mr-2" />
            제본 신청하기
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'
import Card from '@/components/common/Card.vue'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  XMarkIcon,
  PencilIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// 업로드된 서류
const uploadedDocuments = reactive({
  journal: null as File | null,
  attendance: null as File | null,
  evaluation: null as File | null,
  certificate: null as File | null,
  finalReport: null as File | null
})

// 드래그 상태
const dragStates = reactive({
  journal: false,
  attendance: false,
  evaluation: false,
  certificate: false,
  finalReport: false
})

// Refs
const journalInput = ref<HTMLInputElement>()
const attendanceInput = ref<HTMLInputElement>()
const evaluationInput = ref<HTMLInputElement>()
const certificateInput = ref<HTMLInputElement>()
const finalReportInput = ref<HTMLInputElement>()

// 업로드 완료 개수
const uploadedCount = computed(() => {
  return Object.values(uploadedDocuments).filter(doc => doc !== null).length
})

// 업로드 진행률
const uploadProgress = computed(() => {
  return Math.round((uploadedCount.value / 5) * 100)
})

// 파일 선택 트리거
const triggerFileUpload = (type: string) => {
  const inputMap: Record<string, any> = {
    journal: journalInput,
    attendance: attendanceInput,
    evaluation: evaluationInput,
    certificate: certificateInput,
    finalReport: finalReportInput
  }
  inputMap[type].value?.click()
}

// 파일 선택 처리
const handleFileSelect = (event: Event, type: keyof typeof uploadedDocuments) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    validateAndUpload(file, type)
  }
}

// 드래그 오버
const handleDragOver = (event: DragEvent, type: keyof typeof dragStates) => {
  dragStates[type] = true
}

// 드래그 떠남
const handleDragLeave = (type: keyof typeof dragStates) => {
  dragStates[type] = false
}

// 드롭 처리
const handleDrop = (event: DragEvent, type: keyof typeof uploadedDocuments) => {
  dragStates[type] = false
  const file = event.dataTransfer?.files[0]
  
  if (file) {
    validateAndUpload(file, type)
  }
}

// 파일 검증 및 업로드
const validateAndUpload = (file: File, type: keyof typeof uploadedDocuments) => {
  // 파일 크기 검증
  const maxSize = type === 'journal' ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // journal: 50MB, 나머지: 10MB
  if (file.size > maxSize) {
    alert(`파일 크기가 너무 큽니다. 최대 ${type === 'journal' ? '50MB' : '10MB'}까지 업로드 가능합니다.`)
    return
  }

  // 파일 형식 검증
  const allowedExtensions: Record<string, string[]> = {
    journal: ['.zip'],
    attendance: ['.pdf', '.docx'],
    evaluation: ['.pdf'],
    certificate: ['.pdf'],
    finalReport: ['.pdf']
  }

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedExtensions[type].includes(fileExtension)) {
    alert(`${allowedExtensions[type].join(', ')} 파일만 업로드 가능합니다.`)
    return
  }

  // 업로드
  uploadedDocuments[type] = file
  console.log(`${type} 업로드 완료:`, file.name)
  
  // 업로드 상태 저장
  saveUploadState()
}

// 서류 삭제
const removeDocument = (type: keyof typeof uploadedDocuments) => {
  if (confirm('업로드한 파일을 삭제하시겠습니까?')) {
    uploadedDocuments[type] = null
    saveUploadState()
  }
}

// 업로드 상태 저장 (localStorage)
const saveUploadState = () => {
  const uploadState = {
    journal: uploadedDocuments.journal ? {
      name: uploadedDocuments.journal.name,
      size: uploadedDocuments.journal.size,
      uploaded: true
    } : null,
    attendance: uploadedDocuments.attendance ? {
      name: uploadedDocuments.attendance.name,
      size: uploadedDocuments.attendance.size,
      uploaded: true
    } : null,
    evaluation: uploadedDocuments.evaluation ? {
      name: uploadedDocuments.evaluation.name,
      size: uploadedDocuments.evaluation.size,
      uploaded: true
    } : null,
    certificate: uploadedDocuments.certificate ? {
      name: uploadedDocuments.certificate.name,
      size: uploadedDocuments.certificate.size,
      uploaded: true
    } : null,
    finalReport: uploadedDocuments.finalReport ? {
      name: uploadedDocuments.finalReport.name,
      size: uploadedDocuments.finalReport.size,
      uploaded: true
    } : null,
    uploadedAt: new Date().toISOString()
  }
  
  localStorage.setItem('uploaded_documents', JSON.stringify(uploadState))
  console.log('업로드 상태 저장:', uploadState)
}

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 실습일지 다운로드
const downloadJournals = () => {
  alert('실습일지 전체를 날짜별로 압축하여 다운로드합니다.\n파일명: 실습일지_홍길동_20240101-20240228.zip')
  // Mock: 실제로는 백엔드 API 호출
  console.log('실습일지 다운로드 시작')
}

// 최종보고서 작성 페이지로 이동
const goToReportWrite = () => {
  router.push('/student/report/write')
}

// 제본 신청 페이지로 이동
const goToBinding = () => {
  if (uploadedCount.value < 5) {
    alert('모든 서류를 업로드해야 제본 신청이 가능합니다.')
    return
  }
  
  // 최종 업로드 상태 저장
  saveUploadState()
  
  // 제본 신청 페이지로 이동
  router.push('/student/binding')
}

// 컴포넌트 마운트 시 기존 업로드 상태 불러오기 (선택사항)
onMounted(() => {
  // localStorage에서 이전 업로드 상태 확인
  try {
    const savedState = localStorage.getItem('uploaded_documents')
    if (savedState) {
      const uploadState = JSON.parse(savedState)
      console.log('기존 업로드 상태 확인됨:', uploadState)
      // Note: File 객체는 localStorage에 저장할 수 없으므로,
      // 실제 백엔드 연동 시 서버에서 업로드 상태를 조회해야 함
    }
  } catch (error) {
    console.error('업로드 상태 불러오기 실패:', error)
  }
})
</script>
