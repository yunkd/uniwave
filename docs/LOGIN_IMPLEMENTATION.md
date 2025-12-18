# 🔐 로그인 기능 구현 계획서

> Supabase Auth 기반 역할별 로그인 시스템

## 📋 목차

1. [기술 스택 검토](#기술-스택-검토)
2. [현재 상태 분석](#현재-상태-분석)
3. [구현 계획](#구현-계획)
4. [데이터베이스 스키마](#데이터베이스-스키마)
5. [API 엔드포인트](#api-엔드포인트)
6. [보안 고려사항](#보안-고려사항)
7. [테스트 시나리오](#테스트-시나리오)

---

## 🛠 기술 스택 검토

### **인증 시스템**
- **Supabase Auth** ✅ - PostgreSQL 기반 인증
- **JWT 토큰** ✅ - Access Token + Refresh Token
- **Row Level Security (RLS)** ✅ - 데이터 접근 제어

### **백엔드**
- **Runtime**: Cloudflare Workers (Edge Computing)
- **Framework**: Hono (초경량 웹 프레임워크)
- **Database**: Supabase PostgreSQL
- **ORM**: 직접 SQL 또는 Supabase JS Client

### **프론트엔드**
- **State**: Pinia Store (auth.ts) ✅
- **API Client**: Axios ✅
- **Routing**: Vue Router ✅

---

## 📊 현재 상태 분석

### ✅ **이미 구현된 항목**

#### **1. 프론트엔드 (100% 준비 완료)**
```typescript
// ✅ auth.ts - Pinia Store
- login(credentials) → API 호출 준비됨
- register(data) → API 호출 준비됨
- logout() → 완료
- loadUserFromStorage() → 완료
- fetchCurrentUser() → API 호출 준비됨

// ✅ api.ts - Axios Client
- Authorization 헤더 자동 추가
- 401 에러 시 자동 로그아웃
- 에러 핸들링 완료

// ✅ Login.vue - 로그인 페이지
- 역할 선택 (학생/기관/대학)
- 이메일/비밀번호 입력
- 유효성 검증
- 에러 표시
```

#### **2. 데이터베이스 스키마 (100% 정의 완료)**
```sql
-- ✅ users 테이블
- auth_id (Supabase Auth 연동)
- email
- role (STUDENT/INSTITUTION/UNIVERSITY)

-- ✅ students 테이블
- user_id 연결
- 학생 정보 (이름, 전화번호, 학번 등)
- status (PENDING/ACTIVE/REJECTED)

-- ✅ institutions 테이블
- user_id 연결
- 기관 정보 (이름, 주소, 담당자 등)

-- ✅ universities 테이블
- user_id 연결
- 대학 정보
```

### ❌ **구현 필요 항목**

#### **1. Supabase 프로젝트 설정**
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 환경 변수 설정 (.dev.vars)

#### **2. 백엔드 API (0%)**
- [ ] `/api/auth/login` - 로그인
- [ ] `/api/auth/register` - 회원가입
- [ ] `/api/auth/me` - 현재 사용자 정보
- [ ] `/api/auth/refresh` - 토큰 갱신
- [ ] `/api/auth/logout` - 로그아웃

---

## 🎯 구현 계획

### **Phase 1: Supabase 설정 (30분)**

#### **1.1 Supabase 프로젝트 생성**
```bash
# Supabase CLI 로그인
npx supabase login

# 프로젝트 링크
npx supabase link --project-ref YOUR_PROJECT_REF

# 마이그레이션 실행
npx supabase db push
```

#### **1.2 환경 변수 설정**
```bash
# .dev.vars 파일 생성
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
JWT_SECRET=your-secret-key
```

---

### **Phase 2: 백엔드 API 구현 (2시간)**

#### **2.1 Supabase 클라이언트 설정**
```typescript
// src/utils/supabase.ts (이미 준비됨)
import { createClient } from '@supabase/supabase-js'

export const getSupabaseClient = (env: any, useServiceRole = false) => {
  const key = useServiceRole 
    ? env.SUPABASE_SERVICE_ROLE_KEY 
    : env.SUPABASE_ANON_KEY
    
  return createClient(env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: false // Cloudflare Workers는 세션 저장 안됨
    }
  })
}
```

#### **2.2 로그인 API 구현**
```typescript
// src/routes/auth.ts (신규 생성 필요)
import { Hono } from 'hono'
import { getSupabaseClient } from '../utils/supabase'

const auth = new Hono<{ Bindings: Env }>()

// POST /api/auth/login
auth.post('/login', async (c) => {
  const { email, password, role } = await c.req.json()
  
  // 1. Supabase Auth 로그인
  const supabase = getSupabaseClient(c.env)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (authError) {
    return c.json({
      success: false,
      message: '이메일 또는 비밀번호가 일치하지 않습니다'
    }, 401)
  }
  
  // 2. users 테이블에서 역할 확인
  const supabaseAdmin = getSupabaseClient(c.env, true)
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email, role')
    .eq('auth_id', authData.user.id)
    .single()
  
  if (userError || !user) {
    return c.json({
      success: false,
      message: '사용자 정보를 찾을 수 없습니다'
    }, 404)
  }
  
  // 3. 역할 검증
  if (user.role !== role) {
    return c.json({
      success: false,
      message: `선택한 역할(${role})과 계정 역할(${user.role})이 일치하지 않습니다`
    }, 403)
  }
  
  // 4. 역할별 추가 정보 조회
  let profile = null
  
  switch (role) {
    case 'STUDENT':
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = student
      break
      
    case 'INSTITUTION':
      const { data: institution } = await supabaseAdmin
        .from('institutions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = institution
      break
      
    case 'UNIVERSITY':
      const { data: university } = await supabaseAdmin
        .from('universities')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = university
      break
  }
  
  // 5. 응답
  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile?.name || null,
        createdAt: authData.user.created_at
      },
      token: authData.session.access_token,
      refreshToken: authData.session.refresh_token
    }
  })
})

export default auth
```

#### **2.3 회원가입 API 구현**
```typescript
// POST /api/auth/register
auth.post('/register', async (c) => {
  const { email, password, role, ...profileData } = await c.req.json()
  
  // 1. Supabase Auth 회원가입
  const supabase = getSupabaseClient(c.env, true)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // 이메일 인증 스킵 (개발용)
  })
  
  if (authError) {
    return c.json({
      success: false,
      message: authError.message
    }, 400)
  }
  
  // 2. users 테이블에 저장
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      auth_id: authData.user.id,
      email,
      role
    })
    .select()
    .single()
  
  if (userError) {
    // 롤백: Auth 사용자 삭제
    await supabase.auth.admin.deleteUser(authData.user.id)
    
    return c.json({
      success: false,
      message: '회원가입 중 오류가 발생했습니다'
    }, 500)
  }
  
  // 3. 역할별 프로필 생성
  let profileError = null
  
  switch (role) {
    case 'STUDENT':
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          user_id: user.id,
          name: profileData.name,
          phone: profileData.phone,
          university_id: profileData.university_id,
          university_type: profileData.university_type,
          student_number: profileData.student_number,
          learner_number: profileData.learner_number,
          status: 'PENDING' // 대학 승인 대기
        })
      profileError = studentError
      break
      
    case 'INSTITUTION':
      const { error: institutionError } = await supabase
        .from('institutions')
        .insert({
          user_id: user.id,
          name: profileData.name,
          address: profileData.address,
          field: profileData.field,
          contact_name: profileData.contact_name,
          contact_email: profileData.contact_email,
          contact_phone: profileData.contact_phone
        })
      profileError = institutionError
      break
      
    case 'UNIVERSITY':
      const { error: universityError } = await supabase
        .from('universities')
        .insert({
          user_id: user.id,
          name: profileData.name,
          required_hours: profileData.required_hours || 160,
          admin_email: email
        })
      profileError = universityError
      break
  }
  
  if (profileError) {
    // 롤백
    await supabase.from('users').delete().eq('id', user.id)
    await supabase.auth.admin.deleteUser(authData.user.id)
    
    return c.json({
      success: false,
      message: '프로필 생성 중 오류가 발생했습니다'
    }, 500)
  }
  
  // 4. 응답
  return c.json({
    success: true,
    message: '회원가입이 완료되었습니다',
    data: {
      email,
      role
    }
  })
})
```

#### **2.4 현재 사용자 정보 API**
```typescript
// GET /api/auth/me
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      message: '인증 토큰이 없습니다'
    }, 401)
  }
  
  const token = authHeader.substring(7)
  
  // JWT 토큰 검증
  const supabase = getSupabaseClient(c.env)
  const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
  
  if (error || !authUser) {
    return c.json({
      success: false,
      message: '유효하지 않은 토큰입니다'
    }, 401)
  }
  
  // users 테이블에서 정보 조회
  const supabaseAdmin = getSupabaseClient(c.env, true)
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, role')
    .eq('auth_id', authUser.id)
    .single()
  
  if (!user) {
    return c.json({
      success: false,
      message: '사용자 정보를 찾을 수 없습니다'
    }, 404)
  }
  
  // 역할별 프로필 조회 (로그인과 동일)
  let profile = null
  switch (user.role) {
    case 'STUDENT':
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single()
      profile = student
      break
    // ... (INSTITUTION, UNIVERSITY도 동일)
  }
  
  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: profile?.name || null,
      createdAt: authUser.created_at
    }
  })
})
```

#### **2.5 메인 앱에 라우트 연결**
```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth'

const app = new Hono()

app.use('/api/*', cors())

// Auth 라우트 등록
app.route('/api/auth', auth)

// 기존 라우트...

export default app
```

---

### **Phase 3: 프론트엔드 연동 (30분)**

#### **3.1 Login.vue 수정**
```typescript
// handleLogin 함수 수정
const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      role: form.role
    })
    
    // 역할에 따라 리다이렉트
    const role = form.role.toLowerCase()
    router.push(`/${role}/dashboard`)
  } catch (error: any) {
    // authStore.error에 이미 메시지 설정됨
    console.error('로그인 실패:', error)
  }
}
```

#### **3.2 Router Guard 추가**
```typescript
// frontend/src/router/index.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 로그인이 필요한 페이지
  const requiresAuth = !to.path.startsWith('/login') && 
                       !to.path.startsWith('/register')
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

---

## 🗄️ 데이터베이스 스키마

### **users (사용자 계정)**
```sql
id            UUID PRIMARY KEY
auth_id       UUID (Supabase Auth 연동)
email         TEXT UNIQUE
role          ENUM (STUDENT/INSTITUTION/UNIVERSITY)
created_at    TIMESTAMPTZ
updated_at    TIMESTAMPTZ
```

### **students (학생 정보)**
```sql
id                      UUID PRIMARY KEY
user_id                 UUID (users 참조)
name                    TEXT
phone                   TEXT
university_id           UUID (universities 참조)
university_type         ENUM (CYBER/CREDIT_BANK)
student_number          TEXT (사이버대학 학번)
learner_number          TEXT (학점은행 학습자 번호)
status                  ENUM (PENDING/ACTIVE/REJECTED/SUSPENDED)
rejection_reason        TEXT
requested_institution_id UUID
matched_institution_id  UUID
required_hours          INTEGER (기본 160시간)
```

### **institutions (기관 정보)**
```sql
id              UUID PRIMARY KEY
user_id         UUID (users 참조)
name            TEXT
address         TEXT
field           TEXT (노인복지, 아동복지 등)
contact_name    TEXT
contact_email   TEXT
contact_phone   TEXT
last_login_date TIMESTAMPTZ
is_locked       BOOLEAN
```

### **universities (대학 정보)**
```sql
id             UUID PRIMARY KEY
user_id        UUID (users 참조)
name           TEXT
required_hours INTEGER (기본 160시간)
admin_email    TEXT
```

---

## 🔒 보안 고려사항

### **1. 비밀번호 보안**
- ✅ **Supabase Auth** 사용 → bcrypt 자동 해싱
- ✅ 최소 6자 이상 (프론트엔드 검증)
- ⚠️ 추후: 비밀번호 강도 체크 (대소문자, 숫자, 특수문자)

### **2. JWT 토큰**
- ✅ Access Token (1시간 유효)
- ✅ Refresh Token (30일 유효)
- ✅ HTTP-Only 쿠키 (추후 고려)

### **3. Row Level Security (RLS)**
```sql
-- 학생: 본인 데이터만 조회
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = students.user_id 
      AND users.auth_id = auth.uid()
    )
  );
```

### **4. 역할별 접근 제어**
- 로그인 시 역할 검증
- API 요청 시 역할 재확인
- Router Guard로 페이지 접근 제어

---

## 🧪 테스트 시나리오

### **시나리오 1: 학생 로그인**
```
1. 학생 역할 선택
2. 이메일: student@example.com
3. 비밀번호: 입력
4. 로그인 버튼 클릭
5. ✅ /student/dashboard로 리다이렉트
6. ✅ 학생 정보 표시 (이름, 학번, 매칭 상태)
```

### **시나리오 2: 잘못된 역할 선택**
```
1. 기관 역할 선택
2. 이메일: student@example.com (학생 계정)
3. 비밀번호: 입력
4. 로그인 버튼 클릭
5. ❌ "선택한 역할과 계정 역할이 일치하지 않습니다" 에러
```

### **시나리오 3: 토큰 만료**
```
1. 로그인 후 1시간 경과
2. API 요청 시 401 에러
3. ✅ 자동으로 /login으로 리다이렉트
4. ✅ localStorage에서 토큰 제거
```

---

## 📋 체크리스트

### **Phase 1: Supabase 설정**
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (.dev.vars)
- [ ] 마이그레이션 실행
- [ ] RLS 정책 확인

### **Phase 2: 백엔드 API**
- [ ] `src/routes/auth.ts` 생성
- [ ] POST `/api/auth/login` 구현
- [ ] POST `/api/auth/register` 구현
- [ ] GET `/api/auth/me` 구현
- [ ] `src/index.ts`에 라우트 연결

### **Phase 3: 프론트엔드 연동**
- [ ] Login.vue handleLogin 수정
- [ ] Register.vue handleRegister 수정
- [ ] Router Guard 추가
- [ ] 에러 처리 개선

### **Phase 4: 테스트**
- [ ] 학생 로그인 테스트
- [ ] 기관 로그인 테스트
- [ ] 대학 로그인 테스트
- [ ] 잘못된 역할 선택 테스트
- [ ] 토큰 만료 테스트

---

## 🚀 다음 단계

1. **Supabase 프로젝트 설정 확인**
   - 대표님이 Supabase 계정이 있으신가요?
   - 프로젝트를 새로 생성할까요?

2. **환경 변수 설정**
   - `.dev.vars` 파일에 Supabase 키 입력

3. **백엔드 API 구현**
   - `src/routes/auth.ts` 파일 생성
   - 로그인/회원가입 API 작성

4. **로컬 테스트**
   - PM2로 서비스 시작
   - Postman으로 API 테스트
   - 프론트엔드에서 실제 로그인 테스트

---

**작성일**: 2024-12-16  
**작성자**: AI Assistant  
**대상**: 윤경대 대표님
