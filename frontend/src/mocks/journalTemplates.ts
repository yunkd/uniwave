// 실습 일지 양식 Mock 데이터
// 실제로는 대학이 업로드한 templates 테이블에서 가져옴

export interface TemplateField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'select' | 'checkbox'
  required: boolean
  placeholder?: string
  options?: string[] // select용
  maxLength?: number
  rows?: number // textarea용
}

export interface JournalTemplate {
  id: string
  university_id: string
  type: 'JOURNAL'
  file_name: string
  file_url: string
  fields: TemplateField[]
  version: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Mock 일지 양식
export const mockJournalTemplate: JournalTemplate = {
  id: 'template-001',
  university_id: 'university-001',
  type: 'JOURNAL',
  file_name: '실습일지_양식_v1.0.pdf',
  file_url: 'https://example.com/templates/journal_v1.pdf',
  version: 'v1.0',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  fields: [
    {
      name: 'practiceDate',
      label: '실습 날짜',
      type: 'date',
      required: true
    },
    {
      name: 'practiceTime',
      label: '실습 시간',
      type: 'text',
      required: true,
      placeholder: '예: 09:00 ~ 18:00'
    },
    {
      name: 'practiceArea',
      label: '실습 영역',
      type: 'select',
      required: true,
      options: [
        '사회복지실천',
        '사례관리',
        '프로그램 기획 및 운영',
        '행정 업무',
        '상담 및 면접',
        '기타'
      ]
    },
    {
      name: 'practiceContent',
      label: '실습 내용',
      type: 'textarea',
      required: true,
      placeholder: '오늘 수행한 실습 내용을 구체적으로 작성하세요 (최소 200자)',
      maxLength: 5000,
      rows: 8
    },
    {
      name: 'learningPoints',
      label: '배운 점 및 느낀 점',
      type: 'textarea',
      required: true,
      placeholder: '실습을 통해 배운 점, 느낀 점, 어려웠던 점 등을 작성하세요 (최소 100자)',
      maxLength: 3000,
      rows: 6
    },
    {
      name: 'questions',
      label: '질문사항 (선택)',
      type: 'textarea',
      required: false,
      placeholder: '슈퍼바이저에게 질문하고 싶은 내용이 있다면 작성하세요',
      maxLength: 1000,
      rows: 4
    },
    {
      name: 'supervisorGuidance',
      label: '슈퍼비전 내용 (기관 작성)',
      type: 'textarea',
      required: false,
      placeholder: '슈퍼바이저가 작성합니다',
      maxLength: 2000,
      rows: 4
    }
  ]
}

// Mock 작성된 일지 데이터
export interface JournalLog {
  id: string
  student_id: string
  institution_id: string
  template_id: string
  date: string
  content: Record<string, any>
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  comment?: string
  feedback?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export const mockJournalLogs: JournalLog[] = [
  {
    id: 'journal-001',
    student_id: 'student-001',
    institution_id: 'institution-001',
    template_id: 'template-001',
    date: '2025-01-10',
    content: {
      practiceDate: '2025-01-10',
      practiceTime: '09:00 ~ 18:00',
      practiceArea: '사회복지실천',
      practiceContent: '오늘은 노인복지관에서 어르신들과의 첫 만남이 있었습니다. 아침 9시에 출근하여 담당 슈퍼바이저님으로부터 기관 오리엔테이션을 받았습니다. 기관의 설립 목적, 주요 사업, 조직 구조 등에 대해 배웠으며, 특히 어르신들을 대할 때의 기본 에티켓과 주의사항에 대해 상세히 안내받았습니다. 오후에는 여가 프로그램실에서 진행되는 "건강 체조 교실"에 참관하였고, 어르신들과 간단한 인사를 나누며 라포를 형성하는 시간을 가졌습니다.',
      learningPoints: '사회복지 현장에서의 전문성이 단순히 이론적 지식만이 아니라, 대상자에 대한 진정성 있는 태도와 소통 능력에서 나온다는 것을 체감했습니다. 특히 어르신들과의 첫 만남에서 눈높이를 맞추고, 경청하는 자세의 중요성을 배웠습니다.',
      questions: '어르신들과의 라포 형성을 위한 효과적인 대화 기법이 있을까요?'
    },
    status: 'APPROVED',
    feedback: '첫 실습 일지 잘 작성하셨습니다. 어르신들과의 소통에서 가장 중요한 것은 진심어린 경청입니다.',
    approved_at: '2025-01-11T10:00:00Z',
    created_at: '2025-01-10T19:00:00Z',
    updated_at: '2025-01-11T10:00:00Z'
  },
  {
    id: 'journal-002',
    student_id: 'student-001',
    institution_id: 'institution-001',
    template_id: 'template-001',
    date: '2025-01-11',
    content: {
      practiceDate: '2025-01-11',
      practiceTime: '09:00 ~ 17:00',
      practiceArea: '사례관리',
      practiceContent: '오늘은 사례관리 업무를 참관했습니다. 슈퍼바이저님과 함께 신규 대상자 초기 상담에 동석하여 인테이크 과정을 배웠습니다.',
      learningPoints: '사례관리의 전 과정을 이해하게 되었고, 초기 상담의 중요성을 깨달았습니다.'
    },
    status: 'PENDING',
    created_at: '2025-01-11T18:30:00Z',
    updated_at: '2025-01-11T18:30:00Z'
  },
  {
    id: 'journal-003',
    student_id: 'student-001',
    institution_id: 'institution-001',
    template_id: 'template-001',
    date: '2025-01-12',
    content: {
      practiceDate: '2025-01-12',
      practiceTime: '09:00 ~ 18:00',
      practiceArea: '프로그램 기획 및 운영',
      practiceContent: '부족한 내용입니다.',
      learningPoints: '좀 더 구체적으로 작성해주세요.'
    },
    status: 'REJECTED',
    feedback: '실습 내용이 너무 간략합니다. 구체적으로 어떤 프로그램을 참관했는지, 무엇을 배웠는지 상세히 작성해주세요.',
    created_at: '2025-01-12T19:00:00Z',
    updated_at: '2025-01-13T09:00:00Z'
  },
  {
    id: 'journal-004',
    student_id: 'student-001',
    institution_id: 'institution-001',
    template_id: 'template-001',
    date: '2025-01-13',
    content: {
      practiceDate: '2025-01-13',
      practiceTime: '09:00 ~ ',
      practiceArea: '상담 및 면접',
      practiceContent: '임시저장 중...',
      learningPoints: ''
    },
    status: 'DRAFT',
    created_at: '2025-01-13T15:00:00Z',
    updated_at: '2025-01-13T15:30:00Z'
  }
]
