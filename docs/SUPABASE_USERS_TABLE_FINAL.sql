-- =====================================================
-- Uniwave Pro - users 테이블 구조 업데이트
-- =====================================================
-- 용도: 학생 회원가입 시 대학 승인 대기 기능 추가
-- =====================================================

-- 방법 1: 테이블 삭제 후 재생성 (개발 단계 권장)
-- ⚠️ 주의: 모든 데이터가 삭제됩니다!

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 기본 정보
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,                           -- 📱 전화번호
  
  -- 역할 및 상태
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INSTITUTION', 'UNIVERSITY')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED')),
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- 학생 전용 정보
  university_id TEXT,                   -- 🏫 소속 대학 ID
  university_type TEXT CHECK (university_type IN ('CYBER', 'CREDIT_BANK')),  -- 대학 유형
  student_number TEXT,                  -- 🎓 학번 (사이버대학)
  learner_number TEXT,                  -- 📚 학습자 등록번호 (학점은행제)
  
  -- 메타 정보
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 정책: 회원가입 시 데이터 삽입 허용
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 정책: 본인 데이터 조회 허용
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 정책: 본인 데이터 수정 허용
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_university ON users(university_id);

-- updated_at 자동 갱신 트리거
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
-- 완료!
-- =====================================================
-- 다음 단계:
-- 1. 회원가입 테스트 (status = PENDING 상태로 생성)
-- 2. 로그인 테스트 (PENDING 상태면 로그인 차단)
-- 3. 대학 관리자가 status를 ACTIVE로 변경
-- 4. 다시 로그인 테스트 (ACTIVE 상태면 로그인 성공)
-- =====================================================
