#!/bin/bash

# TheVida Admin 수동 배포 스크립트 (SSH 접속 후 실행)

echo "🔧 TheVida Admin 수동 배포를 시작합니다..."

# 현재 디렉토리 확인
echo "📁 현재 디렉토리: $(pwd)"

# Git 상태 확인 및 업데이트
if [ -d ".git" ]; then
    echo "📋 Git 저장소 상태를 확인합니다..."
    echo "📝 현재 브랜치: $(git branch --show-current)"
    echo "📝 최신 커밋: $(git log -1 --oneline)"
    
    echo "🔄 최신 코드를 가져옵니다..."
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Git pull이 성공했습니다."
        echo "📝 새로운 커밋: $(git log -1 --oneline)"
    else
        echo "❌ Git pull에 실패했습니다."
        exit 1
    fi
else
    echo "❌ Git 저장소가 없습니다. 배포를 중단합니다."
    exit 1
fi

# 배포 스크립트 실행
echo "🚀 배포 스크립트를 실행합니다..."
./scripts/deploy.sh

echo "✅ 수동 배포가 완료되었습니다!"
echo "🌐 https://admin.thevida.co.kr 에서 확인하세요."
