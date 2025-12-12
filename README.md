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

### ✅ 완료된 항목

- [x] **프로젝트 구조** - Hono + Cloudflare Workers 기반 백엔드
- [x] **데이터베이스 스키마** - Supabase PostgreSQL 설계 완료
- [x] **PDF 생성 서비스** - PDF.co 연동 구조 준비 (실제 호출 X)
- [x] **이메일 서비스** - Resend API 연동 구조 완료
- [x] **핵심 API** - 헬스 체크, 버전 정보

### ⏳ 개발 중

- [ ] **Supabase Auth 연동** - 로그인/회원가입
- [ ] **Vue 3 프론트엔드** - 사용자 인터페이스
- [ ] **API 라우트 구현** - 학생/기관/대학 CRUD
- [ ] **계층형 사이드바** - 모바일 반응형 메뉴

### 📋 예정

- [ ] 출석 체크 시스템
- [ ] 실습 일지 작성/승인
- [ ] 양식 관리 (대학별 맞춤)
- [ ] 제본 신청 및 배송 관리
- [ ] 공지사항 기능
- [ ] 통계 대시보드

---

## 🛠 기술 스택

### 백엔드

- **런타임**: Cloudflare Workers (Edge Computing)
- **프레임워크**: Hono (초경량 웹 프레임워크)
- **데이터베이스**: Supabase PostgreSQL
- **인증**: Supabase Auth
- **파일 저장**: Supabase Storage
- **PDF 생성**: PDF.co API (나중에 연동)
- **이메일**: Resend API

### 프론트엔드 (예정)

- **프레임워크**: Vue 3 (Composition API)
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **UI**: Tailwind CSS + DaisyUI
- **HTTP**: Axios
- **빌드**: Vite

### 개발 도구

- **언어**: TypeScript
- **패키지 매니저**: npm
- **버전 관리**: Git
- **프로세스 관리**: PM2
- **배포**: Cloudflare Pages

---

## 📂 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx              # 메인 애플리케이션
│   ├── routes/                # API 라우트
│   ├── services/              # 외부 서비스 (PDF, Email)
│   ├── types/                 # TypeScript 타입 정의
│   └── utils/                 # 유틸리티 함수
├── supabase/
│   └── migrations/            # 데이터베이스 마이그레이션
│       └── 20250101000000_initial_schema.sql
├── public/
│   └── static/                # 정적 파일
├── dist/                      # 빌드 출력 (자동 생성)
├── .dev.vars                  # 환경 변수 (개발)
├── .dev.vars.example          # 환경 변수 예시
├── wrangler.jsonc             # Cloudflare 설정
├── vite.config.ts             # Vite 빌드 설정
├── tsconfig.json              # TypeScript 설정
├── ecosystem.config.cjs       # PM2 설정
├── package.json               # 의존성 및 스크립트
└── README.md                  # 프로젝트 문서
```

---

## 🔧 로컬 개발 환경 설정

### 1. 필수 요구사항

- Node.js v18 이상
- npm v9 이상
- Supabase 계정 (무료)

### 2. 클론 및 설치

```bash
# 저장소 클론 (GitHub에 푸시한 후)
git clone https://github.com/YOUR_USERNAME/uniwave-pro.git
cd uniwave-pro

# 의존성 설치
npm install
```

### 3. 환경 변수 설정

`.dev.vars.example` 파일을 `.dev.vars`로 복사하고 실제 값 입력:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars` 파일 수정:

```env
# Supabase (https://supabase.com에서 프로젝트 생성 후)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here

# Resend (https://resend.com에서 API 키 발급)
RESEND_API_KEY=re_your_api_key

# PDF.co (나중에 연동 시)
PDFCO_API_KEY=your-pdfco-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=change-this-to-random-string
```

### 4. Supabase 데이터베이스 설정

Supabase 대시보드에서 SQL Editor를 열고, `supabase/migrations/20250101000000_initial_schema.sql` 파일의 내용을 실행합니다.

### 5. 빌드 및 실행

```bash
# 빌드
npm run build

# 개발 서버 시작 (PM2 사용)
pm2 start ecosystem.config.cjs

# 로그 확인
pm2 logs uniwave-pro --nostream

# 서비스 중지
pm2 stop uniwave-pro

# 서비스 재시작
pm2 restart uniwave-pro
```

### 6. 접속 확인

브라우저에서 접속:
- **메인 페이지**: http://localhost:3000
- **API 헬스 체크**: http://localhost:3000/api/health
- **버전 정보**: http://localhost:3000/api/version

---

## 📡 API 엔드포인트

### 현재 구현된 API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서비스 상태 확인 |
| GET | `/api/version` | 버전 정보 |

### 계획 중인 API

**인증**
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 내 정보

**학생**
- `GET /api/student/dashboard` - 대시보드
- `POST /api/student/attendance` - 출석 체크
- `GET /api/student/journal` - 일지 목록
- `POST /api/student/journal` - 일지 작성
- `POST /api/student/binding-request` - 제본 신청

**기관**
- `GET /api/institution/students` - 실습생 목록
- `PUT /api/institution/attendance/:id/approve` - 출석 승인
- `PUT /api/institution/journal/:id/approve` - 일지 승인
- `POST /api/institution/documents/evaluation` - 평가서 작성

**대학**
- `GET /api/university/students` - 학생 목록
- `PUT /api/university/students/:id/approve` - 학생 승인
- `POST /api/university/templates` - 양식 업로드
- `GET /api/university/binding-requests` - 제본 신청 관리

---

## 🗄️ 데이터베이스 구조

### 주요 테이블

- **users** - 사용자 계정 (Supabase Auth 연동)
- **students** - 학생 정보
- **institutions** - 실습 기관 정보
- **universities** - 대학 정보
- **templates** - 대학별 서류 양식
- **attendance_logs** - 출석 기록
- **journal_logs** - 실습 일지
- **documents** - 발급 서류 (확인서, 평가서, 제본 PDF)
- **binding_requests** - 제본 신청
- **invitations** - 기관 초대 토큰
- **notices** - 대학 공지사항

전체 스키마는 `supabase/migrations/20250101000000_initial_schema.sql` 파일 참조.

---

## 🚀 배포

### Cloudflare Pages 배포 (프로덕션)

1. **Cloudflare API 키 설정**

```bash
# Cloudflare 대시보드에서 API 토큰 발급 후
wrangler login
```

2. **프로젝트 생성**

```bash
wrangler pages project create uniwave-pro \
  --production-branch main \
  --compatibility-date 2024-01-01
```

3. **빌드 및 배포**

```bash
npm run build
npm run deploy
```

4. **환경 변수 설정**

Cloudflare 대시보드에서 환경 변수 설정:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY`
- `PDFCO_API_KEY` (나중에)
- `JWT_SECRET`

### 배포 URL

배포 완료 후 다음 URL에서 접근 가능:
- **Production**: `https://uniwave-pro.pages.dev`
- **Branch**: `https://main.uniwave-pro.pages.dev`

---

## 🔐 보안

- ✅ **Row Level Security (RLS)** - Supabase 데이터베이스에 적용
- ✅ **환경 변수 분리** - `.dev.vars`는 Git에 커밋되지 않음
- ✅ **CORS 설정** - API 엔드포인트 보호
- ✅ **JWT 인증** - Supabase Auth 활용
- ⏳ **입력 검증** - 추후 구현 예정
- ⏳ **Rate Limiting** - 추후 구현 예정

---

## 📊 핵심 프로세스 (5단계)

### 1️⃣ 기관 매핑
학생 가입 → 대학 승인 → 기관 선택 → 대학 승인 + 기관 이메일 입력 → 기관 가입 URL 발송

### 2️⃣ 실습 진행
학생 출석/일지 작성 → 기관 승인/반려 → 대학 양식 기반 PDF 자동 생성

### 3️⃣ 서류 발급
기관이 확인서/평가서 작성 (대학 양식 기반) → 학생에게 전달

### 4️⃣ 서류 정리
학생이 제본형 PDF 생성 (표지+출석부+일지+확인서+평가서+보고서)

### 5️⃣ 제본 신청
학생이 제본 신청 (우편 주소, 받는 사람 정보 입력) → 관리자 확인 → 제본 배송

---

## 🎯 다음 단계 (우선순위)

### Week 1 (현재)
- [x] 프로젝트 구조 생성
- [x] Supabase 스키마 작성
- [x] 백엔드 뼈대 구축
- [ ] Supabase Auth 연동
- [ ] 기본 API 구현

### Week 2
- [ ] Vue 3 프론트엔드 설정
- [ ] 로그인/회원가입 페이지
- [ ] 계층형 사이드바
- [ ] 출석/일지 시스템

### Week 3
- [ ] 양식 관리 시스템
- [ ] 서류 발급 기능
- [ ] 제본 신청 기능
- [ ] 배포 및 테스트

---

## 📝 라이선스

MIT License

---

## 👨‍💻 개발자

**윤경대** - 예비창업자 / 사회복지 교육 SaaS

---

## 🙏 도움이 필요한 부분

현재 개발 중인 MVP이며, 다음 항목에 대한 설정이 필요합니다:

1. **Supabase 프로젝트 생성**
   - https://supabase.com에서 무료 계정 생성
   - 새 프로젝트 생성
   - API 키 복사 후 `.dev.vars`에 입력
   - SQL Editor에서 스키마 실행

2. **Resend API 키 발급**
   - https://resend.com에서 계정 생성
   - API 키 발급
   - `.dev.vars`에 입력

3. **PDF.co 연동 (나중에)**
   - 현재는 준비만 되어 있음
   - 실제 연동은 추후 진행

---

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

---

**Last Updated**: 2025-01-12  
**Version**: 1.0.0 (MVP 개발 중)  
**Status**: 🚧 Under Development
