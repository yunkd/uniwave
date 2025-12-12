// Supabase 클라이언트 유틸리티
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../types/env'

/**
 * Supabase 클라이언트 생성
 * @param env - 환경 변수
 * @param useServiceRole - 서비스 롤 키 사용 여부 (기본: false)
 */
export function getSupabaseClient(env: Env, useServiceRole = false) {
  const supabaseUrl = env.SUPABASE_URL
  const supabaseKey = useServiceRole 
    ? env.SUPABASE_SERVICE_KEY 
    : env.SUPABASE_ANON_KEY

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false // Workers 환경에서는 세션 유지 불필요
    }
  })
}

/**
 * 인증 토큰에서 사용자 정보 추출
 * @param token - JWT 토큰
 * @param env - 환경 변수
 */
export async function getUserFromToken(token: string, env: Env) {
  const supabase = getSupabaseClient(env)
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new Error('인증 실패')
  }
  
  return user
}

/**
 * 사용자 역할 확인
 * @param userId - 사용자 ID
 * @param env - 환경 변수
 */
export async function getUserRole(userId: string, env: Env) {
  const supabase = getSupabaseClient(env, true) // Service role로 조회
  
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', userId)
    .single()
  
  if (error || !data) {
    throw new Error('사용자 역할을 찾을 수 없습니다')
  }
  
  return data.role
}
