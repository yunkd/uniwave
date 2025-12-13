// 사용자 역할
export type Role = 'STUDENT' | 'INSTITUTION' | 'UNIVERSITY'

// 학생 상태
export type StudentStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'

// 대학 유형
export type UniversityType = 'CYBER' | 'CREDIT_BANK'

// 승인 상태
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

// 제본 상태
export type BindingStatus = 'PENDING' | 'CONFIRMED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

// 사용자 인터페이스
export interface User {
  id: string
  email: string
  role: Role
  createdAt: string
  updatedAt: string
}

// 학생 인터페이스
export interface Student extends User {
  name: string
  phone: string
  universityId: string
  universityType: UniversityType
  studentNumber?: string
  learnerNumber?: string
  status: StudentStatus
  rejectionReason?: string
  requestedInstitutionId?: string
  matchedInstitutionId?: string
  requiredHours: number
}

// 기관 인터페이스
export interface Institution extends User {
  name: string
  address: string
  field: string
  contactName: string
  contactEmail: string
  contactPhone: string
  lastLoginDate?: string
  isLocked: boolean
}

// 대학 인터페이스
export interface University extends User {
  name: string
  requiredHours: number
  adminEmail: string
}

// 출석 기록
export interface AttendanceLog {
  id: string
  studentId: string
  institutionId: string
  date: string
  checkIn: string
  checkOut: string
  hours: number
  status: ApprovalStatus
  feedback?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// 실습 일지
export interface JournalLog {
  id: string
  studentId: string
  institutionId: string
  templateId: string
  date: string
  content: Record<string, any>
  status: ApprovalStatus
  comment?: string
  feedback?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// API 응답
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  status?: number
}

// 로그인 요청
export interface LoginRequest {
  email: string
  password: string
}

// 회원가입 요청
export interface RegisterRequest {
  email: string
  password: string
  role: Role
  name?: string
  phone?: string
  universityType?: UniversityType
  studentNumber?: string
  learnerNumber?: string
  universityId?: string
}

// 대시보드 통계
export interface DashboardStats {
  totalHours?: number
  requiredHours?: number
  pendingApprovals?: number
  completedTasks?: number
  recentActivities?: Activity[]
}

// 활동 기록
export interface Activity {
  id: string
  type: 'attendance' | 'journal' | 'document' | 'approval'
  title: string
  description: string
  status: ApprovalStatus
  date: string
}
