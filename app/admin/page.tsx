'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/authStore'
import Sidebar from '@/components/Sidebar'
import Content from '@/components/Content'
import Gallery from '@/components/Gallery'
import HomepageImages from '@/components/HomepageImages'
import ActivityRecords from '@/components/ActivityRecords'

type PageType = 'content' | 'gallery' | 'homepage-images' | 'activity-records'

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState<PageType>('content')
  const { isAuthenticated, error, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const renderPage = () => {
    switch (currentPage) {
      case 'content':
        return <Content />
      case 'homepage-images':
        return <HomepageImages />
      case 'gallery':
        return <Gallery />
      case 'activity-records':
        return <ActivityRecords />
      default:
        return <Content />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
            {error && (
              <p className="text-red-600 mb-4">{error}</p>
            )}
            <div className="text-sm text-gray-600 space-y-2">
              <p>TheVida 관리자 페이지에 접근하려면 공유 링크를 사용하세요:</p>
              <div className="bg-gray-100 p-3 rounded text-left">
                <p className="font-medium mb-2">공유 링크:</p>
                <p className="text-xs">URL에 <code className="bg-gray-200 px-1 rounded">?key=thevida_shared_2024</code> 추가</p>
                <p className="text-xs mt-1">예: <code className="bg-gray-200 px-1 rounded">https://admin.thevida.co.kr/access?key=thevida_shared_2024</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={(page: PageType) => setCurrentPage(page)} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
