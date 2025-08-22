'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SHARED_ACCESS_KEY = 'thevida_shared_2024'

export default function AccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validateAndRedirect = () => {
      const key = searchParams.get('key')
      
      if (!key) {
        setError('접근 키가 필요합니다.')
        setIsValidating(false)
        return
      }

      if (key === SHARED_ACCESS_KEY) {
        // 쿠키 설정 (7일간 유효)
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        document.cookie = `thevida_access_key=${key}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
        
        // 관리자 페이지로 리다이렉트
        router.push('/admin')
      } else {
        setError('유효하지 않은 접근 키입니다.')
        setIsValidating(false)
      }
    }

    validateAndRedirect()
  }, [searchParams, router])

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">접근 확인 중...</h1>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 실패</h1>
          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}
          <div className="text-sm text-gray-600 space-y-2">
            <p>TheVida 관리자 페이지에 접근하려면 올바른 공유 링크를 사용하세요:</p>
            <div className="bg-gray-100 p-3 rounded text-left">
              <p className="font-medium mb-2">올바른 공유 링크:</p>
                             <p className="text-xs">https://admin.thevida.co.kr/access?key=thevida_shared_2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
