import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Supabase URL과 ANON KEY가 .env.local에 설정되지 않았습니다.\n' +
    '📝 frontend/.env.local 파일을 생성하고 다음을 추가하세요:\n' +
    'VITE_SUPABASE_URL=your-supabase-url\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  )
}

/**
 * Supabase 클라이언트
 * 
 * 사용 예시:
 * ```typescript
 * import { supabase } from '@/utils/supabase'
 * 
 * // 로그인
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 * 
 * // 데이터 조회
 * const { data, error } = await supabase
 *   .from('students')
 *   .select('*')
 *   .eq('id', userId)
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

/**
 * Supabase Auth 세션 정보를 가져옵니다
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * 현재 로그인한 사용자 정보를 가져옵니다
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Supabase Auth 이벤트 리스너
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}
