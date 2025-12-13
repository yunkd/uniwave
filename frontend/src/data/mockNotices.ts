// 공지사항 목 데이터
export interface Notice {
  id: string
  university_id: string
  title: string
  content: string
  category: 'OT' | 'SEMINAR' | 'DOCUMENT' | 'SCHEDULE' | 'ETC'
  is_pinned: boolean
  attachments?: Array<{
    name: string
    url: string
    size: number
  }>
  start_date?: string
  end_date?: string
  views: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export const mockNotices: Notice[] = [
  {
    id: '1',
    university_id: 'univ-1',
    title: '[필독] 2025년 1학기 실습 오리엔테이션 안내',
    content: `<h2>2025년 1학기 실습 오리엔테이션 안내</h2>
<p>안녕하세요. 실습 담당자입니다.</p>
<p>2025년 1학기 실습을 위한 오리엔테이션을 아래와 같이 진행합니다.</p>

<h3>📅 일시</h3>
<ul>
  <li>날짜: 2025년 3월 5일 (수)</li>
  <li>시간: 오후 2시 ~ 4시</li>
  <li>장소: 온라인 (Zoom 링크 추후 공지)</li>
</ul>

<h3>📋 안내사항</h3>
<ol>
  <li>필수 참석 대상: 2025년 1학기 실습 예정 학생 전원</li>
  <li>준비물: 학생증, 필기도구</li>
  <li>복장: 자유복</li>
</ol>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'OT',
    is_pinned: true,
    attachments: [
      {
        name: '오리엔테이션_안내문.pdf',
        url: '/files/orientation_guide.pdf',
        size: 1024000
      }
    ],
    start_date: '2025-01-10T00:00:00Z',
    end_date: '2025-03-05T23:59:59Z',
    views: 234,
    is_deleted: false,
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-10T09:00:00Z'
  },
  {
    id: '2',
    university_id: 'univ-1',
    title: '[중요] 실습 서류 제출 기한 안내',
    content: `<h2>실습 서류 제출 기한 안내</h2>
<p>실습 관련 서류 제출 기한을 다시 한번 안내드립니다.</p>

<h3>📄 제출 서류</h3>
<ul>
  <li>실습 신청서</li>
  <li>건강검진서 (3개월 이내)</li>
  <li>실습 동의서 (보호자 서명)</li>
</ul>

<h3>⏰ 제출 기한</h3>
<p><strong>2025년 2월 28일 (금) 18:00까지</strong></p>

<h3>📮 제출 방법</h3>
<p>Uniwave Pro 시스템을 통한 온라인 제출</p>`,
    category: 'DOCUMENT',
    is_pinned: true,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-02-28T23:59:59Z',
    views: 189,
    is_deleted: false,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    university_id: 'univ-1',
    title: '실습 세미나 개최 안내',
    content: `<h2>실습 세미나 개최 안내</h2>
<p>실습생들의 역량 강화를 위한 세미나를 개최합니다.</p>

<h3>🎤 주제</h3>
<p>"사회복지 현장에서의 실천 윤리"</p>

<h3>📅 일정</h3>
<ul>
  <li>날짜: 2025년 3월 15일 (금)</li>
  <li>시간: 오후 3시 ~ 5시</li>
</ul>`,
    category: 'SEMINAR',
    is_pinned: false,
    start_date: '2025-01-20T00:00:00Z',
    views: 156,
    is_deleted: false,
    created_at: '2025-01-20T14:00:00Z',
    updated_at: '2025-01-20T14:00:00Z'
  },
  {
    id: '4',
    university_id: 'univ-1',
    title: '2025년 1학기 학사 일정 안내',
    content: `<h2>2025년 1학기 학사 일정</h2>

<h3>📅 주요 일정</h3>
<ul>
  <li>3월 4일: 개강</li>
  <li>3월 11일 ~ 15일: 수강신청 변경 기간</li>
  <li>4월 22일 ~ 26일: 중간고사</li>
  <li>6월 17일 ~ 21일: 기말고사</li>
  <li>6월 24일: 종강</li>
</ul>`,
    category: 'SCHEDULE',
    is_pinned: false,
    views: 201,
    is_deleted: false,
    created_at: '2025-01-18T11:00:00Z',
    updated_at: '2025-01-18T11:00:00Z'
  },
  {
    id: '5',
    university_id: 'univ-1',
    title: '실습 출석 체크 시스템 이용 안내',
    content: `<h2>실습 출석 체크 시스템 이용 안내</h2>
<p>Uniwave Pro의 출석 체크 기능 이용 방법을 안내드립니다.</p>

<h3>📱 이용 방법</h3>
<ol>
  <li>좌측 메뉴에서 "출석 체크" 선택</li>
  <li>출근/퇴근 시간 입력</li>
  <li>"승인 요청" 버튼 클릭</li>
  <li>기관 담당자 승인 대기</li>
</ol>

<h3>⚠️ 주의사항</h3>
<ul>
  <li>당일 출석만 입력 가능합니다</li>
  <li>기관 승인 후 출석이 인정됩니다</li>
</ul>`,
    category: 'ETC',
    is_pinned: false,
    views: 145,
    is_deleted: false,
    created_at: '2025-01-12T16:00:00Z',
    updated_at: '2025-01-12T16:00:00Z'
  },
  {
    id: '6',
    university_id: 'univ-1',
    title: '실습 일지 작성 가이드라인',
    content: `<h2>실습 일지 작성 가이드라인</h2>

<h3>✍️ 작성 방법</h3>
<ol>
  <li>매일 실습 종료 후 작성</li>
  <li>실습 내용을 구체적으로 기술</li>
  <li>배운 점과 느낀 점 포함</li>
</ol>

<h3>📝 작성 항목</h3>
<ul>
  <li>실습 일자</li>
  <li>실습 시간</li>
  <li>실습 내용</li>
  <li>지도감독 내용</li>
  <li>소감 및 자기평가</li>
</ul>`,
    category: 'ETC',
    is_pinned: false,
    views: 178,
    is_deleted: false,
    created_at: '2025-01-08T13:30:00Z',
    updated_at: '2025-01-08T13:30:00Z'
  }
]

// 카테고리 레이블 및 색상
export const categoryConfig = {
  OT: { label: 'OT', color: 'bg-red-100 text-red-800' },
  SEMINAR: { label: '세미나', color: 'bg-blue-100 text-blue-800' },
  DOCUMENT: { label: '서류', color: 'bg-green-100 text-green-800' },
  SCHEDULE: { label: '일정', color: 'bg-purple-100 text-purple-800' },
  ETC: { label: '기타', color: 'bg-gray-100 text-gray-800' }
}

// 파일 크기 포맷 함수
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
