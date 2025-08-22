'use client'

import { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon, PencilIcon } from '@heroicons/react/24/outline'
import { homepageImageAPI, HomepageImage } from '@/lib/api'

const categoryOptions = [
  { value: 'hero', label: '메인 히어로', color: 'bg-blue-100 text-blue-800' },
  { value: 'location', label: '지점 이미지', color: 'bg-green-100 text-green-800' },
  { value: 'facility', label: '시설 이미지', color: 'bg-purple-100 text-purple-800' },
  { value: 'gallery', label: '갤러리', color: 'bg-pink-100 text-pink-800' }
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
    { value: 'sign', label: '간판' },
    { value: 'lobby', label: '로비' },
    { value: 'room', label: '방' },
    { value: 'therapy', label: '치료실' },
    { value: 'general', label: '일반' }
  ],
  gallery: [
    { value: 'rehabilitation', label: '재활프로그램' },
    { value: 'cognitive', label: '인지프로그램' },
    { value: 'birthday', label: '생일잔치' }
  ]
}

export default function HomepageImages() {
  const [images, setImages] = useState<HomepageImage[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingImage, setEditingImage] = useState<HomepageImage | null>(null)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'hero' as string,
    subcategory: 'main' as string,
    order_num: 0
  })

  useEffect(() => {
    loadImages()
  }, [activeCategory, activeSubcategory])

  const loadImages = async () => {
    try {
      setIsLoading(true)
      const category = activeCategory === 'all' ? undefined : activeCategory
      const subcategory = activeSubcategory === 'all' ? undefined : activeSubcategory
      const data = await homepageImageAPI.getAll(category, subcategory)
      setImages(data)
    } catch (error) {
      console.error('이미지 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    
    try {
      const formData = new FormData()
      const fileInput = document.getElementById('imageFile') as HTMLInputElement
      
      if (!fileInput.files?.[0]) {
        alert('이미지 파일을 선택해주세요.')
        return
      }

      formData.append('image', fileInput.files[0])
      formData.append('title', uploadFormData.title)
      formData.append('description', uploadFormData.description)
      formData.append('category', uploadFormData.category)
      formData.append('subcategory', uploadFormData.subcategory)
      formData.append('order_num', uploadFormData.order_num.toString())

      await homepageImageAPI.upload(formData)
      
      setShowUploadForm(false)
      setUploadFormData({
        title: '',
        description: '',
        category: 'hero',
        subcategory: 'main',
        order_num: 0
      })
      loadImages()
    } catch (error) {
      console.error('업로드 실패:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleImageUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!editingImage) return

    try {
      await homepageImageAPI.update(editingImage.id, {
        title: uploadFormData.title,
        description: uploadFormData.description,
        category: uploadFormData.category as 'gallery' | 'hero' | 'location' | 'facility',
        subcategory: uploadFormData.subcategory,
        order_num: uploadFormData.order_num
      })
      
      setEditingImage(null)
      setUploadFormData({
        title: '',
        description: '',
        category: 'hero',
        subcategory: 'main',
        order_num: 0
      })
      loadImages()
    } catch (error) {
      console.error('수정 실패:', error)
      alert('이미지 수정에 실패했습니다.')
    }
  }

  const handleImageDelete = async (id: string | number) => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) return

    try {
      await homepageImageAPI.delete(id)
      loadImages()
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('이미지 삭제에 실패했습니다.')
    }
  }

  const handleOrderChange = async (id: string | number, direction: 'up' | 'down') => {
    try {
      await homepageImageAPI.changeOrder(id, direction)
      loadImages()
    } catch (error) {
      console.error('순서 변경 실패:', error)
      alert('순서 변경에 실패했습니다.')
    }
  }

  const startEditing = (image: HomepageImage) => {
    setEditingImage(image)
    setUploadFormData({
      title: image.title,
      description: image.description || '',
      category: image.category,
      subcategory: image.subcategory || 'main',
      order_num: image.order_num || 0
    })
  }

  const filteredImages = images.filter(image => {
    const categoryMatch = activeCategory === 'all' || image.category === activeCategory
    const subcategoryMatch = activeSubcategory === 'all' || image.subcategory === activeSubcategory
    return categoryMatch && subcategoryMatch
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">홈페이지 이미지 관리</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          새 이미지 업로드
        </button>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex gap-4">
        <select
          value={activeCategory}
          onChange={(e) => {
            setActiveCategory(e.target.value)
            setActiveSubcategory('all')
          }}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">모든 카테고리</option>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select
          value={activeSubcategory}
          onChange={(e) => setActiveSubcategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="all">모든 서브카테고리</option>
          {activeCategory !== 'all' && subcategoryOptions[activeCategory as keyof typeof subcategoryOptions]?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* 업로드 폼 */}
      {showUploadForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">새 이미지 업로드</h3>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => {
                    setUploadFormData({
                      ...uploadFormData, 
                      category: e.target.value,
                      subcategory: subcategoryOptions[e.target.value as keyof typeof subcategoryOptions]?.[0]?.value || 'main'
                    })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서브카테고리</label>
                <select
                  value={uploadFormData.subcategory}
                  onChange={(e) => setUploadFormData({...uploadFormData, subcategory: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {subcategoryOptions[uploadFormData.category as keyof typeof subcategoryOptions]?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                <input
                  type="number"
                  value={uploadFormData.order_num}
                  onChange={(e) => setUploadFormData({...uploadFormData, order_num: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이미지 파일</label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                업로드
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 수정 폼 */}
      {editingImage && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">이미지 수정</h3>
          <form onSubmit={handleImageUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => {
                    setUploadFormData({
                      ...uploadFormData, 
                      category: e.target.value,
                      subcategory: subcategoryOptions[e.target.value as keyof typeof subcategoryOptions]?.[0]?.value || 'main'
                    })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서브카테고리</label>
                <select
                  value={uploadFormData.subcategory}
                  onChange={(e) => setUploadFormData({...uploadFormData, subcategory: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {subcategoryOptions[uploadFormData.category as keyof typeof subcategoryOptions]?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                <input
                  type="number"
                  value={uploadFormData.order_num}
                  onChange={(e) => setUploadFormData({...uploadFormData, order_num: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 이미지 목록 */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">이미지를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="relative">
                <img
                  src={`http://localhost:3001${image.imageUrl}`}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleOrderChange(image.id, 'up')}
                    className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                    title="위로 이동"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOrderChange(image.id, 'down')}
                    className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                    title="아래로 이동"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${categoryOptions.find(c => c.value === image.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                    {categoryOptions.find(c => c.value === image.category)?.label}
                  </span>
                </div>
                
                {image.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.description}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>순서: {image.order_num}</span>
                  <span>{new Date(image.uploadDate || '').toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(image)}
                    className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <PencilIcon className="w-3 h-3" />
                    수정
                  </button>
                  <button
                    onClick={() => handleImageDelete(image.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <TrashIcon className="w-3 h-3" />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredImages.length === 0 && (
        <div className="text-center py-8">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">등록된 이미지가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

