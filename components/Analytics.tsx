'use client'

import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

const analyticsData = {
  overview: [
    {
      name: '총 매출',
      value: '₩45,678,900',
      change: '+23.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: '신규 사용자',
      value: '234',
      change: '+12.3%',
      changeType: 'positive',
      icon: UsersIcon,
    },
    {
      name: '평균 주문액',
      value: '₩89,500',
      change: '+8.7%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
    },
    {
      name: '전환율',
      value: '3.2%',
      change: '+1.1%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
  ],
  topProducts: [
    { name: 'TheVida Premium', sales: 156, revenue: '₩15,444,000' },
    { name: 'TheVida Basic', sales: 89, revenue: '₩4,361,000' },
    { name: 'TheVida Pro', sales: 67, revenue: '₩13,333,000' },
  ],
  monthlyRevenue: [
    { month: '1월', revenue: 12000000 },
    { month: '2월', revenue: 13500000 },
    { month: '3월', revenue: 14200000 },
    { month: '4월', revenue: 15800000 },
    { month: '5월', revenue: 16500000 },
    { month: '6월', revenue: 17800000 },
  ],
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">분석</h1>
        <p className="text-gray-600 mt-2">TheVida 서비스 성과를 분석하세요</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.overview.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">지난 달 대비</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">인기 상품</h2>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">{index + 1}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales}개 판매</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 매출</h2>
          <div className="space-y-4">
            {analyticsData.monthlyRevenue.map((item) => {
              const percentage = (item.revenue / 20000000) * 100
              return (
                <div key={item.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.month}</span>
                    <span className="font-medium">₩{(item.revenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">사용자 통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">활성 사용자</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">신규 가입</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">탈퇴율</span>
              <span className="font-medium">2.3%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주문 통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">총 주문</span>
              <span className="font-medium">567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">완료율</span>
              <span className="font-medium">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">평균 처리시간</span>
              <span className="font-medium">2.3일</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">수익 통계</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">월 매출</span>
              <span className="font-medium">₩17.8M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">성장률</span>
              <span className="font-medium text-green-600">+23.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">목표 달성률</span>
              <span className="font-medium">118%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


