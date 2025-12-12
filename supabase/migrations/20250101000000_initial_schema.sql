-- Uniwave Pro - Initial Database Schema
-- 대학 실습 관리 플랫폼

-- ========================================
-- ENUMS (열거형)
-- ========================================

CREATE TYPE role AS ENUM ('STUDENT', 'INSTITUTION', 'UNIVERSITY');
CREATE TYPE student_status AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
CREATE TYPE university_type AS ENUM ('CYBER', 'CREDIT_BANK');
CREATE TYPE template_type AS ENUM ('ATTENDANCE', 'JOURNAL', 'REPORT', 'INSTITUTION_EVAL', 'INSTITUTION_CERT');
CREATE TYPE approval_status AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE document_type AS ENUM ('INSTITUTION_CERT', 'INSTITUTION_EVAL', 'FINAL_REPORT', 'BINDING_PDF');
CREATE TYPE binding_status AS ENUM ('PENDING', 'CONFIRMED', 'PRINTING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE notice_category AS ENUM ('OT', 'SEMINAR', 'DOCUMENT', 'SCHEDULE', 'ETC');

-- ========================================
-- TABLES
-- ========================================

-- 사용자 (Supabase Auth와 연동)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학생
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  university_id UUID NOT NULL,
  
  university_type university_type NOT NULL,
  student_number TEXT,
  learner_number TEXT,
  
  status student_status DEFAULT 'PENDING',
  rejection_reason TEXT,
  
  requested_institution_id UUID,
  matched_institution_id UUID,
  
  required_hours INTEGER DEFAULT 160,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기관
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  field TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  last_login_date TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대학
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  required_hours INTEGER DEFAULT 160,
  admin_email TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 양식 (대학별)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  
  type template_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  
  fields JSONB,
  
  version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 출석 기록
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  
  date DATE NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  
  status approval_status DEFAULT 'PENDING',
  feedback TEXT,
  
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(student_id, date)
);

-- 실습 일지
CREATE TABLE journal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  template_id UUID NOT NULL REFERENCES templates(id),
  
  date DATE NOT NULL,
  content JSONB NOT NULL,
  
  status approval_status DEFAULT 'PENDING',
  comment TEXT,
  feedback TEXT,
  
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 서류
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  
  template_id UUID REFERENCES templates(id),
  content JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 제본 신청
CREATE TABLE binding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  address TEXT NOT NULL,
  address_detail TEXT,
  
  binding_pdf_url TEXT NOT NULL,
  
  status binding_status DEFAULT 'PENDING',
  tracking_number TEXT,
  
  notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기관 초대
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 공지사항
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category notice_category NOT NULL,
  
  is_pinned BOOLEAN DEFAULT FALSE,
  attachments JSONB,
  
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  views INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES (성능 최적화)
-- ========================================

CREATE INDEX idx_students_university ON students(university_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_matched_institution ON students(matched_institution_id);

CREATE INDEX idx_attendance_student ON attendance_logs(student_id);
CREATE INDEX idx_attendance_institution ON attendance_logs(institution_id);
CREATE INDEX idx_attendance_date ON attendance_logs(date);
CREATE INDEX idx_attendance_status ON attendance_logs(status);

CREATE INDEX idx_journal_student ON journal_logs(student_id);
CREATE INDEX idx_journal_institution ON journal_logs(institution_id);
CREATE INDEX idx_journal_status ON journal_logs(status);

CREATE INDEX idx_documents_student ON documents(student_id);
CREATE INDEX idx_documents_type ON documents(type);

CREATE INDEX idx_binding_student ON binding_requests(student_id);
CREATE INDEX idx_binding_status ON binding_requests(status);

CREATE INDEX idx_notices_university ON notices(university_id);
CREATE INDEX idx_notices_category ON notices(category);

-- ========================================
-- FOREIGN KEY CONSTRAINTS (참조 무결성)
-- ========================================

ALTER TABLE students 
  ADD CONSTRAINT fk_students_university 
  FOREIGN KEY (university_id) REFERENCES universities(id);

ALTER TABLE students 
  ADD CONSTRAINT fk_students_requested_institution 
  FOREIGN KEY (requested_institution_id) REFERENCES institutions(id);

ALTER TABLE students 
  ADD CONSTRAINT fk_students_matched_institution 
  FOREIGN KEY (matched_institution_id) REFERENCES institutions(id);

-- ========================================
-- ROW LEVEL SECURITY (RLS) 설정
-- ========================================

-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE binding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES (보안 정책)
-- ========================================

-- 사용자: 본인 데이터만 조회
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

-- 학생: 본인 데이터만 조회/수정
CREATE POLICY "Students can view own data" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = students.user_id 
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = students.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- 기관: 본인 데이터만 조회/수정
CREATE POLICY "Institutions can view own data" ON institutions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = institutions.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- 대학: 본인 대학 데이터만 조회/수정
CREATE POLICY "Universities can view own data" ON universities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = universities.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- 출석: 학생과 기관만 접근
CREATE POLICY "Students can view own attendance" ON attendance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.id = attendance_logs.student_id
      AND u.auth_id = auth.uid()
    )
  );

CREATE POLICY "Institutions can view their students attendance" ON attendance_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM institutions i
      JOIN users u ON u.id = i.user_id
      WHERE i.id = attendance_logs.institution_id
      AND u.auth_id = auth.uid()
    )
  );

-- 공지사항: 모든 학생이 조회 가능 (작성은 대학만)
CREATE POLICY "Everyone can view notices" ON notices
  FOR SELECT USING (NOT is_deleted);

-- ========================================
-- FUNCTIONS (자동 업데이트 트리거)
-- ========================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_logs_updated_at BEFORE UPDATE ON attendance_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_logs_updated_at BEFORE UPDATE ON journal_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_binding_requests_updated_at BEFORE UPDATE ON binding_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SEED DATA (테스트용 초기 데이터 - 선택적)
-- ========================================

-- 주석: 실제 운영 환경에서는 아래 INSERT 문들을 제거하거나 주석 처리하세요
-- 개발/테스트 환경에서만 사용

COMMENT ON TABLE users IS '사용자 계정 (Supabase Auth 연동)';
COMMENT ON TABLE students IS '학생 정보';
COMMENT ON TABLE institutions IS '실습 기관 정보';
COMMENT ON TABLE universities IS '대학 정보';
COMMENT ON TABLE templates IS '대학별 서류 양식';
COMMENT ON TABLE attendance_logs IS '출석 기록';
COMMENT ON TABLE journal_logs IS '실습 일지';
COMMENT ON TABLE documents IS '발급 서류 (확인서, 평가서, 제본 PDF)';
COMMENT ON TABLE binding_requests IS '제본 신청';
COMMENT ON TABLE invitations IS '기관 초대 토큰';
COMMENT ON TABLE notices IS '대학 공지사항';
