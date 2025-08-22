#!/bin/bash

# TheVida Admin 배포 스크립트

echo "🚀 TheVida Admin 배포를 시작합니다..."

# 환경 변수 설정
export NODE_ENV=production
export THEVIDA_API_URL=https://admin.thevida.co.kr/api

# Git 상태 확인
echo "📋 Git 상태를 확인합니다..."
if [ -d ".git" ]; then
    echo "✅ Git 저장소가 감지되었습니다."
    echo "📝 현재 브랜치: $(git branch --show-current)"
    echo "📝 최신 커밋: $(git log -1 --oneline)"
else
    echo "⚠️ Git 저장소가 감지되지 않았습니다."
fi

# 기존 프로세스 종료
echo "⏹️ 기존 프로세스를 종료합니다..."
pkill -f "next start" || true
pkill -f "node server.js" || true

# 의존성 설치
echo "📦 의존성을 설치합니다..."
npm ci --production

# 앱 빌드
echo "🔨 앱을 빌드합니다..."
npm run build

# 데이터베이스 디렉토리 생성
mkdir -p data
mkdir -p public/uploads

# 권한 설정
chmod 755 public/uploads
chmod 644 thevida.db 2>/dev/null || true

# PM2로 프로세스 관리
if command -v pm2 &> /dev/null; then
    echo "🔄 PM2로 서비스를 시작합니다..."
    
    # PM2 설정 파일이 없으면 생성
    if [ ! -f ecosystem.config.js ]; then
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'thevida-admin',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'thevida-api',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
}
EOF
    fi
    
    pm2 start ecosystem.config.js
    pm2 save
else
    echo "📦 PM2를 설치합니다..."
    npm install -g pm2
    
    # 서비스 시작
    pm2 start npm --name "thevida-admin" -- start
    pm2 start server.js --name "thevida-api"
    pm2 save
    pm2 startup
fi

echo "✅ 배포가 완료되었습니다!"
echo "🌐 https://admin.thevida.co.kr 에서 확인하세요."
echo "📊 PM2 상태 확인: pm2 status"
echo "📝 로그 확인: pm2 logs"
