<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- 챗봇 버튼 (닫힌 상태) -->
    <Transition name="fade">
      <button
        v-if="!isOpen"
        @click="toggleChat"
        class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
      >
        <!-- 알림 배지 -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
        
        <!-- 아이콘 -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 sm:w-8 sm:h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>

        <!-- 툴팁 -->
        <span class="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {{ chatbotConfig.name }}
        </span>
      </button>
    </Transition>

    <!-- 챗봇 윈도우 (열린 상태) -->
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="w-[90vw] sm:w-96 h-[80vh] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- 헤더 -->
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- 아바타 -->
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <SparklesIcon class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-base">{{ chatbotConfig.name }}</h3>
              <p class="text-xs text-white/80">{{ chatbotConfig.description }}</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- 메시지 영역 -->
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          @scroll="handleScroll"
        >
          <!-- 초기 안내 메시지 -->
          <div v-if="messages.length === 0" class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <SparklesIcon class="w-5 h-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <p class="text-sm text-gray-700 mb-3">{{ chatbotConfig.welcomeMessage }}</p>
                  <div class="space-y-2">
                    <p class="text-xs font-medium text-gray-600 mb-2">자주 묻는 질문:</p>
                    <button
                      v-for="(question, index) in chatbotConfig.quickQuestions"
                      :key="index"
                      @click="sendQuickQuestion(question)"
                      class="block w-full text-left px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs rounded-lg transition-colors"
                    >
                      💬 {{ question }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 메시지 목록 -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex items-start gap-3"
            :class="message.isUser ? 'flex-row-reverse' : ''"
          >
            <!-- 아바타 -->
            <div
              v-if="!message.isUser"
              class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <SparklesIcon class="w-5 h-5 text-primary-600" />
            </div>
            <div
              v-else
              class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <UserIcon class="w-5 h-5 text-gray-600" />
            </div>

            <!-- 메시지 내용 -->
            <div
              class="max-w-[80%] rounded-2xl p-3 shadow-sm"
              :class="[
                message.isUser
                  ? 'bg-primary-500 text-white rounded-tr-none'
                  : 'bg-white text-gray-700 rounded-tl-none'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap" v-html="formatMessage(message.text)"></p>
              <p class="text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</p>
            </div>
          </div>

          <!-- 타이핑 인디케이터 -->
          <div v-if="isTyping" class="flex items-start gap-3">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <SparklesIcon class="w-5 h-5 text-primary-600" />
            </div>
            <div class="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="p-4 bg-white border-t border-gray-200">
          <!-- 추천 질문 (메시지가 있을 때) -->
          <div v-if="messages.length > 0 && suggestedQuestions.length > 0" class="mb-3 flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(question, index) in suggestedQuestions"
              :key="index"
              @click="sendQuickQuestion(question)"
              class="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
            >
              {{ question }}
            </button>
          </div>

          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="메시지를 입력하세요..."
              class="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              :disabled="isTyping"
            />
            <button
              type="submit"
              :disabled="!inputMessage.trim() || isTyping"
              class="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </form>

          <!-- 하단 안내 -->
          <p class="text-xs text-gray-500 text-center mt-2">
            AI가 생성한 답변은 참고용이며, 정확하지 않을 수 있습니다.
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from 'vue'
import {
  SparklesIcon,
  XMarkIcon,
  UserIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/outline'

interface ChatMessage {
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatbotConfig {
  name: string
  description: string
  welcomeMessage: string
  quickQuestions: string[]
  role: 'student' | 'institution' | 'university'
}

const props = defineProps<{
  config: ChatbotConfig
}>()

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref<ChatMessage[]>([])
const isTyping = ref(false)
const unreadCount = ref(0)
const messageContainer = ref<HTMLElement | null>(null)

// 설정
const chatbotConfig = computed(() => props.config)

// 추천 질문 (컨텍스트에 따라 동적으로 변경)
const suggestedQuestions = ref<string[]>([])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userMessage = inputMessage.value.trim()
  
  // 사용자 메시지 추가
  messages.value.push({
    text: userMessage,
    isUser: true,
    timestamp: new Date()
  })

  inputMessage.value = ''
  await nextTick()
  scrollToBottom()

  // AI 응답 시뮬레이션
  isTyping.value = true
  
  setTimeout(async () => {
    const aiResponse = await getAIResponse(userMessage)
    messages.value.push({
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    })
    
    isTyping.value = false
    
    // 추천 질문 업데이트
    updateSuggestedQuestions(userMessage)
    
    await nextTick()
    scrollToBottom()
    
    // 창이 닫혀있으면 알림 카운트 증가
    if (!isOpen.value) {
      unreadCount.value++
    }
  }, 1000 + Math.random() * 1000) // 1-2초 사이 랜덤 딜레이
}

const sendQuickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

const getAIResponse = async (userMessage: string): Promise<string> => {
  // TODO: 실제 AI API 호출로 교체
  // 역할별로 다른 API 엔드포인트 호출
  const role = chatbotConfig.value.role
  
  try {
    // 임시: Mock 응답
    const responses = getMockResponse(userMessage, role)
    return responses
  } catch (error) {
    return '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}

const getMockResponse = (question: string, role: string): string => {
  const lowerQ = question.toLowerCase()
  
  // 학생용 응답
  if (role === 'student') {
    if (lowerQ.includes('기관') && lowerQ.includes('찾')) {
      return '**실습 기관 찾기 방법**\n\n1. 좌측 메뉴에서 "실습 기관 찾기" 클릭\n2. 지역, 분야, 모집상태로 필터링\n3. 원하는 기관 선택 후 "매칭 요청" 클릭\n4. 대학 승인 대기\n\n💡 팁: 지역을 시/구/동으로 세분화하여 가까운 기관을 찾을 수 있습니다!'
    }
    if (lowerQ.includes('일지') || lowerQ.includes('작성')) {
      return '**실습 일지 작성 방법**\n\n1. 좌측 메뉴 "실습 일지" > "일지 작성"\n2. 날짜, 시간, 활동 내용 입력\n3. 저장 버튼 클릭\n\n⚠️ 실습 당일 또는 익일까지 작성해야 합니다!'
    }
    if (lowerQ.includes('출석')) {
      return '**출석 체크 방법**\n\n실습 시작 시: "출석 체크" 버튼 클릭\n실습 종료 시: "퇴근 체크" 버튼 클릭\n\n📍 위치 정보가 자동으로 기록되니 기관 내에서 체크해주세요.'
    }
    return '무엇을 도와드릴까요? 실습 기관 찾기, 일지 작성, 출석 체크 등에 대해 질문해주세요! 😊'
  }
  
  // 기관용 응답
  if (role === 'institution') {
    if (lowerQ.includes('학생') && lowerQ.includes('관리')) {
      return '**학생 관리 방법**\n\n1. "학생 관리" 메뉴 접속\n2. 실습생 목록 확인\n3. 출석, 일지 확인 및 피드백\n4. 평가서 작성 (실습 종료 시)\n\n✅ 학생별 진행 현황을 실시간으로 확인할 수 있습니다.'
    }
    if (lowerQ.includes('평가')) {
      return '**평가서 작성 방법**\n\n1. "학생 관리"에서 해당 학생 선택\n2. "평가서 작성" 버튼 클릭\n3. 평가 양식에 따라 작성\n4. 제출 전 검토 후 최종 제출\n\n📝 평가는 실습 종료 1주일 전부터 작성 가능합니다.'
    }
    return '기관 담당자님, 어떤 도움이 필요하신가요? 학생 관리, 평가서 작성 등에 대해 질문해주세요! 😊'
  }
  
  // 대학용 응답
  if (role === 'university') {
    if (lowerQ.includes('양식') || lowerQ.includes('업로드')) {
      return '**양식 관리 방법**\n\n1. "양식 관리" 메뉴 접속\n2. 원하는 양식 카테고리 선택\n3. "양식 업로드" 클릭\n4. 파일 선택 후 업로드\n\n📋 평가서, 확인서, 일지, 출석부, 최종보고서 양식을 관리할 수 있습니다.'
    }
    if (lowerQ.includes('승인') || lowerQ.includes('매칭')) {
      return '**매칭 승인 방법**\n\n1. "승인 관리" > "매칭 승인"\n2. 대기 중인 요청 확인\n3. 학생-기관 정보 검토\n4. 승인 또는 반려 처리\n\n✅ 승인 시 기관에 자동으로 초대 메일이 발송됩니다.'
    }
    if (lowerQ.includes('기관') && lowerQ.includes('등록')) {
      return '**협력 기관 등록 방법**\n\n1. "기관 관리" > "기관 등록"\n2. 기관 정보 입력 (기관명, 유형, 주소 등)\n3. 담당자 정보 입력\n4. 등록 완료\n\n💡 등록된 기관은 학생 기관 검색에 자동 노출됩니다.'
    }
    return '대학 담당자님, 어떤 도움이 필요하신가요? 시스템 사용법, 양식 관리, 승인 처리 등에 대해 질문해주세요! 😊'
  }
  
  return '질문을 이해하지 못했습니다. 다시 한 번 말씀해주시겠어요?'
}

const updateSuggestedQuestions = (lastQuestion: string) => {
  const role = chatbotConfig.value.role
  
  if (role === 'student') {
    suggestedQuestions.value = ['실습 시간은 어떻게 기록하나요?', '서류는 어디서 업로드하나요?']
  } else if (role === 'institution') {
    suggestedQuestions.value = ['출석 체크는 어떻게 확인하나요?', '일지 피드백은 어떻게 작성하나요?']
  } else {
    suggestedQuestions.value = ['알림은 어떻게 보내나요?', '통계는 어디서 확인하나요?']
  }
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const handleScroll = () => {
  // 스크롤 이벤트 처리 (필요시)
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = (text: string): string => {
  // 마크다운 스타일 포맷팅
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 볼드
    .replace(/\n/g, '<br>') // 줄바꿈
}

// 초기 로드 시 웰컴 메시지 후 추천 질문 설정
onMounted(() => {
  setTimeout(() => {
    if (!isOpen.value && chatbotConfig.value.role === 'student') {
      // 학생에게는 처음 방문 시 알림 표시
      unreadCount.value = 1
    }
  }, 3000)
})
</script>

<style scoped>
/* 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
