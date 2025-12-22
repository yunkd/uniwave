# =====================================================
# Supabase 테이블 수정 가이드
# =====================================================

## 문제 상황
Supabase에서 테이블이 이미 생성되어 있어 구조 변경이 필요한 경우

## 해결 방법 3가지

### 방법 1: 테이블 삭제 후 재생성 (개발 단계 권장)
⚠️ **주의**: 모든 데이터가 삭제됩니다!

```sql
-- 1. 테이블 삭제
DROP TABLE IF EXISTS users CASCADE;

-- 2. 새로운 구조로 재생성
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,                           -- 전화번호 추가
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTITUTION', 'UNIVERSITY')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED')),
  email_verified BOOLEAN DEFAULT FALSE,
  university_id TEXT,                   -- 소속 대학
  university_type TEXT,                 -- 대학 유형 (CYBER/CREDIT_BANK)
  student_number TEXT,                  -- 학번 (사이버대학)
  learner_number TEXT,                  -- 학습자 등록번호 (학점은행제)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 방법 2: 컬럼 추가 (데이터 유지)
✅ 기존 데이터를 유지하면서 새 컬럼만 추가

```sql
-- 전화번호 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- 대학 정보 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS learner_number TEXT;

-- status 기본값 변경
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'PENDING';

-- status CHECK 제약조건 수정 (기존 제약조건 삭제 후 재생성)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
  CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'));
```

### 방법 3: 마이그레이션 SQL (프로덕션 권장)
✅ 안전하게 단계별로 변경

```sql
-- Step 1: 백업 테이블 생성
CREATE TABLE users_backup AS SELECT * FROM users;

-- Step 2: 새 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS learner_number TEXT;

-- Step 3: 기존 데이터 업데이트 (필요 시)
UPDATE users SET status = 'ACTIVE' WHERE status = 'ACTIVE';

-- Step 4: 제약조건 수정
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
  CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'));

-- Step 5: 기본값 변경
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'PENDING';
```

## 실행 방법

### Supabase SQL Editor에서:
1. **SQL Editor** 메뉴 클릭
2. 위의 SQL 복사 & 붙여넣기
3. **Run** 버튼 클릭

### 테이블 확인:
1. **Table Editor** 메뉴 클릭
2. `users` 테이블 선택
3. 컬럼 구조 확인

## 권장 사항

### 개발/테스트 단계:
→ **방법 1 (테이블 삭제 후 재생성)** 사용
- 데이터가 없거나 테스트 데이터만 있는 경우
- 구조 변경이 크고 복잡한 경우

### 프로덕션 또는 데이터가 있는 경우:
→ **방법 2 (컬럼 추가)** 또는 **방법 3 (마이그레이션)** 사용
- 기존 데이터를 유지해야 하는 경우
- 안전하게 변경하고 싶은 경우

## 문제 해결

### "relation already exists" 에러
```sql
-- DROP TABLE로 먼저 삭제
DROP TABLE IF EXISTS users CASCADE;
-- 그 후 CREATE TABLE 실행
```

### "constraint already exists" 에러
```sql
-- 기존 제약조건 먼저 삭제
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
-- 그 후 새 제약조건 추가
```

### RLS 정책 오류
```sql
-- 모든 정책 삭제
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- 정책 재생성
-- (위의 SQL 참조)
```
