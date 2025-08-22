'use client'

import { useState } from 'react'

interface Appointment {
  id: string
  branch: 'incheon' | 'anyang'
  date: string
  time: string
  elderName: string
  guardianName: string
  guardianPhone: string
  relationship: string
  inquiryType: string
  message?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  notes?: string
}

const defaultAppointments: Appointment[] = [
  {
    id: '1',
    branch: 'incheon',
    date: '2024-01-25',
    time: '14:00',
    elderName: '김철수',
    guardianName: '김영희',
    guardianPhone: '010-1234-5678',
    relationship: '딸',
    inquiryType: '입원 상담',
    message: '어머니가 치매 초기 단계이고, 24시간 케어가 필요합니다.',
    status: 'pending',
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    branch: 'anyang',
    date: '2024-01-26',
    time: '15:30',
    elderName: '이영수',
    guardianName: '이민수',
    guardianPhone: '010-9876-5432',
    relationship: '아들',
    inquiryType: '서비스 문의',
    message: '재활 프로그램에 대해 자세히 알고 싶습니다.',
    status: 'confirmed',
    createdAt: '2024-01-19T14:20:00Z',
    notes: '재활 프로그램 상세 안내 예정'
  },
  {
    id: '3',
    branch: 'incheon',
    date: '2024-01-24',
    time: '11:00',
    elderName: '박순자',
    guardianName: '박지영',
    guardianPhone: '010-5555-1234',
    relationship: '딸',
    inquiryType: '견학 신청',
    message: '시설을 먼저 둘러보고 싶습니다.',
    status: 'completed',
    createdAt: '2024-01-18T09:15:00Z',
    notes: '견학 완료, 입원 신청 예정'
  }
]

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments)
  const [selectedStatus, setSelectedStatus] = useState<'all' | Appointment['status']>('all')
  const [selectedBranch, setSelectedBranch] = useState<'all' | Appointment['branch']>('all')
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  const statusOptions = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: 'pending', label: '대기중', color: 'yellow' },
    { value: 'confirmed', label: '확정', color: 'blue' },
    { value: 'completed', label: '완료', color: 'green' },
    { value: 'cancelled', label: '취소', color: 'red' }
  ]

  const branchOptions = [
    { value: 'all', label: '전체' },
    { value: 'incheon', label: '인천점' },
    { value: 'anyang', label: '안양점' }
  ]

  const inquiryTypes = [
    '입원 상담',
    '서비스 문의',
    '견학 신청',
    '기타'
  ]

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus
    const matchesBranch = selectedBranch === 'all' || appointment.branch === selectedBranch
    return matchesStatus && matchesBranch
  })

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ))
  }

  const handleSaveNotes = (id: string, notes: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, notes } : app
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('이 예약을 삭제하시겠습니까?')) {
      setAppointments(prev => prev.filter(app => app.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상담 예약 관리</h1>
          <p className="text-gray-600 mt-1">더비다 요양원 상담 예약을 관리하세요</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지점</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as any)}
              className="input-field"
            >
              {branchOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.elderName} 어르신 상담
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                    {statusOptions.find(s => s.value === appointment.status)?.label}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {branchOptions.find(b => b.value === appointment.branch)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(appointment.date)} {formatTime(appointment.time)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingAppointment(appointment)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">어르신 성함</label>
                  <p className="text-sm text-gray-600">{appointment.elderName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">보호자 성함</label>
                  <p className="text-sm text-gray-600">{appointment.guardianName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <p className="text-sm text-gray-600">{appointment.guardianPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관계</label>
                  <p className="text-sm text-gray-600">{appointment.relationship}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
                  <p className="text-sm text-gray-600">{appointment.inquiryType}</p>
                </div>
                {appointment.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                    <p className="text-sm text-gray-600">{appointment.message}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">예약 상태 변경</label>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                    className="input-field"
                  >
                    {statusOptions.filter(s => s.value !== 'all').map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={appointment.notes || ''}
                onChange={(e) => handleSaveNotes(appointment.id, e.target.value)}
                className="input-field"
                rows={2}
                placeholder="상담 관련 메모를 입력하세요..."
              />
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">예약이 없습니다</h3>
          <p className="text-gray-500">필터 조건에 맞는 예약이 없습니다.</p>
        </div>
      )}

      {/* 편집 모달 */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">예약 정보 편집</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              setEditingAppointment(null)
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지점</label>
                  <select
                    value={editingAppointment.branch}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, branch: e.target.value as any} : null)}
                    className="input-field"
                  >
                    <option value="incheon">인천점</option>
                    <option value="anyang">안양점</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select
                    value={editingAppointment.status}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, status: e.target.value as any} : null)}
                    className="input-field"
                  >
                    {statusOptions.filter(s => s.value !== 'all').map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, date: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, time: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">어르신 성함</label>
                  <input
                    type="text"
                    value={editingAppointment.elderName}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, elderName: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">보호자 성함</label>
                  <input
                    type="text"
                    value={editingAppointment.guardianName}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, guardianName: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input
                    type="tel"
                    value={editingAppointment.guardianPhone}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, guardianPhone: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관계</label>
                  <input
                    type="text"
                    value={editingAppointment.relationship}
                    onChange={(e) => setEditingAppointment(prev => prev ? {...prev, relationship: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
                <select
                  value={editingAppointment.inquiryType}
                  onChange={(e) => setEditingAppointment(prev => prev ? {...prev, inquiryType: e.target.value} : null)}
                  className="input-field"
                >
                  {inquiryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                <textarea
                  value={editingAppointment.message || ''}
                  onChange={(e) => setEditingAppointment(prev => prev ? {...prev, message: e.target.value} : null)}
                  className="input-field"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="btn-secondary"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">예약 통계</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--brand-color)' }}>{appointments.length}</div>
            <div className="text-sm text-gray-600">전체 예약</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">확정 예약</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">대기 예약</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">완료 예약</div>
          </div>
        </div>
      </div>
    </div>
  )
}


