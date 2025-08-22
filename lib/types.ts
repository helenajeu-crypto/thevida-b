export type UserRole = 'owner' | 'admin' | 'staff'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  position: string
  role: UserRole
  status: 'active' | 'inactive'
  joinDate: string
  lastLogin?: string
}

export interface PermissionUser {
  email: string
  name: string
  position: string
  role: UserRole
  grantedDate: string
  lastAccess?: string
}

export interface AuthState {
  currentUser: PermissionUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface HomepageImage {
  id: number
  title: string
  description?: string
  imageUrl: string
  category: 'gallery' | 'hero' | 'location' | 'facility'
  subcategory?: 'incheon' | 'anyang' | 'main' | 'sign' | 'lobby' | 'room' | 'therapy' | 'general' | 'rehabilitation' | 'cognitive' | 'birthday'
  order_num: number
  isActive: number
  uploadDate: string
}

export interface Image {
  id: number
  title: string
  description?: string
  imageUrl: string
  category: string
  subcategory?: string
  order_num: number
  isActive: number
  location?: string
  uploadDate: string
  actualPath?: string
}
