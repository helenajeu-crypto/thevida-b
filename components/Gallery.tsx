'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, EyeIcon, CalendarIcon, MapPinIcon, TagIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { imageAPI, HomepageImage } from '../lib/api'

interface ActivityRecord {
  id: string
  title: string
  content: string
  images: string[]
  location: 'incheon' | 'anyang'
  category: 'rehabilitation' | 'cognitive' | 'birthday'
  date: string
  isActive: boolean
  uploadDate: string
  author: string
}

const locationOptions = [
  { value: 'incheon', label: '인천점' },
  { value: 'anyang', label: '안양점' }
]

const categoryOptions = [
  { value: 'hero', label: '메인 슬라이더', color: 'bg-purple-100 text-purple-800' },
  { value: 'location', label: '지점 이미지', color: 'bg-blue-100 text-blue-800' },
  { value: 'facility', label: '시설 이미지', color: 'bg-green-100 text-green-800' },
  { value: 'gallery', label: '갤러리', color: 'bg-pink-100 text-pink-800' }
]

const subcategoryOptions = {
  hero: [
    { value: 'main', label: '메인' }
  ],
  location: [
    { value: 'incheon', label: '인천점' },
    { value: 'anyang', label: '안양점' }
  ],
  facility: [
    { value: 'sign', label: '간판' },
    { value: 'lobby', label: '로비' },
    { value: 'room', label: '객실' },
    { value: 'therapy', label: '치료실' },
    { value: 'general', label: '일반' }
  ],
  gallery: [
    { value: 'general', label: '일반' }
  ]
}

export default function Gallery() {
  const [images, setImages] = useState<HomepageImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'all' | 'hero' | 'location' | 'facility' | 'gallery'>('all')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'hero' as 'hero' | 'location' | 'facility' | 'gallery',
    subcategory: 'main' as string,
    location: '',
    image: null as File | null
  })

  // 이미지 로드
  useEffect(() => {
    loadImages()
  }, [activeCategory])

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const category = activeCategory === 'all' ? undefined : activeCategory
      const fetchedImages = await imageAPI.getAll(category)
      setImages(fetchedImages)
    } catch (error) {
      console.error('이미지 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setUploadFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmitImage = async () => {
    if (!uploadFormData.title || !uploadFormData.image) {
      alert('제목과 이미지를 입력해주세요.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('image', uploadFormData.image)
      formData.append('title', uploadFormData.title)
      formData.append('description', uploadFormData.description)
      formData.append('category', uploadFormData.category)
      formData.append('subcategory', uploadFormData.subcategory)
      formData.append('location', uploadFormData.location)

      await imageAPI.upload(formData)
      
      setShowUploadForm(false)
      setUploadFormData({
        title: '',
        description: '',
        category: 'hero',
        subcategory: 'main',
        location: '',
        image: null
      })
      
      loadImages() // 이미지 목록 새로고침
      alert('이미지가 성공적으로 업로드되었습니다.')
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleDeleteImage = async (id: string | number) => {
    if (confirm('이 이미지를 삭제하시겠습니까?')) {
      try {
        await imageAPI.delete(id)
        loadImages() // 이미지 목록 새로고침
        alert('이미지가 성공적으로 삭제되었습니다.')
      } catch (error) {
        console.error('이미지 삭제 실패:', error)
        alert('이미지 삭제에 실패했습니다.')
      }
    }
  }

  const handleToggleActive = async (image: HomepageImage) => {
    try {
      await imageAPI.update(image.id, {
        ...image,
        isActive: !image.isActive
      })
      loadImages() // 이미지 목록 새로고침
    } catch (error) {
      console.error('이미지 상태 변경 실패:', error)
      alert('이미지 상태 변경에 실패했습니다.')
    }
  }

  const handleChangeOrder = async (id: string | number, direction: 'up' | 'down') => {
    try {
      await imageAPI.changeOrder(id, direction)
      loadImages() // 이미지 목록 새로고침
    } catch (error) {
      console.error('순서 변경 실패:', error)
      alert('순서 변경에 실패했습니다.')
    }
  }

  const getCategoryLabel = (category: string) => {
    return categoryOptions.find(opt => opt.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    return categoryOptions.find(opt => opt.value === category)?.color || 'bg-gray-100 text-gray-800'
  }

  const getSubcategoryLabel = (category: string, subcategory: string) => {
    const options = subcategoryOptions[category as keyof typeof subcategoryOptions] || []
    return options.find(opt => opt.value === subcategory)?.label || subcategory
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
        <h1 className="text-2xl font-bold text-gray-900">홈페이지 이미지 관리</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            이미지 추가
          </button>
        </div>
      </div>

      {/* 이미지 업로드 폼 */}
      {showUploadForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">새 이미지 추가</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 제목
              </label>
              <input
                type="text"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이미지 제목을 입력하세요"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => {
                    const category = e.target.value as 'hero' | 'location' | 'facility' | 'gallery'
                    setUploadFormData(prev => ({ 
                      ...prev, 
                      category,
                      subcategory: subcategoryOptions[category][0]?.value || 'main'
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  서브카테고리
                </label>
                <select
                  value={uploadFormData.subcategory}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subcategoryOptions[uploadFormData.category].map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치 정보
                </label>
                <input
                  type="text"
                  value={uploadFormData.location}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="위치 정보 (선택사항)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 설명
              </label>
              <textarea
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="이미지에 대한 설명을 입력하세요..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 파일
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {uploadFormData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(uploadFormData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setUploadFormData({
                    title: '',
                    description: '',
                    category: 'hero',
                    subcategory: 'main',
                    location: '',
                    image: null
                  })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSubmitImage}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'hero', 'location', 'facility', 'gallery'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeCategory === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category === 'all' && '전체'}
              {category === 'hero' && '메인 슬라이더'}
              {category === 'location' && '지점 이미지'}
              {category === 'facility' && '시설 이미지'}
              {category === 'gallery' && '갤러리'}
            </button>
          ))}
        </nav>
      </div>

      {/* 이미지 목록 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">이미지를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="card">
              <div className="relative">
                <img
                  src={`http://localhost:3001${image.imageUrl}`}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => handleToggleActive(image)}
                    className={`p-1 rounded-full ${
                      image.isActive 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(image.category)}`}>
                    {getCategoryLabel(image.category)}
                  </span>
                  {image.subcategory && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getSubcategoryLabel(image.category, image.subcategory)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{image.title}</h3>
                {image.description && (
                  <p className="text-gray-600 text-sm mb-2">{image.description}</p>
                )}
                {image.location && (
                  <p className="text-gray-500 text-xs mb-2">📍 {image.location}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>업로드: {formatDate(image.uploadDate || '')}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    image.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {image.isActive ? '활성' : '비활성'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleChangeOrder(image.id, 'up')}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      title="위로 이동"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleChangeOrder(image.id, 'down')}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                      title="아래로 이동"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">순서: {image.order_num || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && images.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">해당 조건에 맞는 이미지가 없습니다.</p>
        </div>
      )}

      {/* 이미지 관리 가이드 */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">홈페이지 이미지 관리 가이드</h3>
        <div className="space-y-3 text-sm text-blue-700">
          <div>
            <h4 className="font-medium">🎠 메인 슬라이더</h4>
            <p>홈페이지 상단의 메인 슬라이더에 표시되는 이미지들을 관리합니다. 순서대로 표시됩니다.</p>
          </div>
          <div>
            <h4 className="font-medium">🏥 지점 이미지</h4>
            <p>인천점과 안양점의 대표 이미지를 관리합니다. 홈페이지 지점 소개 섹션에 표시됩니다.</p>
          </div>
          <div>
            <h4 className="font-medium">🏢 시설 이미지</h4>
            <p>요양원 내부 시설 사진들을 관리합니다. 로비, 객실, 치료실 등으로 분류됩니다.</p>
          </div>
          <div>
            <h4 className="font-medium">📸 갤러리</h4>
            <p>기타 홈페이지에 표시할 이미지들을 관리합니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
