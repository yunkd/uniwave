# 📁 Uniwave Pro - 프로젝트 구조

> 깔끔하고 확장 가능한 모노레포 구조

## 📂 디렉토리 구조

```
uniwave/
├── frontend/                  # Vue 3 프론트엔드 (SPA)
│   ├── src/                  # 소스 코드
│   │   ├── assets/           # 정적 자원 (이미지, 폰트 등)
│   │   ├── components/       # Vue 컴포넌트
│   │   │   ├── common/       # 공통 컴포넌트 (Button, Input, Card 등)
│   │   │   ├── layout/       # 레이아웃 컴포넌트 (Header, Sidebar, Footer)
│   │   │   └── [feature]/    # 기능별 컴포넌트
│   │   ├── views/            # 페이지 컴포넌트 (라우터 연결)
│   │   │   ├── auth/         # 인증 관련 (Login, Register)
│   │   │   ├── student/      # 학생 페이지
│   │   │   ├── institution/  # 기관 페이지
│   │   │   └── university/   # 대학 페이지
│   │   ├── router/           # Vue Router 설정
│   │   ├── stores/           # Pinia 상태 관리
│   │   ├── services/         # API 서비스 레이어
│   │   ├── types/            # TypeScript 타입 정의
│   │   ├── data/             # Mock 데이터 (개발용)
│   │   ├── mocks/            # Mock 템플릿
│   │   ├── utils/            # 유틸리티 함수
│   │   └── main.ts           # 앱 진입점
│   ├── dist/                 # 빌드 결과물 (Vercel 배포)
│   ├── index.html            # HTML 템플릿
│   ├── vite.config.ts        # Vite 설정
│   ├── tailwind.config.js    # Tailwind CSS 설정
│   ├── package.json          # 프론트엔드 의존성
│   └── tsconfig.json         # TypeScript 설정
│
├── src/                      # Cloudflare Workers 백엔드 (미구현)
│   ├── index.ts              # Workers 진입점
│   ├── services/             # 백엔드 서비스
│   │   ├── email.ts          # 이메일 발송 (Resend)
│   │   └── pdf.ts            # PDF 생성 (PDF.co)
│   ├── types/                # 백엔드 타입 정의
│   │   ├── database.ts       # DB 스키마
│   │   └── env.ts            # 환경 변수
│   └── utils/                # 백엔드 유틸리티
│       └── supabase.ts       # Supabase 클라이언트
│
├── supabase/                 # Supabase 설정
│   └── migrations/           # DB 마이그레이션
│       └── 20250101000000_initial_schema.sql
│
├── docs/                     # 문서
│   └── database-design.md    # 데이터베이스 설계 문서
│
├── dist/                     # Cloudflare Pages 빌드 결과 (백엔드)
├── .wrangler/                # Wrangler 로컬 개발 환경
│
├── vercel.json               # Vercel 배포 설정 (프론트엔드)
├── wrangler.jsonc            # Cloudflare 배포 설정 (백엔드)
├── ecosystem.config.cjs      # PM2 프로세스 관리 (로컬 개발)
├── .gitignore                # Git 제외 파일
├── .vercelignore             # Vercel 제외 파일
├── package.json              # 루트 의존성 (백엔드)
├── tsconfig.json             # 루트 TypeScript 설정
├── vite.config.ts            # 루트 Vite 설정 (Cloudflare Pages)
└── README.md                 # 프로젝트 설명서
```

---

## 🎯 배포 전략

### **프론트엔드** (Vercel)
- **경로**: `frontend/`
- **빌드**: `npm run build` → `frontend/dist/`
- **URL**: https://www.uniwave.co.kr
- **자동 배포**: GitHub `main` 브랜치 푸시 시

### **백엔드** (Cloudflare Pages - 미구현)
- **경로**: `src/`
- **빌드**: `npm run build` → `dist/`
- **자동 배포**: GitHub `main` 브랜치 푸시 시

---

## 📦 주요 파일 설명

### **vercel.json** (Vercel 배포 설정)
```json
{
  "buildCommand": "cd frontend && npm ci && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
- **buildCommand**: 프론트엔드 빌드 명령어
- **outputDirectory**: 빌드 결과물 위치
- **rewrites**: SPA 라우팅 (모든 경로 → index.html)

### **wrangler.jsonc** (Cloudflare 배포 설정)
```jsonc
{
  "name": "uniwave-pro",
  "pages_build_output_dir": "./dist"
}
```
- Cloudflare Workers/Pages 배포 설정

### **ecosystem.config.cjs** (로컬 개발 서버)
```javascript
{
  apps: [{
    name: 'uniwave-pro',
    script: 'npx',
    args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000'
  }]
}
```
- PM2를 사용한 로컬 개발 서버 관리

---

## 🔧 확장 가능한 구조

### **1. 새로운 페이지 추가**
```bash
# 1. 컴포넌트 생성
frontend/src/views/[role]/[feature]/NewPage.vue

# 2. 라우터 등록
frontend/src/router/index.ts

# 3. 사이드바 메뉴 추가
frontend/src/components/layout/Sidebar.vue
```

### **2. 새로운 API 서비스 추가**
```bash
# 1. 서비스 파일 생성
frontend/src/services/newService.ts

# 2. 타입 정의
frontend/src/types/index.ts

# 3. 컴포넌트에서 사용
import { newService } from '@/services/newService'
```

### **3. 새로운 공통 컴포넌트 추가**
```bash
# 1. 컴포넌트 생성
frontend/src/components/common/NewComponent.vue

# 2. 다른 컴포넌트에서 import
import NewComponent from '@/components/common/NewComponent.vue'
```

---

## 📋 개발 워크플로우

### **로컬 개발**
```bash
# 1. 프론트엔드 개발 서버 시작
cd frontend
npm run dev  # http://localhost:5173

# 2. 프로덕션 빌드 테스트 (PM2)
npm run build
cd ..
pm2 start ecosystem.config.cjs  # http://localhost:3000
```

### **배포**
```bash
# 1. Git 커밋
git add .
git commit -m "feat: 새 기능 추가"

# 2. GitHub 푸시 (자동 배포)
git push origin main

# Vercel이 자동으로 빌드 및 배포
```

---

## 🎨 코드 스타일 가이드

### **파일명 규칙**
- **컴포넌트**: PascalCase (예: `Button.vue`, `StudentDashboard.vue`)
- **유틸리티**: camelCase (예: `formatDate.ts`, `apiClient.ts`)
- **타입**: PascalCase (예: `User.ts`, `Student.ts`)

### **디렉토리 구조 규칙**
- **기능별 분리**: `/views/student/`, `/views/institution/`
- **공통 요소**: `/components/common/`
- **레이아웃**: `/components/layout/`

---

## 🚀 확장 계획

### **단기 (1-2주)**
- [ ] 백엔드 API 구현 (Cloudflare Workers)
- [ ] Supabase 연동
- [ ] Mock 데이터 → 실제 API 전환

### **중기 (1개월)**
- [ ] 이메일 발송 (Resend API)
- [ ] PDF 생성 (PDF.co)
- [ ] 파일 업로드 (Supabase Storage)

### **장기 (3개월)**
- [ ] 실시간 알림 (Supabase Realtime)
- [ ] 분석 대시보드
- [ ] 모바일 앱 (React Native)

---

## 📝 참고 문서

- [README.md](./README.md) - 프로젝트 개요
- [docs/database-design.md](./docs/database-design.md) - DB 설계
- [frontend/README.md](./frontend/README.md) - 프론트엔드 상세 가이드

---

**마지막 업데이트**: 2024-12-16  
**담당자**: 윤경대 대표
