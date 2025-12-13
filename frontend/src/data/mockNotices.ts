// 공지사항 목 데이터
export interface Notice {
  id: string
  university_id: string
  title: string
  content: string
  category: 'OT' | 'SEMINAR' | 'DOCUMENT' | 'SCHEDULE' | 'ETC'
  target: 'ALL' | 'STUDENT' | 'INSTITUTION'
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
    title: '[필독] 2025년 1학기 실습생 평가서 작성 안내',
    content: `<h2>2025년 1학기 실습생 평가서 작성 안내</h2>
<p>안녕하세요. 실습 담당자입니다.</p>
<p>실습 종료 시 작성하실 실습생 평가서에 대해 안내드립니다.</p>

<h3>📅 제출 기한</h3>
<ul>
  <li>중간 평가: 실습 시작 후 4주차 (2025년 4월 5일까지)</li>
  <li>최종 평가: 실습 종료 후 1주일 이내 (2025년 6월 30일까지)</li>
</ul>

<h3>📋 평가 항목</h3>
<ol>
  <li>실습 태도 및 자세 (20점)</li>
  <li>전문 지식 및 기술 습득 (30점)</li>
  <li>의사소통 능력 (20점)</li>
  <li>문제 해결 능력 (15점)</li>
  <li>발전 가능성 (15점)</li>
</ol>

<h3>✍️ 작성 방법</h3>
<p>Uniwave Pro 시스템 → 서류 관리 → 평가서 작성</p>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'DOCUMENT',
    target: 'INSTITUTION',
    is_pinned: true,
    attachments: [
      {
        name: '평가서_작성_가이드.pdf',
        url: '/files/evaluation_guide.pdf',
        size: 856000
      }
    ],
    start_date: '2025-01-10T00:00:00Z',
    end_date: '2025-06-30T23:59:59Z',
    views: 189,
    is_deleted: false,
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-10T09:00:00Z'
  },
  {
    id: '2',
    university_id: 'univ-1',
    title: '[중요] 실습 확인서 발급 안내',
    content: `<h2>실습 확인서 발급 안내</h2>
<p>실습 확인서 발급 절차를 안내드립니다.</p>

<h3>📄 발급 시기</h3>
<ul>
  <li>실습 종료 후 즉시 발급 가능</li>
  <li>학생의 실습 일수가 최소 기준(120시간)을 충족한 경우</li>
</ul>

<h3>✍️ 작성 내용</h3>
<ul>
  <li>실습생 인적사항 (성명, 학번, 소속 대학)</li>
  <li>실습 기간 및 총 실습 시간</li>
  <li>실습 수행 내용 요약</li>
  <li>기관명 및 기관장 직인</li>
</ul>

<h3>⏰ 제출 기한</h3>
<p><strong>실습 종료 후 1주일 이내</strong></p>

<h3>📮 작성 방법</h3>
<p>Uniwave Pro 시스템 → 서류 관리 → 확인서 작성</p>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'DOCUMENT',
    target: 'INSTITUTION',
    is_pinned: true,
    start_date: '2025-01-15T00:00:00Z',
    end_date: '2025-06-30T23:59:59Z',
    views: 156,
    is_deleted: false,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    university_id: 'univ-1',
    title: '기관 담당자 세미나 개최 안내',
    content: `<h2>기관 담당자 세미나 개최 안내</h2>
<p>실습 지도의 품질 향상을 위한 세미나를 개최합니다.</p>

<h3>🎤 주제</h3>
<p>"효과적인 실습생 지도 및 평가 방법"</p>

<h3>📅 일정</h3>
<ul>
  <li>날짜: 2025년 3월 15일 (금)</li>
  <li>시간: 오후 2시 ~ 4시</li>
  <li>장소: 온라인 (Zoom 링크 추후 발송)</li>
</ul>

<h3>📌 참가 대상</h3>
<p>실습 지도 담당 기관 종사자</p>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'SEMINAR',
    target: 'INSTITUTION',
    is_pinned: false,
    start_date: '2025-01-20T00:00:00Z',
    views: 89,
    is_deleted: false,
    created_at: '2025-01-20T14:00:00Z',
    updated_at: '2025-01-20T14:00:00Z'
  },
  {
    id: '4',
    university_id: 'univ-1',
    title: '2025년 1학기 실습 일정 안내',
    content: `<h2>2025년 1학기 실습 주요 일정</h2>

<h3>📅 기관 참고 일정</h3>
<ul>
  <li>3월 4일: 실습 시작</li>
  <li>4월 1일 ~ 5일: 중간 평가 기간</li>
  <li>5월 20일 ~ 24일: 기말 평가 기간</li>
  <li>6월 20일: 실습 종료</li>
  <li>6월 27일: 평가서 및 확인서 최종 제출</li>
</ul>

<h3>⚠️ 주의사항</h3>
<p>평가서 및 확인서는 반드시 기한 내 제출해 주시기 바랍니다.</p>`,
    category: 'SCHEDULE',
    target: 'INSTITUTION',
    is_pinned: false,
    views: 134,
    is_deleted: false,
    created_at: '2025-01-18T11:00:00Z',
    updated_at: '2025-01-18T11:00:00Z'
  },
  {
    id: '5',
    university_id: 'univ-1',
    title: '실습생 출석 승인 처리 안내',
    content: `<h2>실습생 출석 승인 처리 안내</h2>
<p>Uniwave Pro 시스템을 통한 출석 승인 방법을 안내드립니다.</p>

<h3>📱 승인 처리 방법</h3>
<ol>
  <li>좌측 메뉴에서 "승인 관리" > "출석 승인" 선택</li>
  <li>승인 대기 중인 출석 목록 확인</li>
  <li>상태 버튼 클릭하여 승인 또는 반려</li>
  <li>필요시 피드백 작성</li>
</ol>

<h3>⚠️ 주의사항</h3>
<ul>
  <li>출석 승인은 당일 또는 익일까지 처리 권장</li>
  <li>반려 시 반드시 사유를 명시해 주세요</li>
</ul>`,
    category: 'ETC',
    target: 'INSTITUTION',
    is_pinned: false,
    views: 98,
    is_deleted: false,
    created_at: '2025-01-12T16:00:00Z',
    updated_at: '2025-01-12T16:00:00Z'
  },
  {
    id: '6',
    university_id: 'univ-1',
    title: '실습 일지 승인 처리 가이드',
    content: `<h2>실습 일지 승인 처리 가이드</h2>

<h3>📝 승인 기준</h3>
<ol>
  <li>실습 내용이 구체적으로 기술되었는가?</li>
  <li>실습 일자와 시간이 정확한가?</li>
  <li>학습 내용과 소감이 포함되었는가?</li>
</ol>

<h3>✍️ 승인 방법</h3>
<ul>
  <li>승인 관리 > 일지 승인 메뉴 선택</li>
  <li>상태 버튼 클릭하여 검토</li>
  <li>내용 확인 후 승인 또는 반려</li>
  <li>피드백 작성 (반려 시 필수)</li>
</ul>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'ETC',
    target: 'INSTITUTION',
    is_pinned: false,
    views: 112,
    is_deleted: false,
    created_at: '2025-01-08T13:30:00Z',
    updated_at: '2025-01-08T13:30:00Z'
  },
  {
    id: '7',
    university_id: 'univ-1',
    title: '[uc548ub0b4] 실습생 개인정보 보호 관련 안내',
    content: `<h2>실습생 개인정보 보호 관련 안내</h2>
<p>실습생의 개인정보 보호를 위한 주의사항을 안내드립니다.</p>

<h3>🔒 보호 원칙</h3>
<ul>
  <li>실습생의 개인정보는 실습 목적으로만 사용</li>
  <li>제3자에게 유출 금지</li>
  <li>실습 종료 후 적절한 파기 조치</li>
</ul>

<h3>⚠️ 주의사항</h3>
<ol>
  <li>실습생 명단 등 문서 보안 철저</li>
  <li>시스템 접속 시 ID/PW 보안 유지</li>
  <li>불필요한 개인정보 수집 금지</li>
</ol>

<h3>📞 문의</h3>
<p>실습지원센터: 02-1234-5678</p>`,
    category: 'ETC',
    target: 'ALL',
    is_pinned: false,
    views: 201,
    is_deleted: false,
    created_at: '2025-01-05T10:00:00Z',
    updated_at: '2025-01-05T10:00:00Z'
  },
  {
    id: '8',
    university_id: 'univ-1',
    title: '[ud559uc0dd] 실습 일지 작성 가이드라인',
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
    target: 'STUDENT',
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
