import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import type { User, LoginRequest, RegisterRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)

  // Actions
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      // Supabase Auth로 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (authData.user && authData.session) {
        // Access Token 저장
        token.value = authData.session.access_token

        // users 테이블에서 사용자 정보 조회 (role 포함)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (userError) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다')
        }

        // 요청한 role과 실제 role이 일치하는지 확인
        if (userData.role !== credentials.role) {
          // 로그인 실패 - role 불일치
          await supabase.auth.signOut()
          throw new Error(`${credentials.role} 권한으로 로그인할 수 없습니다. 계정의 권한을 확인해주세요.`)
        }

        // User 객체 구성
        user.value = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          status: userData.status,
          emailVerified: userData.email_verified
        }

        // 로컬 스토리지에 저장
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))

        return {
          success: true,
          data: {
            token: token.value,
            user: user.value
          }
        }
      }

      throw new Error('로그인에 실패했습니다')
    } catch (err: any) {
      error.value = err.message || '로그인에 실패했습니다'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Supabase Auth에 사용자 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('회원가입에 실패했습니다')
      }

      // 2. users 테이블에 사용자 정보 삽입
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          status: 'ACTIVE',
          email_verified: false
        })

      if (insertError) {
        // users 테이블 삽입 실패 시 Auth 사용자도 삭제
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('사용자 정보 저장에 실패했습니다')
      }

      return {
        success: true,
        message: '회원가입이 완료되었습니다. 로그인해주세요.'
      }
    } catch (err: any) {
      error.value = err.message || '회원가입에 실패했습니다'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      // Supabase Auth 로그아웃
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Supabase 로그아웃 실패:', err)
    } finally {
      // 로컬 상태 초기화
      user.value = null
      token.value = null
      error.value = null
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  const loadUserFromStorage = async () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
        
        // Supabase 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          // 세션이 만료되었으면 로그아웃
          logout()
        }
      } catch (e) {
        console.error('사용자 정보 파싱 실패:', e)
        logout()
      }
    }
  }

  const fetchCurrentUser = async () => {
    isLoading.value = true
    try {
      // Supabase 세션에서 사용자 ID 가져오기
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        throw new Error('인증 정보를 가져올 수 없습니다')
      }

      // users 테이블에서 사용자 정보 조회
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userError) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다')
      }

      // User 객체 업데이트
      user.value = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        emailVerified: userData.email_verified
      }

      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err: any) {
      console.error('사용자 정보 가져오기 실패:', err)
      logout()
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    
    // Actions
    login,
    register,
    logout,
    loadUserFromStorage,
    fetchCurrentUser
  }
})
