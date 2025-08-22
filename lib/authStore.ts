import { AuthState, PermissionUser } from './types'
import { useState, useCallback } from 'react'

// 기본 사용자 정보 (모든 사용자가 동등한 권한)
const defaultUser: PermissionUser = {
  email: 'user@thevida.com',
  name: '사용자',
  position: '직원',
  role: 'staff',
  grantedDate: new Date().toISOString().split('T')[0],
  lastAccess: new Date().toISOString().split('T')[0],
}

// 공유 액세스 키 (링크로 접근)
const SHARED_ACCESS_KEY = 'thevida_shared_2024'

// 인증 시스템
export const useAuthStore = () => {
  const [authState, setAuthState] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })

  // 쿠키에서 키 확인
  const checkCookieAccess = () => {
    if (typeof window === 'undefined') return false
    
    const cookies = document.cookie.split(';')
    const accessCookie = cookies.find(cookie => 
      cookie.trim().startsWith('thevida_access_key=')
    )
    
    if (accessCookie) {
      const key = accessCookie.split('=')[1]
      return key === SHARED_ACCESS_KEY
    }
    
    return false
  }

  // URL에서 키 확인 (공유 링크 인증)
  const checkSharedAccess = () => {
    if (typeof window === 'undefined') return false
    
    const urlParams = new URLSearchParams(window.location.search)
    const accessKey = urlParams.get('key')
    
    return accessKey === SHARED_ACCESS_KEY
  }

  // 인증 상태 확인
  const checkAuth = useCallback(() => {
    // 개발 환경에서는 자동으로 인증 허용
    if (process.env.NODE_ENV === 'development') {
      setAuthState({
        currentUser: defaultUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    }

    // 쿠키 기반 인증 확인 (우선순위)
    const isValidCookie = checkCookieAccess()
    if (isValidCookie) {
      setAuthState({
        currentUser: defaultUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    }

    // URL 파라미터 기반 인증 확인
    const isValidKey = checkSharedAccess()
    if (isValidKey) {
      setAuthState({
        currentUser: defaultUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return true
    }

    // 인증 실패
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: '접근 권한이 없습니다. 공유 링크를 통해 접근하세요.',
    })
    return false
  }, [])

  // 로그아웃
  const logout = () => {
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }

  // 에러 클리어
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  // 현재 사용자 설정
  const setCurrentUser = (user: PermissionUser) => {
    setAuthState(prev => ({ ...prev, currentUser: user }))
  }

  return {
    ...authState,
    checkAuth,
    logout,
    clearError,
    setCurrentUser,
  }
}
