import { Hono } from 'hono'
import { getSupabaseClient } from '../utils/supabase'

type Env = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_KEY: string
}

const auth = new Hono<{ Bindings: Env }>()

/**
 * POST /api/auth/login
 * 로그인 API
 */
auth.post('/login', async (c) => {
  try {
    const { email, password, role } = await c.req.json()

    // 1. 입력 검증
    if (!email || !password || !role) {
      return c.json({
        success: false,
        message: '이메일, 비밀번호, 역할을 모두 입력해주세요'
      }, 400)
    }

    // 2. Supabase Auth 로그인
    const supabase = getSupabaseClient(c.env, false)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return c.json({
        success: false,
        message: '이메일 또는 비밀번호가 일치하지 않습니다'
      }, 401)
    }

    // 3. users 테이블에서 사용자 정보 조회
    const supabaseAdmin = getSupabaseClient(c.env, true)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('auth_id', authData.user.id)
      .single()

    if (userError || !user) {
      return c.json({
        success: false,
        message: '사용자 정보를 찾을 수 없습니다'
      }, 404)
    }

    // 4. 역할 검증
    if (user.role !== role) {
      return c.json({
        success: false,
        message: `선택한 역할(${role})과 계정 역할(${user.role})이 일치하지 않습니다`
      }, 403)
    }

    // 5. 역할별 프로필 정보 조회
    let profile = null

    switch (role) {
      case 'STUDENT': {
        const { data: student } = await supabaseAdmin
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = student
        break
      }
      case 'INSTITUTION': {
        const { data: institution } = await supabaseAdmin
          .from('institutions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = institution
        break
      }
      case 'UNIVERSITY': {
        const { data: university } = await supabaseAdmin
          .from('universities')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = university
        break
      }
    }

    // 6. 응답 반환
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: profile?.name || null,
          createdAt: authData.user.created_at
        },
        token: authData.session.access_token,
        refreshToken: authData.session.refresh_token
      }
    })

  } catch (error: any) {
    console.error('로그인 API 오류:', error)
    return c.json({
      success: false,
      message: '서버 오류가 발생했습니다'
    }, 500)
  }
})

/**
 * POST /api/auth/register
 * 회원가입 API (학생 전용)
 */
auth.post('/register', async (c) => {
  try {
    const { 
      email, 
      password, 
      name,
      phone,
      university_id,
      university_type,
      student_number,
      learner_number
    } = await c.req.json()

    // 1. 입력 검증
    if (!email || !password || !name || !phone || !university_id || !university_type) {
      return c.json({
        success: false,
        message: '필수 정보를 모두 입력해주세요'
      }, 400)
    }

    // 2. Supabase Auth 회원가입
    const supabaseAdmin = getSupabaseClient(c.env, true)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // 이메일 인증 스킵 (개발용)
    })

    if (authError || !authData.user) {
      return c.json({
        success: false,
        message: authError?.message || '회원가입 중 오류가 발생했습니다'
      }, 400)
    }

    // 3. users 테이블에 저장
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        role: 'STUDENT'
      })
      .select()
      .single()

    if (userError) {
      // 롤백: Auth 사용자 삭제
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return c.json({
        success: false,
        message: '회원가입 중 오류가 발생했습니다'
      }, 500)
    }

    // 4. students 테이블에 저장
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: user.id,
        name,
        phone,
        university_id,
        university_type,
        student_number: university_type === 'CYBER' ? student_number : null,
        learner_number: university_type === 'CREDIT_BANK' ? learner_number : null,
        status: 'PENDING' // 대학 승인 대기
      })

    if (studentError) {
      // 롤백
      await supabaseAdmin.from('users').delete().eq('id', user.id)
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return c.json({
        success: false,
        message: '학생 정보 저장 중 오류가 발생했습니다'
      }, 500)
    }

    // 5. 응답 반환
    return c.json({
      success: true,
      message: '회원가입이 완료되었습니다. 대학 승인을 기다려주세요.',
      data: {
        email,
        role: 'STUDENT'
      }
    })

  } catch (error: any) {
    console.error('회원가입 API 오류:', error)
    return c.json({
      success: false,
      message: '서버 오류가 발생했습니다'
    }, 500)
  }
})

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회
 */
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        message: '인증 토큰이 없습니다'
      }, 401)
    }

    const token = authHeader.substring(7)

    // 1. JWT 토큰 검증
    const supabase = getSupabaseClient(c.env, false)
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token)

    if (error || !authUser) {
      return c.json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      }, 401)
    }

    // 2. users 테이블에서 정보 조회
    const supabaseAdmin = getSupabaseClient(c.env, true)
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('auth_id', authUser.id)
      .single()

    if (!user) {
      return c.json({
        success: false,
        message: '사용자 정보를 찾을 수 없습니다'
      }, 404)
    }

    // 3. 역할별 프로필 조회
    let profile = null

    switch (user.role) {
      case 'STUDENT': {
        const { data: student } = await supabaseAdmin
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = student
        break
      }
      case 'INSTITUTION': {
        const { data: institution } = await supabaseAdmin
          .from('institutions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = institution
        break
      }
      case 'UNIVERSITY': {
        const { data: university } = await supabaseAdmin
          .from('universities')
          .select('*')
          .eq('user_id', user.id)
          .single()
        profile = university
        break
      }
    }

    // 4. 응답 반환
    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile?.name || null,
        createdAt: authUser.created_at
      }
    })

  } catch (error: any) {
    console.error('현재 사용자 조회 API 오류:', error)
    return c.json({
      success: false,
      message: '서버 오류가 발생했습니다'
    }, 500)
  }
})

export default auth
