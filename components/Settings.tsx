'use client'

import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'TheVida 요양원',
    siteDescription: 'TheVida 요양원 관리자 페이지',
    contactEmail: 'admin@thevida.com',
    apiUrl: 'http://localhost:3001',
    notifications: true,
    darkMode: false,
  })

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-2">TheVida 요양원 관리자 페이지 설정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">일반 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 이름
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 설명
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 이메일
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API URL
              </label>
              <input
                type="url"
                value={settings.apiUrl}
                onChange={(e) => handleChange('apiUrl', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="pt-4">
              <button className="btn-primary">
                API 연결 테스트
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">환경설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  알림 활성화
                </label>
                <p className="text-sm text-gray-500">
                  새로운 주문이나 사용자 가입 시 알림을 받습니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  다크 모드
                </label>
                <p className="text-sm text-gray-500">
                  어두운 테마를 사용합니다
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange('darkMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">작업</h2>
          <div className="space-y-4">
            <button className="w-full btn-primary">
              설정 저장
            </button>
            <button className="w-full btn-secondary">
              설정 초기화
            </button>
            <button className="w-full text-red-600 hover:text-red-700 font-medium py-2 px-4 rounded-lg border border-red-200 hover:border-red-300 transition-colors duration-200">
              캐시 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
