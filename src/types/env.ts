// 환경 변수 타입 정의
export type Env = {
  // Supabase
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
  
  // Resend (이메일)
  RESEND_API_KEY: string
  
  // PDF.co (나중에 연동)
  PDFCO_API_KEY: string
  
  // Frontend
  FRONTEND_URL: string
  
  // JWT (백업용)
  JWT_SECRET: string
}

// Hono Context에 사용할 타입
export type HonoEnv = {
  Bindings: Env
}
