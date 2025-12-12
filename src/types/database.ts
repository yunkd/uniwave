// 데이터베이스 타입 정의 (Supabase 스키마 기반)

export type Role = 'STUDENT' | 'INSTITUTION' | 'UNIVERSITY'
export type StudentStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'
export type UniversityType = 'CYBER' | 'CREDIT_BANK'
export type TemplateType = 'ATTENDANCE' | 'JOURNAL' | 'REPORT' | 'INSTITUTION_EVAL' | 'INSTITUTION_CERT'
export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
export type DocumentType = 'INSTITUTION_CERT' | 'INSTITUTION_EVAL' | 'FINAL_REPORT' | 'BINDING_PDF'
export type BindingStatus = 'PENDING' | 'CONFIRMED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type NoticeCategory = 'OT' | 'SEMINAR' | 'DOCUMENT' | 'SCHEDULE' | 'ETC'

export interface User {
  id: string
  auth_id: string
  email: string
  role: Role
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  name: string
  phone: string
  university_id: string
  university_type: UniversityType
  student_number?: string
  learner_number?: string
  status: StudentStatus
  rejection_reason?: string
  requested_institution_id?: string
  matched_institution_id?: string
  required_hours: number
  created_at: string
  updated_at: string
}

export interface Institution {
  id: string
  user_id: string
  name: string
  address: string
  field: string
  contact_name: string
  contact_email: string
  contact_phone: string
  last_login_date?: string
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface University {
  id: string
  user_id: string
  name: string
  required_hours: number
  admin_email: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  university_id: string
  type: TemplateType
  file_name: string
  file_url: string
  fields?: TemplateField[]
  version: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TemplateField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'rating'
  required: boolean
  placeholder?: string
}

export interface AttendanceLog {
  id: string
  student_id: string
  institution_id: string
  date: string
  check_in: string
  check_out: string
  hours: number
  status: ApprovalStatus
  feedback?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface JournalLog {
  id: string
  student_id: string
  institution_id: string
  template_id: string
  date: string
  content: Record<string, any>
  status: ApprovalStatus
  comment?: string
  feedback?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  student_id: string
  type: DocumentType
  file_name: string
  file_url: string
  template_id?: string
  content?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface BindingRequest {
  id: string
  student_id: string
  recipient_name: string
  recipient_phone: string
  postal_code: string
  address: string
  address_detail?: string
  binding_pdf_url: string
  status: BindingStatus
  tracking_number?: string
  notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: string
  student_id: string
  institution_id: string
  email: string
  token: string
  is_used: boolean
  used_at?: string
  created_at: string
  expires_at: string
}

export interface Notice {
  id: string
  university_id: string
  title: string
  content: string
  category: NoticeCategory
  is_pinned: boolean
  attachments?: Array<{ name: string; url: string }>
  start_date?: string
  end_date?: string
  views: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}
