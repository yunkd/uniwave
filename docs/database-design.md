# 데이터베이스 설계 - 기관 관리 시스템

## 개요
- **전국 공유 기관 DB**: 모든 대학이 검색 가능
- **대학별 협력 관계**: 각 대학이 개별 관리
- **매칭 신청**: 협력 기관만 가능

## 테이블 구조

### 1. institutions (전국 공유 기관 DB)
```sql
CREATE TABLE institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                    -- 기관명
  type TEXT NOT NULL,                    -- 기관 유형 (사회복지관, 노인복지시설 등)
  
  -- 주소 정보 (검색용)
  city TEXT NOT NULL,                    -- 시 (서울시, 경기도 등)
  district TEXT,                         -- 구 (강남구, 수원시 등)
  dong TEXT,                            -- 동
  address TEXT NOT NULL,                -- 전체 주소
  
  -- 분야 정보
  field TEXT NOT NULL,                  -- 분야 (노인복지, 아동복지 등)
  
  -- 연락처 정보
  contact_name TEXT,                    -- 담당자명
  contact_phone TEXT,                   -- 연락처
  contact_email TEXT,                   -- 이메일
  
  -- 기관 설명
  description TEXT,                     -- 기관 소개
  website TEXT,                         -- 홈페이지
  
  -- 메타 정보
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,    -- 검증된 기관 여부
  
  -- 전국 DB이므로 대학 ID 없음
);

CREATE INDEX idx_institutions_location ON institutions(city, district, dong);
CREATE INDEX idx_institutions_field ON institutions(field);
CREATE INDEX idx_institutions_name ON institutions(name);
```

### 2. university_institution_partnerships (대학-기관 협력 관계)
```sql
CREATE TABLE university_institution_partnerships (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL,          -- 대학 ID
  institution_id TEXT NOT NULL REFERENCES institutions(id),
  
  -- 협력 상태
  status TEXT CHECK(status IN ('ACTIVE', 'INACTIVE', 'PENDING')) DEFAULT 'ACTIVE',
  
  -- 모집 정보 (대학별로 관리)
  is_recruiting BOOLEAN DEFAULT TRUE,   -- 모집 중 여부
  capacity INTEGER,                     -- 수용 인원 (해당 대학 학생)
  current_students INTEGER DEFAULT 0,   -- 현재 배정된 학생 수
  
  -- 협력 기간
  partnership_start_date DATE,          -- 협력 시작일
  partnership_end_date DATE,            -- 협력 종료일
  
  -- 기관 코드 (매칭 신청용)
  matching_code TEXT UNIQUE,            -- 대학별 고유 코드 (예: A대-서울사회-2025)
  
  -- 메모
  memo TEXT,                           -- 대학 담당자 메모
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(university_id, institution_id)
);

CREATE INDEX idx_partnerships_university ON university_institution_partnerships(university_id);
CREATE INDEX idx_partnerships_code ON university_institution_partnerships(matching_code);
```

### 3. student_institution_matchings (학생-기관 매칭)
```sql
CREATE TABLE student_institution_matchings (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  partnership_id TEXT NOT NULL REFERENCES university_institution_partnerships(id),
  
  -- 매칭 상태
  status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')) DEFAULT 'PENDING',
  
  -- 신청 정보
  matching_code TEXT NOT NULL,          -- 학생이 입력한 기관 코드
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 승인 정보
  approved_by TEXT,                    -- 승인한 대학 담당자 ID
  approved_at TIMESTAMP,
  
  -- 반려 정보
  rejected_reason TEXT,
  rejected_at TIMESTAMP,
  
  -- 실습 기간
  internship_start_date DATE,
  internship_end_date DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matchings_student ON student_institution_matchings(student_id);
CREATE INDEX idx_matchings_partnership ON student_institution_matchings(partnership_id);
```

## 데이터 흐름

### 학생 - 기관 검색
1. 학생이 전국 institutions 테이블 검색
2. 모든 대학의 기관 정보 조회 가능
3. 연락처, 주소 등 확인 가능

### 학생 - 매칭 신청
1. 학생이 기관과 사전 협의
2. 기관이 "매칭 코드" 제공 (예: SKKU-SWC-2025-001)
3. 학생이 매칭 신청 시 코드 입력
4. 시스템이 코드 검증:
   - university_institution_partnerships 테이블에서 해당 대학의 협력 기관인지 확인
   - 모집 중인지 확인 (is_recruiting = TRUE)
   - 정원 초과 여부 확인 (current_students < capacity)
5. 검증 통과 시 매칭 요청 생성 (status='PENDING')

### 대학 - 협력 기관 관리
1. 전국 institutions DB에서 기관 검색
2. 협력 맺기 버튼 클릭
3. university_institution_partnerships 생성
4. 매칭 코드 자동 생성 또는 수동 입력
5. 모집 인원, 협력 기간 설정

### 대학 - 매칭 승인
1. student_institution_matchings에서 PENDING 목록 조회
2. 학생-기관 정보 검토
3. 승인 또는 반려
4. 승인 시 current_students + 1

## 장점

### 1. 데이터 중복 최소화
- 기관 정보는 institutions 테이블에만 저장
- 대학별 협력 관계는 partnership 테이블로 관리

### 2. 확장성
- 새 대학 추가 시 기존 기관 DB 활용
- 전국 기관 정보 공유로 선택지 확대

### 3. 유연성
- 대학마다 다른 모집 인원 설정 가능
- 대학마다 다른 협력 기간 설정 가능
- 같은 기관이라도 대학별로 독립적 관리

### 4. 보안
- 매칭 코드로 무분별한 신청 방지
- 대학별 협력 기관만 매칭 가능

## 예시 데이터

### institutions
```
id: inst-001
name: 서울사회복지관
city: 서울시
district: 강남구
field: 노인복지
contact_phone: 02-1234-5678
```

### university_institution_partnerships
```
A대학-서울사회복지관:
  matching_code: "A-SWC-2025-001"
  capacity: 5
  current_students: 2
  is_recruiting: TRUE

B대학-서울사회복지관:
  matching_code: "B-SWC-2025-001"  
  capacity: 3
  current_students: 3
  is_recruiting: FALSE (마감)
```

### 결과
- A대학 학생: "A-SWC-2025-001" 코드로 신청 가능 (3명 더 가능)
- B대학 학생: 정원 마감으로 신청 불가
- 모든 학생: 서울사회복지관 정보는 검색으로 확인 가능
