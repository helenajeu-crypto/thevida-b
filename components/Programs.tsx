'use client'

import { useState } from 'react'

interface ProgramRecord {
  id: string
  date: string
  title: string
  description: string
  images: string[]
  category: 'rehabilitation' | 'cognitive' | 'birthday' | 'activity'
  location: 'incheon' | 'anyang' | 'both'
  isActive: boolean
}

const defaultPrograms: ProgramRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: '재활 운동 프로그램',
    description: '어르신들의 건강 증진을 위한 전문적인 재활 운동을 진행했습니다. 물리치료사와 함께 개인별 맞춤 운동을 실시하여 근력 강화와 유연성 향상에 도움을 주었습니다.',
    images: ['/images/rehab-1.jpg', '/images/rehab-2.jpg'],
    category: 'rehabilitation',
    location: 'incheon',
    isActive: true
  },
  {
    id: '2',
    date: '2024-01-10',
    title: '인지 훈련 프로그램',
    description: '치매 예방을 위한 인지 훈련 프로그램을 진행했습니다. 퍼즐, 기억력 게임, 색칠하기 등 다양한 활동을 통해 어르신들의 인지 기능 향상에 기여했습니다.',
    images: ['/images/cognitive-1.jpg'],
    category: 'cognitive',
    location: 'anyang',
    isActive: true
  },
  {
    id: '3',
    date: '2024-01-05',
    title: '1월 생신잔치',
    description: '1월 생신을 맞으신 어르신들을 위한 따뜻한 생신잔치를 개최했습니다. 가족들과 함께하는 시간을 통해 어르신들의 기쁨과 웃음이 가득했던 특별한 날이었습니다.',
    images: ['/images/birthday-1.jpg', '/images/birthday-2.jpg'],
    category: 'birthday',
    location: 'both',
    isActive: true
  },
  {
    id: '4',
    date: '2024-01-20',
    title: '원예 치료 프로그램',
    description: '식물과 함께하는 원예 치료 프로그램을 진행했습니다. 화분에 꽃을 심고 가꾸는 과정을 통해 어르신들의 정서 안정과 소근육 발달에 도움을 주었습니다.',
    images: ['/images/activity-1.jpg'],
    category: 'activity',
    location: 'incheon',
    isActive: true
  }
]

export default function Programs() {
  const [programs, setPrograms] = useState<ProgramRecord[]>(defaultPrograms)
  const [editingProgram, setEditingProgram] = useState<ProgramRecord | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProgramRecord['category']>('all')
  const [selectedLocation, setSelectedLocation] = useState<'all' | ProgramRecord['location']>('all')

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'rehabilitation', label: '재활프로그램' },
    { value: 'cognitive', label: '인지프로그램' },
    { value: 'birthday', label: '생신잔치' },
    { value: 'activity', label: '여가활동' }
  ]

  const locations = [
    { value: 'all', label: '전체' },
    { value: 'incheon', label: '인천점' },
    { value: 'anyang', label: '안양점' },
    { value: 'both', label: '양쪽 지점' }
  ]

  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || program.location === selectedLocation
    return matchesCategory && matchesLocation
  })

  const handleSave = (program: ProgramRecord) => {
    if (editingProgram) {
      setPrograms(prev => prev.map(prog => 
        prog.id === program.id ? program : prog
      ))
      setEditingProgram(null)
    } else if (isAddingNew) {
      setPrograms(prev => [...prev, { ...program, id: Date.now().toString() }])
      setIsAddingNew(false)
    }
  }

  const handleCancel = () => {
    setEditingProgram(null)
    setIsAddingNew(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('이 프로그램을 삭제하시겠습니까?')) {
      setPrograms(prev => prev.filter(prog => prog.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setPrograms(prev => prev.map(prog => 
      prog.id === id ? { ...prog, isActive: !prog.isActive } : prog
    ))
  }

  const addNewProgram = () => {
    setIsAddingNew(true)
    setEditingProgram({
      id: '',
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      images: [],
      category: 'rehabilitation',
      location: 'incheon',
      isActive: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}년 ${month}월 ${day}일`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로그램 관리</h1>
          <p className="text-gray-600 mt-1">더비다 요양원 프로그램 기록을 관리하세요</p>
        </div>
        <button
          onClick={addNewProgram}
          className="btn-primary flex items-center space-x-2"
        >
          <span>+</span>
          <span>새 프로그램 추가</span>
        </button>
      </div>

      {/* 필터 */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지점</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="input-field"
            >
              {locations.map(location => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 프로그램 목록 */}
      <div className="space-y-4">
        {filteredPrograms.map(program => (
          <div key={program.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    program.category === 'rehabilitation' ? 'bg-blue-100 text-blue-800' :
                    program.category === 'cognitive' ? 'bg-purple-100 text-purple-800' :
                    program.category === 'birthday' ? 'bg-pink-100 text-pink-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {categories.find(c => c.value === program.category)?.label}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    program.location === 'incheon' ? 'bg-blue-100 text-blue-800' :
                    program.location === 'anyang' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {locations.find(l => l.value === program.location)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatDate(program.date)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(program.id)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    program.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {program.isActive ? '활성' : '비활성'}
                </button>
                <button
                  onClick={() => setEditingProgram(program)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <p className="text-sm text-gray-600">{program.description}</p>
              </div>
              
              {program.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
                  <div className="flex space-x-2">
                    {program.images.map((image, index) => (
                      <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">이미지 {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">프로그램이 없습니다</h3>
          <p className="text-gray-500">새로운 프로그램을 추가해보세요.</p>
        </div>
      )}

      {/* 편집 모달 */}
      {(editingProgram || isAddingNew) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isAddingNew ? '새 프로그램 추가' : '프로그램 편집'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              if (editingProgram) handleSave(editingProgram)
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜 *</label>
                  <input
                    type="date"
                    value={editingProgram?.date || ''}
                    onChange={(e) => setEditingProgram(prev => prev ? {...prev, date: e.target.value} : null)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                  <select
                    value={editingProgram?.category || 'rehabilitation'}
                    onChange={(e) => setEditingProgram(prev => prev ? {...prev, category: e.target.value as any} : null)}
                    className="input-field"
                    required
                  >
                    <option value="rehabilitation">재활프로그램</option>
                    <option value="cognitive">인지프로그램</option>
                    <option value="birthday">생신잔치</option>
                    <option value="activity">여가활동</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input
                  type="text"
                  value={editingProgram?.title || ''}
                  onChange={(e) => setEditingProgram(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명 *</label>
                <textarea
                  value={editingProgram?.description || ''}
                  onChange={(e) => setEditingProgram(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="input-field"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지점 *</label>
                <select
                  value={editingProgram?.location || 'incheon'}
                  onChange={(e) => setEditingProgram(prev => prev ? {...prev, location: e.target.value as any} : null)}
                  className="input-field"
                  required
                >
                  <option value="incheon">인천점</option>
                  <option value="anyang">안양점</option>
                  <option value="both">양쪽 지점</option>
                </select>
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
        <h2 className="text-lg font-semibold mb-4">프로그램 통계</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--brand-color)' }}>{programs.length}</div>
            <div className="text-sm text-gray-600">전체 프로그램</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {programs.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">활성 프로그램</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {programs.filter(p => p.category === 'rehabilitation').length}
            </div>
            <div className="text-sm text-gray-600">재활복지</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {programs.filter(p => p.category === 'cognitive').length}
            </div>
            <div className="text-sm text-gray-600">인지치료</div>
          </div>
        </div>
      </div>
    </div>
  )
}


