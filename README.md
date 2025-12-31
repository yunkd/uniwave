# 🎓 Uniwave Pro

> 대학 실습 관리 플랫폼 - 스마트한 실습 프로세스

## 📌 프로젝트 개요

**Uniwave Pro**는 대학 실습생, 실습 기관, 대학교 간의 복잡한 실습 관리 프로세스를 디지털화하여 효율성을 극대화하는 SaaS 플랫폼입니다.

### 해결하는 문제

- ❌ 종이 서류 기반의 비효율적인 실습 관리
- ❌ 학생-기관-대학 간 불투명한 승인 프로세스
- ❌ 서류 제본을 위한 인쇄소 방문의 번거로움
- ❌ 대학별로 다른 양식 요구로 인한 혼란

### 제공하는 솔루션

- ✅ 웹 기반 실시간 출석 체크 및 일지 작성
- ✅ 대학별 맞춤 양식 자동 적용 시스템
- ✅ 원클릭 제본 신청 및 우편 배송
- ✅ 3자 간 투명한 승인 프로세스

---

## 🚀 현재 개발 상태

### ✅ 완료된 프론트엔드 페이지

**공통 기능**
- [x] 로그인/회원가입 페이지
- [x] 역할별 레이아웃 (사이드바, 헤더)
- [x] 모바일 최적화 (전체 페이지)
- [x] 알림 시스템 UI
- [x] 공통 컴포넌트 (Button, Card, Modal, Input 등)

**학생 페이지 (16개)**
- [x] 대시보드
- [x] 기관 검색 및 매칭 요청 (대학 등록 기관 자동 노출)
- [x] 기관 매칭 현황
- [x] 출석 체크
- [x] 출석 기록 조회
- [x] 실습 일지 작성
- [x] 실습 일지 목록/상세
- [x] 서류 목록
- [x] 서류 업로드
- [x] 제본 신청
- [x] 제본 신청 내역
- [x] 공지사항 목록/상세
- [x] 최종 보고서 작성
- [x] 설정 (프로필, 이메일/SMS 알림 설정)

**기관 페이지 (12개)**
- [x] 대시보드
- [x] 실습생 목록
- [x] 실습생 상세 정보
- [x] 출석 승인 관리
- [x] 일지 승인 관리
- [x] 평가서 작성
- [x] 확인서 작성
- [x] 작성 서류 목록
- [x] 공지사항 목록/상세 (기관 대상만)
- [x] 설정 (기관 정보, 이메일/SMS 알림 설정)

**대학 페이지 (16개)**
- [x] 대시보드
- [x] 전체 통계
- [x] 학생 회원가입 승인
- [x] 학생-기관 매칭 승인 (이메일 발송 UI)
- [x] **신규 기관 승인 관리** (학생이 신청한 기관 검토 및 승인/반려)
- [x] 학생 관리 (목록/상세)
- [x] 기관 관리 (목록/상세/등록)
- [x] 공지사항 작성/수정/목록/상세 (목표 대상: ALL/STUDENT/INSTITUTION)
- [x] 템플릿 관리 (평가서/확인서/일지/출석부/최종보고서 양식)
- [x] 시스템 설정

### ⏳ 백엔드 API (미구현)

**현재 상태**: 프론트엔드는 Mock 데이터로 작동하며, 실제 백엔드 API 연동 필요

### 📋 다음 단계

1. **백엔드 API 구현**
   - Supabase Auth 연동
   - 학생/기관/대학 CRUD API
   - 파일 업로드 (Supabase Storage)

2. **외부 서비스 연동**
   - Resend API (이메일 발송)
   - PDF.co (서류 PDF 생성)

3. **프론트엔드-백엔드 연동**
   - Mock 데이터 → 실제 API 연결
   - 상태 관리 개선

---

## 🛠 기술 스택

### 백엔드

- **런타임**: Cloudflare Workers (Edge Computing)
- **프레임워크**: Hono (초경량 웹 프레임워크)
- **데이터베이스**: Supabase PostgreSQL (또는 Cloudflare D1)
- **인증**: Supabase Auth
- **파일 저장**: Supabase Storage
- **PDF 생성**: PDF.co API
- **이메일**: Resend API

### 프론트엔드

- **프레임워크**: Vue 3 (Composition API)
- **언어**: TypeScript
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **UI**: Tailwind CSS + Heroicons
- **HTTP**: Axios
- **빌드**: Vite

### 개발 도구

- **패키지 매니저**: npm
- **버전 관리**: Git
- **프로세스 관리**: PM2
- **배포**: Cloudflare Pages

---

## 📂 프로젝트 구조

```
webapp/
├── frontend/                  # Vue 3 프론트엔드
│   ├── src/
│   │   ├── views/             # 페이지 컴포넌트
│   │   │   ├── student/       # 학생 페이지 (15개)
│   │   │   ├── institution/   # 기관 페이지 (11개)
│   │   │   └── university/    # 대학 페이지 (15개)
│   │   ├── components/        # 공통 컴포넌트
│   │   │   ├── common/        # Button, Card, Modal 등
│   │   │   └── layout/        # Layout, Sidebar, Header
│   │   ├── router/            # Vue Router 설정
│   │   ├── stores/            # Pinia 스토어
│   │   ├── services/          # API 서비스
│   │   └── types/             # TypeScript 타입
│   ├── public/                # 정적 파일
│   └── package.json
├── src/                       # Hono 백엔드 (준비만 되어 있음)
│   ├── index.tsx              # 메인 애플리케이션
│   └── routes/                # API 라우트 (미구현)
├── dist/                      # 빌드 출력
├── ecosystem.config.cjs       # PM2 설정
├── wrangler.jsonc             # Cloudflare 설정
├── vite.config.ts             # Vite 빌드 설정
├── package.json               # 의존성 및 스크립트
└── README.md                  # 프로젝트 문서
```

---

## 🔧 로컬 개발 환경 설정

### 1. 필수 요구사항

- Node.js v18 이상
- npm v9 이상

### 2. 클론 및 설치

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/webapp.git
cd webapp

# 의존성 설치
npm install
```

### 3. 빌드 및 실행

```bash
# 프론트엔드 빌드
npm run build

# 개발 서버 시작 (PM2 사용)
pm2 start ecosystem.config.cjs

# 로그 확인
pm2 logs webapp --nostream

# 서비스 중지
pm2 stop webapp

# 서비스 재시작 (코드 변경 후)
fuser -k 3000/tcp 2>/dev/null || true
npm run build
pm2 restart webapp
```

### 4. 접속 확인

브라우저에서 접속:
- **메인 페이지**: http://localhost:3000
- **로그인**: http://localhost:3000/login
- **학생 대시보드**: http://localhost:3000/student/dashboard (로그인 후)
- **기관 대시보드**: http://localhost:3000/institution/dashboard (로그인 후)
- **대학 대시보드**: http://localhost:3000/university/dashboard (로그인 후)

---

## 📊 핵심 프로세스 (5단계)

### 1️⃣ 기관 매칭
학생 회원가입 → **대학 승인** → 기관 검색 및 매칭 요청 → **대학 매칭 승인 + 기관 이메일 입력** → 기관에 회원가입 초대 URL 발송 → 기관 가입 완료

### 2️⃣ 실습 진행
학생 출석 체크 / 일지 작성 → **기관 승인/반려** → 학생에게 알림

### 3️⃣ 서류 발급
**기관**이 확인서/평가서 작성 (대학 양식 기반) → 학생에게 전달

### 4️⃣ 서류 정리
학생이 제본형 PDF 생성 (표지 + 출석부 + 일지 + 확인서 + 평가서 + 보고서)

### 5️⃣ 제본 신청
학생이 제본 신청 (우편 주소, 받는 사람 정보 입력) → 대학 확인 → 제본 배송

---

## 📡 구현된 기능 (프론트엔드 UI만)

### 학생 (Student)

| 기능 | 경로 | 상태 |
|------|------|------|
| 대시보드 | `/student/dashboard` | ✅ 완료 |
| 기관 검색 | `/student/institution-search` | ✅ 완료 |
| 기관 매칭 현황 | `/student/institution-status` | ✅ 완료 |
| 출석 체크 | `/student/attendance/check` | ✅ 완료 |
| 출석 기록 | `/student/attendance/history` | ✅ 완료 |
| 실습 일지 작성 | `/student/journal/write` | ✅ 완료 |
| 실습 일지 목록 | `/student/journal/list` | ✅ 완료 |
| 실습 일지 상세 | `/student/journal/:id` | ✅ 완료 |
| 서류 목록 | `/student/documents` | ✅ 완료 |
| 서류 업로드 | `/student/documents/upload` | ✅ 완료 |
| 제본 신청 | `/student/binding` | ✅ 완료 |
| 제본 신청 내역 | `/student/binding/history` | ✅ 완료 |
| 공지사항 목록 | `/student/notices` | ✅ 완료 |
| 공지사항 상세 | `/student/notices/:id` | ✅ 완료 |
| 최종 보고서 작성 | `/student/report/write` | ✅ 완료 |
| 설정 (프로필/알림) | `/student/settings` | ✅ 완료 |

### 기관 (Institution)

| 기능 | 경로 | 상태 |
|------|------|------|
| 대시보드 | `/institution/dashboard` | ✅ 완료 |
| 실습생 목록 | `/institution/students` | ✅ 완료 |
| 실습생 상세 | `/institution/students/:id` | ✅ 완료 |
| 출석 승인 관리 | `/institution/attendance` | ✅ 완료 |
| 일지 승인 관리 | `/institution/journal-approval` | ✅ 완료 |
| 평가서 작성 | `/institution/evaluation/create` | ✅ 완료 |
| 확인서 작성 | `/institution/certificate/create` | ✅ 완료 |
| 작성 서류 목록 | `/institution/documents` | ✅ 완료 |
| 공지사항 목록 | `/institution/notices` | ✅ 완료 (기관 대상만) |
| 공지사항 상세 | `/institution/notices/:id` | ✅ 완료 |
| 설정 (기관 정보/알림) | `/institution/settings` | ✅ 완료 |

### 대학 (University)

| 기능 | 경로 | 상태 |
|------|------|------|
| 대시보드 | `/university/dashboard` | ✅ 완료 |
| 전체 통계 | `/university/statistics` | ✅ 완료 |
| 학생 회원가입 승인 | `/university/student-approval` | ✅ 완료 |
| 학생-기관 매칭 승인 | `/university/matching-approval` | ✅ 완료 (이메일 발송 UI) |
| **신규 기관 승인 관리** | `/university/institution-approval` | ✅ **완료 (NEW)** |
| 학생 목록 | `/university/students` | ✅ 완료 |
| 학생 상세 | `/university/students/:id` | ✅ 완료 |
| 기관 목록 | `/university/institutions` | ✅ 완료 |
| 기관 상세 | `/university/institutions/:id` | ✅ 완료 |
| 기관 등록 | `/university/institutions/register` | ✅ 완료 |
| 공지사항 목록 | `/university/notices` | ✅ 완료 |
| 공지사항 작성 | `/university/notices/create` | ✅ 완료 (목표 대상 선택) |
| 공지사항 수정 | `/university/notices/:id/edit` | ✅ 완료 |
| 공지사항 상세 | `/university/notices/:id` | ✅ 완료 |
| 템플릿 관리 | `/university/templates` | ✅ 완료 |
| 시스템 설정 | `/university/settings` | ✅ 완료 |

---

## 🚀 배포

### Vercel 배포 (프로덕션)

**현재 배포 상태**: ✅ https://uniwave-tau.vercel.app

#### 배포 설정

**Vercel Dashboard 설정**:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

#### 로컬 테스트

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm ci

# 로컬 빌드
npm run build

# 미리보기
npm run preview
```

#### Git Push 배포

```bash
# Git 변경사항 커밋
git add .
git commit -m "Update frontend"
git push origin main

# Vercel이 자동으로 배포 시작 (1-2분 소요)
```

### 배포 URL

- **Vercel 프로덕션**: `https://uniwave-tau.vercel.app`
- **GitHub 저장소**: `https://github.com/yunkd/uniwave`

---

## 🗄️ 데이터 구조 (현재 Mock)

### 주요 데이터 타입

- **users** - 사용자 계정 (역할: STUDENT/INSTITUTION/UNIVERSITY)
- **students** - 학생 정보
- **institutions** - 실습 기관 정보
- **attendance_logs** - 출석 기록
- **journal_logs** - 실습 일지
- **documents** - 발급 서류
- **binding_requests** - 제본 신청
- **notices** - 공지사항 (목표 대상: ALL/STUDENT/INSTITUTION)
- **templates** - 대학별 양식

---

## 🎯 다음 단계 (우선순위)

### 즉시 (Week 1)
1. ✅ 프론트엔드 완성 (전체 43개 페이지)
2. ⏳ 백엔드 API 구현 시작
3. ⏳ Supabase Auth 연동

### Week 2-3
1. ⏳ 프론트엔드-백엔드 연동
2. ⏳ Resend API 연동 (이메일 발송)
3. ⏳ 파일 업로드 기능 (Supabase Storage)

### Week 4
1. ⏳ PDF 생성 기능 (PDF.co)
2. ⏳ 전체 테스트 및 버그 수정
3. ⏳ 프로덕션 배포

---

## 🔐 보안

- ✅ **환경 변수 분리** - 민감 정보는 Git에 커밋되지 않음
- ✅ **CORS 설정** - API 엔드포인트 보호 준비
- ⏳ **JWT 인증** - Supabase Auth 활용 예정
- ⏳ **입력 검증** - 백엔드 구현 시 추가
- ⏳ **Rate Limiting** - 백엔드 구현 시 추가

---

## 📝 라이선스

MIT License

---

## 👨‍💻 개발자

**윤경대** - 예비창업자 / 사회복지 교육 SaaS

- 📧 Email: (문의는 GitHub Issues로)
- 🎯 목표: 2025년 1월 MVP 출시

---

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

---

**Last Updated**: 2025-12-31  
**Version**: 1.0.0-alpha  
**Status**: ✅ 프론트엔드 Vercel 배포 완료 / 백엔드 준비 중

## 🎉 프론트엔드 완성 현황

- **총 페이지 수**: 46개
- **학생 페이지**: 16개 ✅ (설정 페이지 추가)
- **기관 페이지**: 13개 ✅ (모집공고 학생 지원서 확인 추가)
- **대학 페이지**: 16개 ✅ (신규 기관 승인 관리 추가)
- **공통 페이지**: 2개 (로그인, 회원가입) ✅
- **모바일 최적화**: 전체 페이지 ✅
- **라우터 설정**: 완료 ✅
- **상태 관리**: Pinia 스토어 준비 완료 ✅

### 최근 업데이트 (2025-12-13)
- ✅ **대학 신규 기관 승인 관리**: 학생이 신청한 신규 기관 검토 및 승인/반려 기능 추가
  - 통계 대시보드 (전체/대기/승인/반려)
  - 필터링 (상태, 복지 분야, 검색)
  - 상세보기 모달 (기관 정보, 신청 학생 정보)
  - 반려 사유 입력 기능
  - 데스크톱 테이블 뷰 및 모바일 카드 뷰
- ✅ **학생/기관 설정 페이지**: SMS 알림 연동 기능 추가 (휴대폰 번호 등록 시 SMS 알림 수신 가능)
- ✅ **대학 양식 관리**: 출석부/최종보고서 양식 추가 (총 5개 양식)
- ✅ **기관 등록**: 학생 기관 검색에 자동 노출 안내 추가
- ✅ **모바일 최적화**: 전체 페이지 반응형 디자인 검증 완료
- ✅ **코드 정리**: 불필요한 문서 삭제 (FEATURE_CHECKLIST.md 제거)

**다음 목표**: 백엔드 API 구현 및 연동 🚀
