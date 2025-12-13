import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api', // Vite 프록시를 통해 백엔드로 전달
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    // 에러 처리
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 인증 실패 - 로그인 페이지로 리다이렉트
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
          
        case 403:
          console.error('권한이 없습니다:', data.message)
          break
          
        case 404:
          console.error('리소스를 찾을 수 없습니다:', data.message)
          break
          
        case 500:
          console.error('서버 오류:', data.message)
          break
          
        default:
          console.error('API 오류:', data.message || error.message)
      }
    } else if (error.request) {
      console.error('네트워크 오류: 서버에 연결할 수 없습니다')
    } else {
      console.error('요청 설정 오류:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// API 헬퍼 함수
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<ApiResponse<T>>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<ApiResponse<T>>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<ApiResponse<T>>(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<ApiResponse<T>>(url, config),
}

export default api
