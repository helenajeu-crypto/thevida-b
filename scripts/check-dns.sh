#!/bin/bash

# DNS 전파 확인 스크립트

echo "🔍 admin.thevida.co.kr DNS 전파 상태를 확인합니다..."

# DNS 조회
echo "📡 DNS A 레코드 조회:"
dig admin.thevida.co.kr A +short

# HTTP 응답 확인
echo ""
echo "🌐 HTTP 응답 확인:"
curl -I http://admin.thevida.co.kr 2>/dev/null | head -5

# HTTPS 응답 확인 (SSL 인증서 발급 전에는 실패할 수 있음)
echo ""
echo "🔒 HTTPS 응답 확인:"
curl -I https://admin.thevida.co.kr 2>/dev/null | head -5

echo ""
echo "✅ DNS 전파가 완료되면 HTTP 응답이 정상적으로 나와야 합니다."
echo "📝 만약 'Connection refused' 또는 'No route to host' 오류가 나온다면:"
echo "   1. DNS 전파 대기 (5-30분)"
echo "   2. 서버 방화벽 설정 확인"
echo "   3. 서버에서 Nginx 실행 확인"
