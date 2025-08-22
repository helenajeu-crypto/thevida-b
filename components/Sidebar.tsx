'use client'

import { 
  DocumentTextIcon, 
  PhotoIcon,
  PhotoIcon as ImageIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useAuthStore } from '@/lib/authStore'
import { UserRole } from '@/lib/types'

type PageType = 'content' | 'gallery' | 'homepage-images' | 'activity-records'

interface SidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const getMenuItems = (userRole: UserRole) => {
  const baseItems = [
    { id: 'content', name: '홈페이지 관리', icon: DocumentTextIcon },
    { id: 'homepage-images', name: '홈페이지 이미지', icon: ImageIcon },
    { id: 'gallery', name: '갤러리', icon: PhotoIcon },
    { id: 'activity-records', name: '활동기록 업로드', icon: CalendarDaysIcon },
  ]

  return baseItems
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { currentUser } = useAuthStore()
  const menuItems = getMenuItems(currentUser?.role || 'staff')

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--brand-color)' }}>
            <span className="text-white text-lg font-bold">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--brand-color)' }}>TheVida</h1>
            <p className="text-xs text-gray-500">더비다 스테이 & 케어</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id as PageType)}
                className={clsx(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors duration-200',
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
                style={currentPage === item.id ? { backgroundColor: 'var(--brand-color)' } : {}}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            )
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--brand-color)' }}>
              <span className="text-white text-sm font-medium">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.name || '사용자'}
              </p>
              <p className="text-xs text-gray-500">
                직원 (동등한 권한)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
