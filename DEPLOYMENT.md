# TheVida Admin 배포 가이드

## 🚀 서브도메인 배포 (admin.thevida.co.kr)

### 📋 사전 준비
1. **DNS 레코드 설정** ✅
   - Type: A Record
   - Name: admin
   - Value: [서버 IP 주소]
   - 상태: 완료

2. **서버 환경**
   - Ubuntu/CentOS 서버
   - Nginx 웹서버
   - Node.js 18+ 설치
   - PM2 프로세스 관리자

### 🚀 즉시 진행 가능한 단계
DNS 설정이 완료되었으므로 다음 단계를 진행할 수 있습니다:

## 📋 배포 단계

### 1. DNS 전파 확인 (선택사항)
```bash
# DNS 전파 상태 확인
./scripts/check-dns.sh
```

### 2. 서버에 프로젝트 업로드
```bash
# 로컬에서 서버로 파일 전송
scp -r thevida-admin-new/ user@server:/var/www/
ssh user@server
cd /var/www/thevida-admin-new
```

### 3. 환경 설정
```bash
# 환경 변수 파일 생성
cp env.production.example .env.local
# 필요시 .env.local 파일 수정
```

### 4. SSL 인증서 설정
```bash
# 스크립트 실행 권한 부여
chmod +x scripts/*.sh

# SSL 인증서 발급 및 Nginx 설정
./scripts/setup-ssl.sh
```

### 5. 앱 배포

#### 방법 A: 자동 배포 (CI/CD)
```bash
# GitHub에 push하면 자동 배포
git push origin main
```

#### 방법 B: 수동 배포 (SSH 접속)
```bash
# 서버에 SSH 접속
ssh user@server

# 프로젝트 디렉토리로 이동
cd /var/www/thevida-admin-new

# 수동 배포 실행
./scripts/manual-deploy.sh
```

### 6. 상태 확인
```bash
# PM2 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs

# 배포 로그 확인
pm2 logs thevida-admin
pm2 logs thevida-api
```

## 🔧 환경 설정

### 환경 변수 설정
```bash
# .env.local 파일 생성
THEVIDA_API_URL=https://api.thevida.co.kr
NODE_ENV=production
```

### Nginx 설정 (서브도메인)
```nginx
server {
    listen 80;
    server_name admin.thevida.co.kr;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Nginx 설정 (서브패스)
```nginx
server {
    listen 80;
    server_name thevida.co.kr;
    
    # 기존 홈페이지
    location / {
        # 기존 홈페이지 설정
    }
    
    # 관리자 앱
    location /admin {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 SSL 인증서 설정

### Let's Encrypt 사용
```bash
sudo certbot --nginx -d admin.thevida.co.kr
```

## 📁 파일 구조
```
/var/www/thevida-admin/
├── .next/           # Next.js 빌드 파일
├── public/          # 정적 파일
├── server.js        # 백엔드 API
├── package.json
└── thevida.db      # SQLite 데이터베이스
```

## 🔄 자동 배포 스크립트
```bash
#!/bin/bash
cd /var/www/thevida-admin
git pull origin main
npm install
npm run build
pm2 restart thevida-admin
pm2 restart thevida-api
```

## 🔧 CI/CD 설정 (GitHub Actions)

### GitHub Secrets 설정
GitHub 저장소의 Settings → Secrets and variables → Actions에서 다음 값들을 설정하세요:

```
SERVER_HOST: [서버 IP 주소]
SERVER_USER: [SSH 사용자명]
SERVER_SSH_KEY: [SSH 개인키 내용]
SERVER_PORT: [SSH 포트 (기본: 22)]
```

### SSH 키 생성 (서버에서)
```bash
# SSH 키 생성
ssh-keygen -t rsa -b 4096 -C "deploy@thevida.co.kr"

# 공개키를 authorized_keys에 추가
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 개인키 내용 확인 (GitHub Secrets에 등록)
cat ~/.ssh/id_rsa
```

## 📊 모니터링
```bash
# PM2로 프로세스 관리
pm2 start npm --name "thevida-admin" -- start
pm2 start server.js --name "thevida-api"
pm2 status

# 배포 상태 확인
pm2 logs thevida-admin --lines 50
pm2 logs thevida-api --lines 50
```

## 🔄 배포 방법 요약

### 자동 배포 (권장)
1. 코드 수정 후 `git push origin main`
2. GitHub Actions가 자동으로 배포 진행
3. Actions 탭에서 배포 상태 확인

### 수동 배포
1. 서버에 SSH 접속
2. `cd /var/www/thevida-admin-new`
3. `./scripts/manual-deploy.sh` 실행
