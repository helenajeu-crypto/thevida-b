#!/bin/bash

# TheVida Admin SSL 인증서 설정 스크립트

echo "🔐 TheVida Admin SSL 인증서 설정을 시작합니다..."

# Certbot 설치 확인
if ! command -v certbot &> /dev/null; then
    echo "📦 Certbot을 설치합니다..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# SSL 인증서 발급
echo "🔑 admin.thevida.co.kr SSL 인증서를 발급합니다..."
sudo certbot certonly --nginx -d admin.thevida.co.kr --email admin@thevida.co.kr --agree-tos --non-interactive

# Nginx 설정 적용
echo "⚙️ Nginx 설정을 적용합니다..."
sudo cp nginx/admin.thevida.co.kr.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/admin.thevida.co.kr.conf /etc/nginx/sites-enabled/

# Nginx 설정 테스트
echo "🧪 Nginx 설정을 테스트합니다..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 설정이 올바릅니다."
    sudo systemctl reload nginx
    echo "🔄 Nginx를 재로드했습니다."
else
    echo "❌ Nginx 설정에 오류가 있습니다. 확인해주세요."
    exit 1
fi

# 자동 갱신 설정
echo "🔄 SSL 인증서 자동 갱신을 설정합니다..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "🎉 SSL 설정이 완료되었습니다!"
echo "📡 https://admin.thevida.co.kr 에서 접속 가능합니다."
