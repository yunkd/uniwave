// 이메일 발송 서비스 (Resend API)
import type { Env } from '../types/env'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Resend API를 사용한 이메일 발송
 * 
 * @param options - 이메일 옵션
 * @param env - 환경 변수
 */
export async function sendEmail(
  options: EmailOptions,
  env: Env
): Promise<EmailResult> {
  try {
    const apiKey = env.RESEND_API_KEY
    
    if (!apiKey || apiKey === 're_example_key') {
      console.log('[Email Service] Resend API 키가 설정되지 않음 - 이메일 발송 스킵')
      console.log('[Email Service] 발송할 내용:', {
        to: options.to,
        subject: options.subject
      })
      
      return {
        success: false,
        error: 'Resend API 키가 설정되지 않았습니다'
      }
    }
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: options.from || 'Uniwave Pro <noreply@uniwave.pro>',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('[Email Service] 발송 실패:', result)
      return {
        success: false,
        error: result.message || '이메일 발송 실패'
      }
    }
    
    console.log('[Email Service] 발송 성공:', result.id)
    
    return {
      success: true,
      messageId: result.id
    }
  } catch (error) {
    console.error('[Email Service] 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}

/**
 * 이메일 템플릿 생성 유틸리티
 */

// 기관 초대 이메일
export function generateInvitationEmail(data: {
  studentName: string
  institutionName: string
  invitationUrl: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .button { 
          display: inline-block; 
          background: #2563EB; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
        }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Uniwave Pro 기관 초대</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${data.institutionName}</strong> 담당자님!</p>
          <p><strong>${data.studentName}</strong> 학생이 귀 기관을 실습 기관으로 선택했습니다.</p>
          <p>아래 버튼을 클릭하여 기관 계정을 생성하고 실습생 관리를 시작하세요.</p>
          <div style="text-align: center;">
            <a href="${data.invitationUrl}" class="button">기관 가입하기</a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            이 초대 링크는 7일간 유효합니다.
          </p>
        </div>
        <div class="footer">
          <p>© 2025 Uniwave Pro. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// 제본 신청 알림 이메일 (대학 관리자용)
export function generateBindingNotificationEmail(data: {
  studentName: string
  studentNumber: string
  recipientName: string
  address: string
  managementUrl: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .info-box { background: white; padding: 15px; border-left: 4px solid #2563EB; margin: 15px 0; }
        .button { 
          display: inline-block; 
          background: #2563EB; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 새로운 제본 신청</h1>
        </div>
        <div class="content">
          <p>새로운 제본 신청이 접수되었습니다.</p>
          
          <div class="info-box">
            <strong>학생 정보</strong><br>
            이름: ${data.studentName}<br>
            학번: ${data.studentNumber}
          </div>
          
          <div class="info-box">
            <strong>배송 정보</strong><br>
            받는 사람: ${data.recipientName}<br>
            주소: ${data.address}
          </div>
          
          <div style="text-align: center;">
            <a href="${data.managementUrl}" class="button">신청 확인하기</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// 승인 완료 알림 이메일
export function generateApprovalEmail(data: {
  recipientName: string
  itemType: '출석' | '일지'
  date: string
  comment?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ ${data.itemType} 승인 완료</h2>
        </div>
        <div class="content">
          <p>${data.recipientName}님,</p>
          <p>${data.date}의 ${data.itemType}이 승인되었습니다.</p>
          ${data.comment ? `<p><strong>피드백:</strong> ${data.comment}</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `
}

// 반려 알림 이메일
export function generateRejectionEmail(data: {
  recipientName: string
  itemType: '출석' | '일지'
  date: string
  reason: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .reason-box { background: #FEE2E2; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>❌ ${data.itemType} 반려</h2>
        </div>
        <div class="content">
          <p>${data.recipientName}님,</p>
          <p>${data.date}의 ${data.itemType}이 반려되었습니다.</p>
          <div class="reason-box">
            <strong>반려 사유:</strong><br>
            ${data.reason}
          </div>
          <p>수정 후 다시 제출해주세요.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
