# 🔧 Supabase 연동 가이드

> Supabase URL 및 API 키 설정 방법

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [API 키 확인하기](#2-api-키-확인하기)
3. [로컬 개발 환경 설정](#3-로컬-개발-환경-설정)
4. [Cloudflare Workers 배포 설정](#4-cloudflare-workers-배포-설정)
5. [프론트엔드 환경 변수](#5-프론트엔드-환경-변수)
6. [연동 테스트](#6-연동-테스트)

---

## 1. Supabase 프로젝트 생성

### **1.1 Supabase 계정 가입**

1. https://supabase.com 접속
2. **"Start your project"** 클릭
3. GitHub 계정으로 로그인 (추천) 또는 이메일로 가입

### **1.2 새 프로젝트 생성**

1. **"New Project"** 버튼 클릭
2. 프로젝트 정보 입력:
   ```
   Name: uniwave-pro
   Database Password: [강력한 비밀번호 생성] (저장 필수!)
   Region: Northeast Asia (Seoul)
   Pricing Plan: Free (개발용)
   ```
3. **"Create new project"** 클릭
4. 약 2분 대기 (프로젝트 생성 중)

---

## 2. API 키 확인하기

### **2.1 Project Settings 접속**

1. 좌측 사이드바 **⚙️ Settings** 클릭
2. **API** 메뉴 클릭

### **2.2 필요한 키 3가지**

화면에서 다음 정보를 복사하세요:

#### **① Project URL**
```
예시: https://abcdefghijk.supabase.co
```
→ `SUPABASE_URL`에 사용

#### **② anon public (공개 키)**
```
예시: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```
→ `SUPABASE_ANON_KEY`에 사용
- ✅ **프론트엔드**에서 사용 (공개 가능)
- ✅ Row Level Security (RLS) 적용됨

#### **③ service_role (비밀 키)**
```
예시: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
```
→ `SUPABASE_SERVICE_KEY`에 사용
- ⚠️ **백엔드**에서만 사용 (절대 공개 금지!)
- ⚠️ RLS 무시하고 모든 데이터 접근 가능

---

## 3. 로컬 개발 환경 설정

### **3.1 `.dev.vars` 파일 생성**

**Cloudflare Workers 로컬 개발용**

```bash
# 프로젝트 루트에서 실행
cd /home/user/webapp
cp .dev.vars.example .dev.vars
```

### **3.2 `.dev.vars` 파일 편집**

```bash
# Supabase (필수)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend (이메일 - 나중에)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# PDF.co (PDF 생성 - 나중에)
PDFCO_API_KEY=your-pdfco-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret (백업용)
JWT_SECRET=uniwave-pro-secret-key-2025
```

**⚠️ 중요**: `.dev.vars` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다!

### **3.3 `.gitignore` 확인**

```bash
cat .gitignore | grep dev.vars
```

**출력 확인**:
```
.dev.vars
```
→ ✅ 이미 `.gitignore`에 포함되어 있음 (안전)

---

## 4. Cloudflare Workers 배포 설정

### **4.1 Cloudflare Dashboard에서 설정**

Cloudflare Workers 프로덕션 배포 시 환경 변수 설정:

1. https://dash.cloudflare.com 로그인
2. **Workers & Pages** 메뉴
3. **uniwave-pro** 프로젝트 선택
4. **Settings → Variables** 클릭
5. **Environment Variables** 추가:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_KEY=eyJhbGciOi...
```

**또는 wrangler CLI로 설정**:

```bash
# Secret으로 추가 (암호화 저장)
npx wrangler secret put SUPABASE_URL
# 입력 프롬프트에서 값 입력

npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_KEY
```

### **4.2 `wrangler.jsonc` 확인**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "uniwave-pro",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": ["nodejs_compat"],
  
  // 환경 변수는 .dev.vars 파일이나 Cloudflare Dashboard에서 설정
  // 이 파일에는 키를 넣지 않음!
}
```

---

## 5. 프론트엔드 환경 변수

### **5.1 Vite 환경 변수 파일 생성**

**프론트엔드에서 Supabase 직접 호출 시 필요** (선택사항)

```bash
cd /home/user/webapp/frontend
touch .env.local
```

**`.env.local` 내용**:
```bash
# Supabase (프론트엔드용)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# API Base URL
VITE_API_URL=http://localhost:3000/api
```

### **5.2 `.gitignore` 확인**

```bash
cd /home/user/webapp/frontend
cat .gitignore | grep env
```

**출력**:
```
.env
.env.*
```
→ ✅ `.env.local` 파일은 Git에 커밋되지 않음

---

## 6. 연동 테스트

### **6.1 Supabase 연결 테스트 코드**

**테스트 파일 생성**:
```bash
# frontend/src/test-supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key (처음 10자):', supabaseKey?.substring(0, 10))

const supabase = createClient(supabaseUrl, supabaseKey)

// 연결 테스트
async function testConnection() {
  const { data, error } = await supabase.from('users').select('count')
  
  if (error) {
    console.error('❌ 연결 실패:', error.message)
  } else {
    console.log('✅ Supabase 연결 성공!')
  }
}

testConnection()
```

### **6.2 백엔드 연결 테스트**

```bash
# 로컬 서버 시작
cd /home/user/webapp
npm run build
pm2 start ecosystem.config.cjs

# API 테스트
curl http://localhost:3000/api/health
```

**예상 응답**:
```json
{
  "success": true,
  "message": "Server is running",
  "supabase": "connected"
}
```

---

## 📂 파일 위치 요약

### **백엔드 (Cloudflare Workers)**

```
/home/user/webapp/
├── .dev.vars                    # 로컬 개발용 환경 변수 (Git 제외)
├── .dev.vars.example            # 환경 변수 예시 (Git 포함)
├── wrangler.jsonc               # Cloudflare 설정
└── src/
    ├── index.ts                 # 메인 앱
    └── utils/
        └── supabase.ts          # Supabase 클라이언트
```

**환경 변수 사용 예시**:
```typescript
// src/index.ts
export default {
  async fetch(request, env) {
    const supabaseUrl = env.SUPABASE_URL
    const supabaseKey = env.SUPABASE_ANON_KEY
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey)
  }
}
```

### **프론트엔드 (Vue/Vite)**

```
/home/user/webapp/frontend/
├── .env.local                   # 로컬 개발용 (Git 제외)
├── .env.production              # 프로덕션용 (선택) (Git 제외)
└── src/
    ├── services/
    │   └── api.ts               # API 클라이언트
    └── main.ts                  # 앱 진입점
```

**환경 변수 사용 예시**:
```typescript
// frontend/src/services/api.ts
const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
```

---

## 🔒 보안 체크리스트

### **✅ 안전한 방법**
- [x] `.dev.vars` 파일을 `.gitignore`에 추가
- [x] `.env.local` 파일을 `.gitignore`에 추가
- [x] `service_role` 키는 백엔드에서만 사용
- [x] `anon` 키는 프론트엔드에서 사용 가능
- [x] Cloudflare Dashboard에서 Secret으로 저장

### **❌ 위험한 방법 (하지 마세요!)**
- [ ] `.dev.vars` 파일을 Git에 커밋
- [ ] `service_role` 키를 프론트엔드에 노출
- [ ] 환경 변수를 코드에 하드코딩
- [ ] GitHub에 키를 공개 커밋

---

## 🚨 키가 노출되었을 때 대처 방법

### **1. 즉시 조치**

1. **Supabase Dashboard → Settings → API**
2. **"Reset service_role key"** 클릭
3. 새 키로 모든 환경 변수 업데이트

### **2. Git 히스토리에서 제거**

```bash
# 키가 포함된 커밋 찾기
git log --all -- .dev.vars

# Git 히스토리에서 완전 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .dev.vars" \
  --prune-empty --tag-name-filter cat -- --all

# 강제 푸시 (주의!)
git push origin --force --all
```

---

## ✅ 최종 체크리스트

### **Supabase 설정**
- [ ] Supabase 계정 생성 완료
- [ ] 프로젝트 생성 완료 (uniwave-pro)
- [ ] Project URL 복사
- [ ] anon public 키 복사
- [ ] service_role 키 복사

### **로컬 환경 설정**
- [ ] `.dev.vars` 파일 생성
- [ ] 3개 키 입력 완료
- [ ] `.gitignore` 확인 (`.dev.vars` 포함됨)

### **배포 환경 설정**
- [ ] Cloudflare Dashboard에 환경 변수 등록
- [ ] 또는 `wrangler secret put` 실행

### **테스트**
- [ ] 로컬 서버 시작
- [ ] Supabase 연결 테스트
- [ ] API 엔드포인트 테스트

---

## 📞 문제 해결

### **"Invalid API key" 에러**
→ 키를 정확히 복사했는지 확인 (공백 포함 여부)

### **"CORS policy" 에러**
→ Supabase Dashboard → Authentication → Site URL에 프론트엔드 URL 추가

### **"RLS policy violation" 에러**
→ 백엔드에서 `service_role` 키 사용 확인

---

**작성일**: 2024-12-16  
**대상**: 윤경대 대표님  
**다음 단계**: 실제 로그인 API 구현
