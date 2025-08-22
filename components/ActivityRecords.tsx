'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, EyeIcon, CalendarIcon, MapPinIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { activityAPI, ActivityRecord } from '../lib/api'



const locationOptions = [
  { value: 'incheon', label: '인천점' },
  { value: 'anyang', label: '안양점' }
]

const categoryOptions = [
  { value: 'rehabilitation', label: '재활프로그램 기록' },
  { value: 'cognitive', label: '인지프로그램 기록' },
  { value: 'birthday', label: '생신잔치 기록' }
]

export default function ActivityRecords() {
  const [records, setRecords] = useState<ActivityRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    content: '',
    location: 'incheon' as 'incheon' | 'anyang',
    category: 'rehabilitation' as 'rehabilitation' | 'cognitive' | 'birthday',
    date: new Date().toISOString().split('T')[0],
    images: [] as File[]
  })

  // 활동기록 로드
  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      setIsLoading(true)
      const fetchedRecords = await activityAPI.getAll()
      setRecords(fetchedRecords)
    } catch (error) {
      console.error('활동기록 로드 실패:', error)
      // API가 아직 구현되지 않은 경우를 위한 임시 데이터
      setRecords([
        {
          id: '1',
          title: '인천점 재활프로그램 - 물리치료',
          content: '오늘은 물리치료 프로그램을 진행했습니다...',
          images: ['/uploads/activity1.jpg'],
          location: 'incheon',
          category: 'rehabilitation',
          date: '2024-01-15',
          isActive: true,
          uploadDate: '2024-01-15T10:00:00Z',
          author: '김치료사'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // 파일 검증
    const validFiles = files.filter(file => {
      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`파일 "${file.name}"이 너무 큽니다. 최대 10MB까지 업로드 가능합니다.`)
        return false
      }
      
      // 파일 형식 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert(`파일 "${file.name}"의 형식이 지원되지 않습니다. JPG, PNG, GIF, WebP 형식만 지원됩니다.`)
        return false
      }
      
      return true
    })
    
    // 최대 파일 개수 검증
    if (uploadFormData.images.length + validFiles.length > 10) {
      alert('최대 10개까지 이미지를 업로드할 수 있습니다.')
      return
    }
    
    setUploadFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...validFiles]
    }))
  }

  const removeImage = (index: number) => {
    setUploadFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmitRecord = async () => {
    if (!uploadFormData.title || !uploadFormData.content) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (uploadFormData.images.length === 0) {
      alert('최소 1개의 이미지를 업로드해주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', uploadFormData.title)
      formData.append('content', uploadFormData.content)
      formData.append('location', uploadFormData.location)
      formData.append('category', uploadFormData.category)
      formData.append('date', uploadFormData.date)
      
      uploadFormData.images.forEach((image, index) => {
        formData.append(`images`, image)
      })

      await activityAPI.upload(formData)
      
      setShowUploadForm(false)
      setUploadFormData({
        title: '',
        content: '',
        location: 'incheon',
        category: 'rehabilitation',
        date: new Date().toISOString().split('T')[0],
        images: []
      })
      
      loadRecords()
      alert('활동기록이 성공적으로 업로드되었습니다.')
    } catch (error) {
      console.error('활동기록 업로드 실패:', error)
      let errorMessage = '활동기록 업로드에 실패했습니다.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message)
      }
      
      alert(`업로드 실패: ${errorMessage}`)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (confirm('이 활동기록을 삭제하시겠습니까?')) {
      try {
        await activityAPI.delete(id)
        loadRecords()
        alert('활동기록이 성공적으로 삭제되었습니다.')
      } catch (error) {
        console.error('활동기록 삭제 실패:', error)
        alert('활동기록 삭제에 실패했습니다.')
      }
    }
  }

  const getLocationLabel = (location: string) => {
    return locationOptions.find(opt => opt.value === location)?.label || location
  }

  const getCategoryLabel = (category: string) => {
    return categoryOptions.find(opt => opt.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      rehabilitation: 'bg-blue-100 text-blue-800',
      cognitive: 'bg-green-100 text-green-800',
      birthday: 'bg-pink-100 text-pink-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">활동기록 관리</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            글 업로드 하기
          </button>
        </div>
      </div>

      {/* 활동기록 업로드 폼 */}
      {showUploadForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">새 활동기록 추가</h3>
            <button
              onClick={() => setShowUploadForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="활동기록 제목을 입력하세요"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                value={uploadFormData.content}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="활동 내용을 상세히 입력하세요"
              />
            </div>

            {/* 지점 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지점 선택 *
              </label>
              <select
                value={uploadFormData.location}
                onChange={(e) => setUploadFormData(prev => ({ 
                  ...prev, 
                  location: e.target.value as 'incheon' | 'anyang' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 선택 *
              </label>
              <select
                value={uploadFormData.category}
                onChange={(e) => setUploadFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value as 'rehabilitation' | 'cognitive' | 'birthday' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 날짜 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동 날짜 *
              </label>
              <input
                type="date"
                value={uploadFormData.date}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 업로드 * (최소 1개)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                지원 형식: JPG, PNG, GIF, WebP | 최대 파일 크기: 10MB | 최대 10개 파일
              </p>
              
              {/* 업로드된 이미지 미리보기 */}
              {uploadFormData.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadFormData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`미리보기 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSubmitRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 활동기록 목록 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">활동기록 목록</h3>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">로딩 중...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8">
            <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 활동기록이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{record.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{record.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {getLocationLabel(record.location)}
                      </div>
                      <div className="flex items-center">
                        <TagIcon className="w-4 h-4 mr-1" />
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(record.category)}`}>
                          {getCategoryLabel(record.category)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatDate(record.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="삭제"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* 이미지 미리보기 */}
                {record.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {record.images.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`활동 이미지 ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                    {record.images.length > 4 && (
                      <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                        +{record.images.length - 4}개 더
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
