import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase 클라이언트 생성 유틸리티
 * 
 * @param env - Cloudflare Workers 환경 변수
 * @param useServiceRole - service_role 키 사용 여부 (기본값: false)
 * @returns Supabase 클라이언트 인스턴스
 */
export function getSupabaseClient(
  env: any,
  useServiceRole: boolean = false
): SupabaseClient {
  const supabaseUrl = env.SUPABASE_URL
  const supabaseKey = useServiceRole 
    ? env.SUPABASE_SERVICE_KEY 
    : env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL 또는 API 키가 설정되지 않았습니다')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Cloudflare Workers는 세션 저장 안됨
      detectSessionInUrl: false
    }
  })
}

/**
 * JWT 토큰에서 사용자 ID 추출
 * 
 * @param token - Supabase Access Token
 * @returns 사용자 ID (auth.uid())
 */
export async function verifyToken(
  env: any,
  token: string
): Promise<string | null> {
  try {
    const supabase = getSupabaseClient(env, false)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return user.id
  } catch (error) {
    console.error('토큰 검증 실패:', error)
    return null
  }
}
