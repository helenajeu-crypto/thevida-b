'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, ShieldCheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { UserRole, PermissionUser } from '@/lib/types'

// 모의 권한 데이터 (실제로는 데이터베이스에서 관리)
const mockPermissions: PermissionUser[] = [
  {
    email: 'owner@thevida.com',
    name: '대표자',
    position: '대표자',
    role: 'owner',
    grantedDate: '2024-01-01',
    lastAccess: '2024-01-15',
  },
  {
    email: 'admin@thevida.com',
    name: '관리자',
    position: '간호사',
    role: 'admin',
    grantedDate: '2024-01-02',
    lastAccess: '2024-01-14',
  },
  {
    email: 'staff1@thevida.com',
    name: '김철수',
    position: '요양보호사',
    role: 'staff',
    grantedDate: '2024-01-03',
    lastAccess: '2024-01-13',
  },
  {
    email: 'staff2@thevida.com',
    name: '이영희',
    position: '영양사',
    role: 'staff',
    grantedDate: '2024-01-04',
    lastAccess: '2024-01-12',
  },
]

const roleOptions = [
  { value: 'staff', label: '직원', description: '기본 기능만 사용 가능' },
  { value: 'admin', label: '관리자', description: '대부분 기능 사용 가능' },
  { value: 'owner', label: '대표자', description: '모든 기능 사용 가능' },
]

export default function PermissionManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    position: '',
    role: 'staff' as UserRole,
  })

  const filteredUsers = mockPermissions.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleRoleChange = (email: string, newRole: UserRole) => {
    // 실제 API 호출로 대체
    console.log('권한 변경:', email, newRole)
  }

  const handleAddUser = () => {
    // 실제 API 호출로 대체
    console.log('새 사용자 추가:', newUser)
    setShowAddForm(false)
    setNewUser({ email: '', name: '', position: '', role: 'staff' })
  }

  const handleRemoveUser = (email: string) => {
    // 실제 API 호출로 대체
    console.log('사용자 제거:', email)
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      case 'staff':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return '대표자'
      case 'admin':
        return '관리자'
      case 'staff':
        return '직원'
      default:
        return '직원'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">권한 관리</h1>
          <p className="text-gray-600 mt-2">직원들의 접근 권한을 관리하세요</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          권한 추가
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">새 권한 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
                placeholder="example@thevida.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">직책</label>
              <input
                type="text"
                value={newUser.position}
                onChange={(e) => setNewUser(prev => ({ ...prev, position: e.target.value }))}
                className="input-field"
                placeholder="요양보호사"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">권한</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                className="input-field"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleAddUser}
              disabled={!newUser.email || !newUser.name || !newUser.position}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="직원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">모든 권한</option>
              <option value="owner">대표자</option>
              <option value="admin">관리자</option>
              <option value="staff">직원</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직원 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현재 권한
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  권한 변경
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 접근
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.position}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value as UserRole)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastAccess || '접근 기록 없음'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleRemoveUser(user.email)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      권한 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roleOptions.map((role) => (
          <div key={role.value} className="card">
            <div className="flex items-center mb-3">
              <ShieldCheckIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{role.label}</h3>
            </div>
            <p className="text-sm text-gray-600">{role.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              {role.value === 'staff' && '• 대시보드, 시설 관리, 콘텐츠 관리, 갤러리 관리'}
              {role.value === 'admin' && '• 직원 관리, 모든 기본 기능 + 권한 관리'}
              {role.value === 'owner' && '• 모든 기능 + 권한 관리, 시스템 설정'}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
