// PDF 생성 서비스 (PDF.co 연동 준비)
import type { Env } from '../types/env'

/**
 * PDF.co API를 사용한 PDF 생성 (준비만, 실제 호출 X)
 * 
 * 나중에 연동 시 사용할 함수 구조
 */

export interface PDFGenerationOptions {
  templateType: 'evaluation' | 'certificate' | 'binding'
  data: Record<string, any>
}

export interface PDFGenerationResult {
  success: boolean
  pdfUrl?: string
  error?: string
}

/**
 * PDF 생성 (PDF.co API)
 * 
 * @param options - PDF 생성 옵션
 * @param env - 환경 변수
 * @returns PDF URL
 */
export async function generatePDF(
  options: PDFGenerationOptions,
  env: Env
): Promise<PDFGenerationResult> {
  // TODO: 나중에 PDF.co API 연동 시 활성화
  // 현재는 준비만 해두고 실제 호출하지 않음
  
  console.log('[PDF Service] PDF 생성 요청:', options.templateType)
  console.log('[PDF Service] API 키 존재 여부:', !!env.PDFCO_API_KEY)
  
  // 임시: 더미 응답 반환
  return {
    success: false,
    error: 'PDF.co API가 아직 연동되지 않았습니다. 나중에 활성화하세요.'
  }
  
  /* 
  // 나중에 활성화할 실제 코드:
  
  const apiKey = env.PDFCO_API_KEY
  
  // PDF.co API 호출 예시
  const response = await fetch('https://api.pdf.co/v1/pdf/convert/from/html', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      html: generateHTMLTemplate(options),
      name: `${options.templateType}_${Date.now()}.pdf`
    })
  })
  
  const result = await response.json()
  
  if (result.error) {
    return {
      success: false,
      error: result.message
    }
  }
  
  return {
    success: true,
    pdfUrl: result.url
  }
  */
}

/**
 * HTML 템플릿 생성 (평가서, 확인서 등)
 */
function generateHTMLTemplate(options: PDFGenerationOptions): string {
  const { templateType, data } = options
  
  // 템플릿 타입별 HTML 생성
  switch (templateType) {
    case 'evaluation':
      return generateEvaluationTemplate(data)
    case 'certificate':
      return generateCertificateTemplate(data)
    case 'binding':
      return generateBindingTemplate(data)
    default:
      return '<html><body>Invalid template type</body></html>'
  }
}

/**
 * 평가서 HTML 템플릿
 */
function generateEvaluationTemplate(data: Record<string, any>): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Nanum Gothic', sans-serif; padding: 40px; }
        h1 { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2563EB; }
        .value { margin-top: 5px; padding: 10px; background: #f9fafb; }
      </style>
    </head>
    <body>
      <h1>실습 평가서</h1>
      <div class="section">
        <h3>학생 정보</h3>
        <div class="field">
          <div class="label">이름:</div>
          <div class="value">${data.studentName || 'N/A'}</div>
        </div>
      </div>
      <!-- 추가 필드들... -->
    </body>
    </html>
  `
}

/**
 * 확인서 HTML 템플릿
 */
function generateCertificateTemplate(data: Record<string, any>): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Nanum Gothic', sans-serif; padding: 40px; }
        h1 { text-align: center; margin-bottom: 40px; }
      </style>
    </head>
    <body>
      <h1>실습 확인서</h1>
      <p>${data.studentName || 'N/A'} 학생의 실습을 확인합니다.</p>
    </body>
    </html>
  `
}

/**
 * 제본 PDF 템플릿 (표지 + 출석부 + 일지 + 확인서 + 평가서)
 */
function generateBindingTemplate(data: Record<string, any>): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Nanum Gothic', sans-serif; }
        .cover { page-break-after: always; text-align: center; padding-top: 200px; }
        .section { page-break-after: always; padding: 40px; }
      </style>
    </head>
    <body>
      <div class="cover">
        <h1>실습 종합 서류</h1>
        <h2>${data.studentName || 'N/A'}</h2>
      </div>
      <div class="section">
        <h2>출석부</h2>
        <!-- 출석 기록 -->
      </div>
      <div class="section">
        <h2>실습 일지</h2>
        <!-- 일지 내용 -->
      </div>
    </body>
    </html>
  `
}

/**
 * PDF 상태 확인 (비동기 생성 시 사용)
 */
export async function checkPDFStatus(jobId: string, env: Env): Promise<PDFGenerationResult> {
  console.log('[PDF Service] PDF 상태 확인:', jobId)
  
  // TODO: 나중에 구현
  return {
    success: false,
    error: '아직 구현되지 않음'
  }
}
