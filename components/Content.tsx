'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { imageAPI, HomepageImage } from '@/lib/api'

  // 실제 thevida 홈페이지에 올라가있는 이미지 데이터
  const actualImages: HomepageImage[] = [
    // 메인 히어로 이미지들 (실제 파일이 있는 것들만)
    {
      id: 'hero-1',
      title: '메인 히어로 슬라이드 1',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/slide1.jpeg',
      category: 'hero',
      subcategory: 'main',
      order: 1,
      isActive: true,
      uploadDate: '2024-01-15',
      actualPath: '../thevida/public/images/homehero/slide1.jpeg'
    },
    {
      id: 'hero-2',
      title: '메인 히어로 슬라이드 2',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/slide2.jpeg',
      category: 'hero',
      subcategory: 'main',
      order: 2,
      isActive: true,
      uploadDate: '2024-01-14',
      actualPath: '../thevida/public/images/homehero/slide2.jpeg'
    },
    {
      id: 'hero-3',
      title: '메인 히어로 이미지 3',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/KakaoTalk_20250820_112533073.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 3,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/KakaoTalk_20250820_112533073.jpg'
    },
    {
      id: 'hero-4',
      title: '메인 히어로 이미지 4',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/KakaoTalk_20250820_112551010.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 4,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/KakaoTalk_20250820_112551010.jpg'
    },
    {
      id: 'hero-5',
      title: '메인 히어로 이미지 5',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/dominik-lange-VUOiQW4OeLI-unsplash.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 5,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/dominik-lange-VUOiQW4OeLI-unsplash.jpg'
    },
    {
      id: 'hero-6',
      title: '메인 히어로 이미지 6',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/matt-bennett-78hTqvjYMS4-unsplash.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 6,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/matt-bennett-78hTqvjYMS4-unsplash.jpg'
    },
    {
      id: 'hero-7',
      title: '메인 히어로 이미지 7',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/huan-yu-enfdmCds0VU-unsplash.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 7,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/huan-yu-enfdmCds0VU-unsplash.jpg'
    },
    {
      id: 'hero-8',
      title: '메인 히어로 이미지 8',
      description: '홈페이지 상단 메인 슬라이드 이미지',
      imageUrl: 'http://localhost:3000/images/homehero/unsplash1.jpg',
      category: 'hero',
      subcategory: 'main',
      order: 8,
      isActive: true,
      uploadDate: '2024-08-20',
      actualPath: '../thevida/public/images/homehero/unsplash1.jpg'
    },

  // 지점 선택 이미지들 (플레이스홀더)
  {
    id: 'location-incheon',
    title: '인천점 지점 선택 이미지',
    description: '홈페이지 지점 선택 섹션의 인천점 이미지',
    imageUrl: '/images/locations/incheon-main.jpg',
    category: 'location',
    subcategory: 'incheon',
    order: 9,
    isActive: true,
    uploadDate: '2024-01-13',
    location: '인천점'
  },
  {
    id: 'location-anyang',
    title: '안양점 지점 선택 이미지',
    description: '홈페이지 지점 선택 섹션의 안양점 이미지',
    imageUrl: '/images/locations/anyang-main.jpg',
    category: 'location',
    subcategory: 'anyang',
    order: 10,
    isActive: true,
    uploadDate: '2024-01-12',
    location: '안양점'
  },

  // 시설 소개 이미지들 (플레이스홀더)
  {
    id: 'facility-incheon-sign',
    title: '인천점 시설 간판',
    description: '인천점 소개 섹션의 시설 간판 사진',
    imageUrl: '/images/facilities/incheon-sign.jpg',
    category: 'facility',
    subcategory: 'sign',
    order: 11,
    isActive: true,
    uploadDate: '2024-01-11',
    location: '인천점'
  },
  {
    id: 'facility-anyang-sign',
    title: '안양점 시설 간판',
    description: '안양점 소개 섹션의 시설 간판 사진',
    imageUrl: '/images/facilities/anyang-sign.jpg',
    category: 'facility',
    subcategory: 'sign',
    order: 12,
    isActive: true,
    uploadDate: '2024-01-10',
    location: '안양점'
  },
  {
    id: 'facility-incheon-lobby',
    title: '인천점 메인 로비',
    description: '인천점 시설 둘러보기의 메인 로비 사진',
    imageUrl: '/images/facilities/incheon-lobby.jpg',
    category: 'facility',
    subcategory: 'lobby',
    order: 13,
    isActive: true,
    uploadDate: '2024-01-09',
    location: '인천점'
  },
  {
    id: 'facility-incheon-room',
    title: '인천점 생활실',
    description: '인천점 시설 둘러보기의 생활실 사진',
    imageUrl: '/images/facilities/incheon-room.jpg',
    category: 'facility',
    subcategory: 'room',
    order: 14,
    isActive: true,
    uploadDate: '2024-01-08',
    location: '인천점'
  },

  // 안양점 시설 이미지들 (실제 파일이 있는 것들만)
  {
    id: 'facility-anyang-1',
    title: '안양점 시설 이미지 1',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facility1.jpg',
    category: 'facility',
    subcategory: 'lobby',
    order: 15,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facility1.jpg'
  },
  {
    id: 'facility-anyang-2',
    title: '안양점 시설 이미지 2',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facilitynew1.jpg',
    category: 'facility',
    subcategory: 'room',
    order: 16,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facilitynew1.jpg'
  },
  {
    id: 'facility-anyang-3',
    title: '안양점 시설 이미지 3',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facilitynew2_1.jpg',
    category: 'facility',
    subcategory: 'room',
    order: 17,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facilitynew2_1.jpg'
  },
  {
    id: 'facility-anyang-4',
    title: '안양점 시설 이미지 4',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facilitynew2_2.jpg',
    category: 'facility',
    subcategory: 'room',
    order: 18,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facilitynew2_2.jpg'
  },
  {
    id: 'facility-anyang-5',
    title: '안양점 시설 이미지 5',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facilitynew2_3.jpg',
    category: 'facility',
    subcategory: 'room',
    order: 19,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facilitynew2_3.jpg'
  },
  {
    id: 'facility-anyang-6',
    title: '안양점 시설 이미지 6',
    description: '안양점 시설 둘러보기 이미지',
    imageUrl: 'http://localhost:3000/images/anyang/facilitynew3.jpg',
    category: 'facility',
    subcategory: 'therapy',
    order: 20,
    isActive: true,
    uploadDate: '2024-08-20',
    location: '안양점',
    actualPath: '../thevida/public/images/anyang/facilitynew3.jpg'
  }
]

const categoryOptions = [
  { value: 'hero', label: '메인 히어로', description: '홈페이지 상단 메인 슬라이드' },
  { value: 'location', label: '지점 선택', description: '홈페이지 지점 선택 섹션' },
  { value: 'facility', label: '시설 소개', description: '각 지점의 시설 간판 및 둘러보기' },
  { value: 'gallery', label: '갤러리', description: '일반 갤러리 이미지' }
]

const subcategoryOptions = {
  hero: [
    { value: 'main', label: '메인 슬라이드' }
  ],
  location: [
    { value: 'incheon', label: '인천점' },
    { value: 'anyang', label: '안양점' }
  ],
  facility: [
    { value: 'sign', label: '시설 간판' },
    { value: 'lobby', label: '메인 로비' },
    { value: 'room', label: '생활실' },
    { value: 'therapy', label: '치료실' }
  ],
  gallery: [
    { value: 'general', label: '일반' }
  ]
}

export default function Content() {
  const [images, setImages] = useState<HomepageImage[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'hero' | 'location' | 'facility' | 'gallery'>('all')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HomepageImage | null>(null)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'gallery' as 'hero' | 'location' | 'facility' | 'gallery',
    subcategory: 'general' as 'incheon' | 'anyang' | 'main' | 'sign' | 'lobby' | 'room' | 'therapy' | 'general',
    location: ''
  })

  // 이미지 데이터 로드
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        const data = await imageAPI.getAll(activeTab === 'all' ? undefined : activeTab)
        setImages(data)
      } catch (error) {
        console.error('이미지 로드 실패:', error)
        // 에러 시 기본 데이터 사용
        setImages(actualImages)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [activeTab])

  const filteredImages = images.filter(image => 
    activeTab === 'all' || image.category === activeTab
  )

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsLoading(true)
        
        const formData = new FormData()
        formData.append('image', file)
        formData.append('title', uploadFormData.title || file.name)
        formData.append('description', uploadFormData.description)
        formData.append('category', uploadFormData.category)
        formData.append('subcategory', uploadFormData.subcategory)
        if (uploadFormData.location) {
          formData.append('location', uploadFormData.location)
        }

        const result = await imageAPI.upload(formData)
        
        // 새로 업로드된 이미지를 목록에 추가
        const newImage: HomepageImage = {
          id: result.id,
          title: uploadFormData.title || file.name,
          description: uploadFormData.description,
          imageUrl: `http://localhost:3001${result.imageUrl}`,
          category: uploadFormData.category,
          subcategory: uploadFormData.subcategory,
          order: images.length + 1,
          isActive: true,
          uploadDate: new Date().toISOString().split('T')[0],
          location: uploadFormData.location || undefined
        }
        
        setImages(prev => [...prev, newImage])
        setShowUploadForm(false)
        setUploadFormData({
          title: '',
          description: '',
          category: 'gallery',
          subcategory: 'general',
          location: ''
        })
        
        alert('이미지가 성공적으로 업로드되었습니다!')
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        alert('이미지 업로드에 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteImage = async (id: string | number) => {
    if (confirm('이 이미지를 삭제하시겠습니까?')) {
      try {
        setIsLoading(true)
        await imageAPI.delete(id)
        setImages(prev => prev.filter(img => img.id !== id))
        alert('이미지가 성공적으로 삭제되었습니다!')
      } catch (error) {
        console.error('이미지 삭제 실패:', error)
        alert('이미지 삭제에 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleToggleActive = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, isActive: !img.isActive } : img
    ))
  }

  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const currentIndex = prev.findIndex(img => img.id === id)
      if (currentIndex === -1) return prev

      const newImages = [...prev]
      if (direction === 'up' && currentIndex > 0) {
        [newImages[currentIndex], newImages[currentIndex - 1]] = [newImages[currentIndex - 1], newImages[currentIndex]]
      } else if (direction === 'down' && currentIndex < newImages.length - 1) {
        [newImages[currentIndex], newImages[currentIndex + 1]] = [newImages[currentIndex + 1], newImages[currentIndex]]
      }

      return newImages.map((img, index) => ({ ...img, order: index + 1 }))
    })
  }

  const getCategoryLabel = (category: string) => {
    return categoryOptions.find(opt => opt.value === category)?.label || category
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hero': return 'bg-red-100 text-red-800'
      case 'location': return 'bg-blue-100 text-blue-800'
      case 'facility': return 'bg-green-100 text-green-800'
      case 'gallery': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubcategoryLabel = (subcategory?: string) => {
    if (!subcategory) return ''
    const allSubcategories = Object.values(subcategoryOptions).flat()
    return allSubcategories.find(opt => opt.value === subcategory)?.label || subcategory
  }

  const getImageDisplayUrl = (image: HomepageImage) => {
    // 실제 파일이 있는 경우 해당 경로 사용
    if (image.actualPath) {
      return image.imageUrl
    }
    
    // 실제 파일이 없는 경우 플레이스홀더 이미지 표시
    const svgContent = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
          ${image.title}
        </text>
        <text x="50%" y="70%" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle">
          Image Ready
        </text>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
  }

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (imageId: string | number) => {
    setImageErrors(prev => new Set(prev).add(imageId.toString()))
  }

  const getImageSrc = (image: HomepageImage) => {
    // 이미지 로드 에러가 발생한 경우 플레이스홀더 표시
    if (imageErrors.has(image.id.toString())) {
      console.log(`Image error for ${image.id}, showing placeholder`)
      return getImageDisplayUrl({ ...image, actualPath: undefined })
    }
    
    // imageUrl이 http://localhost:3000으로 시작하는 경우 실제 이미지
    if (image.imageUrl.startsWith('http://localhost:3000')) {
      console.log(`Loading actual image for ${image.id}: ${image.imageUrl}`)
      return image.imageUrl
    }
    
    // imageUrl이 http://localhost:3001으로 시작하는 경우 백엔드 이미지
    if (image.imageUrl.startsWith('http://localhost:3001')) {
      console.log(`Loading backend image for ${image.id}: ${image.imageUrl}`)
      return image.imageUrl
    }
    
    // blob URL인 경우 (업로드된 이미지) 직접 사용
    if (image.imageUrl.startsWith('blob:')) {
      console.log(`Loading blob image for ${image.id}: ${image.imageUrl}`)
      return image.imageUrl
    }
    
    // 그 외의 경우 플레이스홀더 표시
    console.log(`Showing placeholder for ${image.id}: ${image.imageUrl}`)
    return getImageDisplayUrl({ ...image, actualPath: undefined })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">홈페이지 이미지 관리</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowUploadForm(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            이미지 추가
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isEditing ? '편집 완료' : '편집 모드'}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 설명
              </label>
              <textarea
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="이미지 설명을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => setUploadFormData(prev => ({ 
                    ...prev, 
                    category: e.target.value as any,
                    subcategory: e.target.value === 'hero' ? 'main' : 
                                e.target.value === 'location' ? 'incheon' :
                                e.target.value === 'facility' ? 'sign' : 'general'
                  }))}
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
                  세부 카테고리
                </label>
                <select
                  value={uploadFormData.subcategory}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, subcategory: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subcategoryOptions[uploadFormData.category]?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
                         {(uploadFormData.category === 'location' || uploadFormData.category === 'facility' || uploadFormData.category === 'gallery') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지점
                </label>
                <select
                  value={uploadFormData.location}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">지점 선택</option>
                  <option value="인천점">인천점</option>
                  <option value="안양점">안양점</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 파일 선택
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setUploadFormData({
                    title: '',
                    description: '',
                    category: 'gallery',
                    subcategory: 'general',
                    location: ''
                  })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {(['all', 'hero', 'location', 'facility', 'gallery'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'all' && '전체'}
              {tab === 'hero' && '메인 히어로'}
              {tab === 'location' && '지점 선택'}
              {tab === 'facility' && '시설 소개'}
              {tab === 'gallery' && '갤러리'}
            </button>
          ))}
        </nav>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="card">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getImageSrc(image)}
                alt={image.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={() => handleImageError(image.id.toString())}
                style={{ minHeight: '192px' }}
              />
              <div className="absolute top-2 right-2 flex space-x-1 z-10">
                {isEditing && (
                  <>
                    <button
                      onClick={() => handleMoveOrder(image.id.toString(), 'up')}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(image.id.toString(), 'down')}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                    >
                      <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-1 bg-red-500 rounded-full shadow-md hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4 text-white" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleToggleActive(image.id.toString())}
                  className={`p-1 rounded-full shadow-md ${
                    image.isActive 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                >
                  <EyeIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(image.category)}`}>
                  {getCategoryLabel(image.category)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              
              {image.location && (
                <p className="text-sm text-blue-600 mb-2">📍 {image.location}</p>
              )}
              
              {image.subcategory && (
                <p className="text-sm text-gray-500 mb-2">
                  세부: {getSubcategoryLabel(image.subcategory)}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>순서: {image.order}</span>
                <span>업로드: {image.uploadDate}</span>
              </div>
              
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  image.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {image.isActive ? '활성' : '비활성'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">해당 카테고리에 이미지가 없습니다.</p>
        </div>
      )}

      {/* 이미지 관리 가이드 */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">이미지 관리 가이드</h3>
        <div className="space-y-3 text-sm text-blue-700">
          <div>
            <h4 className="font-medium">📱 메인 히어로</h4>
            <p>홈페이지 상단 슬라이드 이미지 (1920x800px 권장)</p>
          </div>
          <div>
            <h4 className="font-medium">🏥 지점 선택</h4>
            <p>홈페이지 지점 선택 섹션의 인천점/안양점 이미지 (400x300px 권장)</p>
          </div>
          <div>
            <h4 className="font-medium">🏢 시설 소개</h4>
            <p>각 지점 페이지의 시설 간판 및 둘러보기 이미지 (800x600px 권장)</p>
          </div>
          <div>
            <h4 className="font-medium">📸 갤러리</h4>
            <p>일반 갤러리 이미지 (다양한 크기 지원)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
