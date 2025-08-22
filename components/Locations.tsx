'use client'

import { useState } from 'react'

interface LocationData {
  id: string
  name: string
  type: 'incheon' | 'anyang'
  description: string
  address: string
  phone: string
  fax?: string
  email?: string
  operatingHours: string
  capacity: number
  facilities: string[]
  images: string[]
  isActive: boolean
}

const defaultLocations: LocationData[] = [
  {
    id: '1',
    name: '더비다 인천점',
    type: 'incheon',
    description: '인천 미추홀구에 위치한 요양원입니다. 편안하고 따뜻한 환경에서 전문적인 케어 서비스를 제공합니다.',
    address: '인천광역시 미추홀구 제물량로4번길 34-33',
    phone: '032-891-0121',
    fax: '032-891-0122',
    email: 'incheon@thevida.co.kr',
    operatingHours: '24시간 운영',
    capacity: 50,
    facilities: ['개인실', '2인실', '4인실', '재활실', '식당', '휴게실', '정원'],
    images: ['/images/incheon-main.jpg', '/images/incheon-facility.jpg'],
    isActive: true
  },
  {
    id: '2',
    name: '더비다 안양점',
    type: 'anyang',
    description: '안심할 수 있는 평화롭고 안전한 환경에서 어르신들을 정성껏 보살핍니다.',
    address: '경기도 안양시 만안구 전파로 19-1 더비다요양원',
    phone: '031-464-5075',
    fax: '031-464-5076',
    email: 'anyang@thevida.co.kr',
    operatingHours: '24시간 운영',
    capacity: 40,
    facilities: ['개인실', '2인실', '재활실', '식당', '휴게실', '정원', '카페테리아'],
    images: ['/images/anyang-main.jpg', '/images/anyang-facility.jpg'],
    isActive: true
  }
]

export default function Locations() {
  const [locations, setLocations] = useState<LocationData[]>(defaultLocations)
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSave = (location: LocationData) => {
    if (editingLocation) {
      setLocations(prev => prev.map(loc => 
        loc.id === location.id ? location : loc
      ))
      setEditingLocation(null)
    } else if (isAddingNew) {
      setLocations(prev => [...prev, { ...location, id: Date.now().toString() }])
      setIsAddingNew(false)
    }
  }

  const handleCancel = () => {
    setEditingLocation(null)
    setIsAddingNew(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('이 지점을 삭제하시겠습니까?')) {
      setLocations(prev => prev.filter(loc => loc.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
    ))
  }

  const addNewLocation = () => {
    setIsAddingNew(true)
    setEditingLocation({
      id: '',
      name: '',
      type: 'incheon',
      description: '',
      address: '',
      phone: '',
      operatingHours: '24시간 운영',
      capacity: 0,
      facilities: [],
      images: [],
      isActive: true
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">지점 관리</h1>
          <p className="text-gray-600 mt-1">더비다 요양원 지점 정보를 관리하세요</p>
        </div>
        <button
          onClick={addNewLocation}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>새 지점 추가</span>
        </button>
      </div>

      {/* 지점 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map(location => (
          <div key={location.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.type === 'incheon' ? '인천점' : '안양점'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(location.id)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    location.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {location.isActive ? '활성' : '비활성'}
                </button>
                <button
                  onClick={() => setEditingLocation(location)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <p className="text-sm text-gray-600">{location.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  <p className="text-sm text-gray-600">{location.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">운영시간</label>
                  <p className="text-sm text-gray-600">{location.operatingHours}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">수용 인원</label>
                  <p className="text-sm text-gray-600">{location.capacity}명</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시설</label>
                <div className="flex flex-wrap gap-1">
                  {location.facilities.map((facility, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 편집 모달 */}
      {(editingLocation || isAddingNew) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isAddingNew ? '새 지점 추가' : '지점 정보 편집'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              if (editingLocation) handleSave(editingLocation)
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지점명 *</label>
                  <input
                    type="text"
                    value={editingLocation?.name || ''}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지점 유형 *</label>
                  <select
                    value={editingLocation?.type || 'incheon'}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, type: e.target.value as 'incheon' | 'anyang'} : null)}
                    className="input-field"
                    required
                  >
                    <option value="incheon">인천점</option>
                    <option value="anyang">안양점</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명 *</label>
                <textarea
                  value={editingLocation?.description || ''}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="input-field"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                <input
                  type="text"
                  value={editingLocation?.address || ''}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, address: e.target.value} : null)}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                  <input
                    type="tel"
                    value={editingLocation?.phone || ''}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, phone: e.target.value} : null)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">팩스</label>
                  <input
                    type="tel"
                    value={editingLocation?.fax || ''}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, fax: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    value={editingLocation?.email || ''}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, email: e.target.value} : null)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">수용 인원 *</label>
                  <input
                    type="number"
                    value={editingLocation?.capacity || 0}
                    onChange={(e) => setEditingLocation(prev => prev ? {...prev, capacity: parseInt(e.target.value)} : null)}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">운영시간</label>
                <input
                  type="text"
                  value={editingLocation?.operatingHours || ''}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, operatingHours: e.target.value} : null)}
                  className="input-field"
                  placeholder="예: 24시간 운영"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {isAddingNew ? '추가' : '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">지점 통계</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--brand-color)' }}>{locations.length}</div>
            <div className="text-sm text-gray-600">전체 지점</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {locations.filter(l => l.isActive).length}
            </div>
            <div className="text-sm text-gray-600">활성 지점</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {locations.filter(l => l.type === 'incheon').length}
            </div>
            <div className="text-sm text-gray-600">인천점</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {locations.filter(l => l.type === 'anyang').length}
            </div>
            <div className="text-sm text-gray-600">안양점</div>
          </div>
        </div>
      </div>
    </div>
  )
}


