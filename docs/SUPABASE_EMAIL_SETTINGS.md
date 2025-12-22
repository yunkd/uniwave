# =====================================================
# Supabase 이메일 인증 비활성화 설정 가이드
# =====================================================

## 문제점
현재 Supabase는 기본적으로 회원가입 시 이메일 인증을 요구합니다.
하지만 Uniwave Pro는 이메일 인증 없이 바로 로그인할 수 있어야 합니다.

## 해결 방법

### 1단계: Supabase 대시보드 접속
https://supabase.com/dashboard/project/kbnfvvamrmwqtfentvyq

### 2단계: Authentication 설정으로 이동
1. 좌측 메뉴에서 **Authentication** 클릭
2. **Settings** 탭 클릭 (또는 **Policies** 아래 **Configuration**)

### 3단계: 이메일 인증 비활성화
1. **"Email Auth"** 섹션 찾기
2. **"Enable email confirmations"** 옵션 찾기
3. **체크 해제** (비활성화)

또는:

1. **"Auth"** → **Settings** → **Email** 섹션
2. **"Confirm email"** 옵션 **OFF**로 변경

### 4단계: 저장
**"Save"** 버튼 클릭

## 추가 설정 (선택사항)

### Auto-confirm users (자동 확인)
- **"Enable auto-confirmation for new users"** 옵션을 **ON**으로 설정
- 이렇게 하면 가입 즉시 `email_confirmed_at`이 자동으로 설정됩니다

## 확인 방법

회원가입 후 Supabase 대시보드에서 확인:
1. **Authentication** → **Users** 탭
2. 새로 가입한 사용자의 `email_confirmed_at` 값 확인
   - ✅ 값이 있으면 성공
   - ❌ null이면 이메일 인증이 필요한 상태

## 참고
이 설정은 개발/테스트 환경에서 유용하지만,
프로덕션 환경에서는 보안을 위해 이메일 인증을 활성화하는 것을 권장합니다.

만약 프로덕션에서도 이메일 인증 없이 사용하려면,
이메일 인증 단계를 다른 인증 방식(SMS, 관리자 승인 등)으로 대체하는 것이 좋습니다.
