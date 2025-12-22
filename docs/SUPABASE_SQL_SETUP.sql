-- =====================================================
-- Uniwave Pro - Supabase 데이터베이스 초기 설정
-- =====================================================

-- 1️⃣ users 테이블 생성
-- Supabase Auth와 연동되는 사용자 정보 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTITUTION', 'UNIVERSITY')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2️⃣ RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3️⃣ RLS 정책 생성
-- 정책 1: 모든 사용자는 본인 데이터를 조회할 수 있음
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 정책 2: 모든 사용자는 본인 데이터를 수정할 수 있음
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 정책 3: 회원가입 시 데이터 삽입 허용 (인증된 사용자)
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4️⃣ 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 5️⃣ updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 테이블 생성 완료!
-- =====================================================
-- 다음 단계:
-- 1. https://www.uniwave.co.kr/register 에서 회원가입 테스트
-- 2. Supabase Dashboard > Authentication > Users에서 사용자 확인
-- 3. Supabase Dashboard > Table Editor > users에서 데이터 확인
-- =====================================================
