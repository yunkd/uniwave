import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api'
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
      const response = await apiClient.post('/auth/login', credentials)
      
      if (response.data.data) {
        token.value = response.data.data.token
        user.value = response.data.data.user
        
        // 로컬 스토리지에 저장
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '로그인에 실패했습니다'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.post('/auth/register', data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '회원가입에 실패했습니다'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('사용자 정보 파싱 실패:', e)
        logout()
      }
    }
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      const response = await apiClient.get('/auth/me')
      
      if (response.data.data) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (err: any) {
      console.error('사용자 정보 가져오기 실패:', err)
      if (err.response?.status === 401) {
        logout()
      }
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
