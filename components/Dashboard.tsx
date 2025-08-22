'use client'

import { useState } from 'react'
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  HeartIcon, 
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: '총 직원 수',
    value: '12명',
    change: '+2명',
    changeType: 'increase',
    icon: UsersIcon,
  },
  {
    name: '입소자 수',
    value: '45명',
    change: '+3명',
    changeType: 'increase',
    icon: HeartIcon,
  },
  {
    name: '가족 문의',
    value: '8건',
    change: '-2건',
    changeType: 'decrease',
    icon: BuildingOfficeIcon,
  },
  {
    name: '이번 달 일정',
    value: '23건',
    change: '+5건',
    changeType: 'increase',
    icon: CalendarIcon,
  },
]

const recentActivities = [
  {
    id: 1,
    type: '입소',
    title: '김영희님 입소 완료',
    time: '2시간 전',
    status: 'completed',
  },
  {
    id: 2,
    type: '문의',
    title: '박철수 가족 문의 접수',
    time: '4시간 전',
    status: 'pending',
  },
  {
    id: 3,
    type: '일정',
    title: '의사 진료 일정 변경',
    time: '6시간 전',
    status: 'warning',
  },
  {
    id: 4,
    type: '직원',
    title: '이지영 요양보호사 근무 시작',
    time: '8시간 전',
    status: 'completed',
  },
  {
    id: 5,
    type: '시설',
    title: '3층 복도 조명 수리 완료',
    time: '1일 전',
    status: 'completed',
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: '의사 진료',
    date: '2024-01-16',
    time: '09:00',
    type: 'medical',
  },
  {
    id: 2,
    title: '가족 면담',
    date: '2024-01-16',
    time: '14:00',
    type: 'meeting',
  },
  {
    id: 3,
    title: '시설 점검',
    date: '2024-01-17',
    time: '10:00',
    type: 'maintenance',
  },
  {
    id: 4,
    title: '직원 교육',
    date: '2024-01-18',
    time: '15:00',
    type: 'training',
  },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'medical':
        return 'bg-blue-100 text-blue-800'
      case 'meeting':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'training':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">TheVida 요양원 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field text-sm"
          >
            <option value="today">오늘</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm">
              전체 보기
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">예정된 일정</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm">
              전체 보기
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type === 'medical' && '진료'}
                    {event.type === 'meeting' && '면담'}
                    {event.type === 'maintenance' && '점검'}
                    {event.type === 'training' && '교육'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} {event.time}</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm">
                  상세보기
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <UsersIcon className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">직원 등록</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <HeartIcon className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">입소자 등록</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <CalendarIcon className="w-8 h-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-900">일정 추가</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <ChartBarIcon className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">보고서</span>
          </button>
        </div>
      </div>
    </div>
  )
}
