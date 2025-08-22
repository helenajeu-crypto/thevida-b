import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface HomepageImage {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  category: 'hero' | 'location' | 'facility' | 'gallery';
  subcategory?: 'incheon' | 'anyang' | 'main' | 'sign' | 'lobby' | 'room' | 'therapy' | 'general';
  order?: number;
  order_num?: number;
  isActive: boolean | number;
  uploadDate?: string;
  location?: string;
  actualPath?: string;
}

// 이미지 관련 API
export const imageAPI = {
  // 모든 이미지 조회
  getAll: async (category?: string): Promise<HomepageImage[]> => {
    const url = category && category !== 'all' 
      ? `${API_BASE_URL}/api/images?category=${category}`
      : `${API_BASE_URL}/api/images`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('이미지 조회에 실패했습니다.');
    }
    return response.json();
  },

  // 이미지 업로드
  upload: async (formData: FormData): Promise<{ id: number; message: string; imageUrl: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/images`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '이미지 업로드에 실패했습니다.');
    }
    
    return response.json();
  },

  // 이미지 수정
  update: async (id: string | number, data: Partial<HomepageImage>): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '이미지 수정에 실패했습니다.');
    }
    
    return response.json();
  },

  // 이미지 삭제
  delete: async (id: string | number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '이미지 삭제에 실패했습니다.');
    }
    
    return response.json();
  },

  // 이미지 순서 변경
  changeOrder: async (id: string | number, direction: 'up' | 'down'): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/images/${id}/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '순서 변경에 실패했습니다.');
    }
    
    return response.json();
  },
};

// 홈페이지 이미지 관련 API
export const homepageImageAPI = {
  // 모든 홈페이지 이미지 조회
  getAll: async (category?: string, subcategory?: string): Promise<HomepageImage[]> => {
    let url = `${API_BASE_URL}/api/homepage-images`;
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('홈페이지 이미지 조회에 실패했습니다.');
    }
    return response.json();
  },

  // 홈페이지 이미지 업로드
  upload: async (formData: FormData): Promise<{ id: number; message: string; imageUrl: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/homepage-images`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '홈페이지 이미지 업로드에 실패했습니다.');
    }
    
    return response.json();
  },

  // 홈페이지 이미지 수정
  update: async (id: string | number, data: Partial<HomepageImage>): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/homepage-images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '홈페이지 이미지 수정에 실패했습니다.');
    }
    
    return response.json();
  },

  // 홈페이지 이미지 삭제
  delete: async (id: string | number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/homepage-images/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '홈페이지 이미지 삭제에 실패했습니다.');
    }
    
    return response.json();
  },

  // 홈페이지 이미지 순서 변경
  changeOrder: async (id: string | number, direction: 'up' | 'down'): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/homepage-images/${id}/order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ direction }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '순서 변경에 실패했습니다.');
    }
    
    return response.json();
  },
};

// 기존 API 함수들 (호환성 유지)
export const fetchContent = async () => {
  // 기존 콘텐츠 API는 그대로 유지
  return { message: 'Content API' };
};

export const syncData = async () => {
  // 기존 동기화 API는 그대로 유지
  return { message: 'Sync completed' };
};
