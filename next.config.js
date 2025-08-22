/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    THEVIDA_API_URL: process.env.THEVIDA_API_URL || 'http://localhost:3001',
  },
  // 프로덕션 환경에서 정적 파일 서빙을 위한 설정
  output: 'standalone',
  // 이미지 최적화 설정
  images: {
    domains: ['thevida.co.kr', 'admin.thevida.co.kr', 'localhost'],
  },
  // 서브도메인 지원을 위한 설정
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
}

module.exports = nextConfig
