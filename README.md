# TheVida 요양원 관리자 페이지

더비다 스테이 & 케어 요양원의 관리자 페이지입니다.

## 주요 기능

### 🔐 보안 및 접근
- **키 기반 인증**: URL에 `?key=thevida_admin_2024` 추가하여 접근
- **이메일 기반 인증**: URL에 `?email=helena.jeu@gmail.com` 추가하여 접근
- 로그인 시스템 없이 간단한 접근 제어

### 📱 SMS 알림 시스템
- **상담 예약 알림**: 홈페이지에서 상담 예약 신청 시 관리자 전화번호(01021669525)로 자동 SMS 발송
- **메시지 형식**: 지점, 날짜, 시간, 어르신 정보, 보호자 정보 포함
- **에러 처리**: SMS 전송 실패 시에도 예약은 정상 처리

### 🏠 콘텐츠 관리
- **홈페이지 관리**: 메인 페이지 콘텐츠 편집
- **지점 관리**: 인천점, 안양점 정보 관리
- **프로그램 관리**: 재활복지, 인지치료, 생신잔치, 활동 프로그램 관리
- **갤러리 관리**: 이미지 업로드, 카테고리별 관리

### 📅 상담 예약 관리
- **예약 현황**: 지점별, 상태별 예약 조회
- **예약 편집**: 상태 변경, 메모 추가
- **자동 알림**: 새 예약 시 SMS 알림 발송

### 👥 사용자 관리
- **직원 관리**: 직원 정보 관리
- **권한 관리**: 역할별 접근 권한 설정
- **승인 관리**: 신규 직원 승인 처리

## 기술 스택

- **Frontend**: Next.js 14.2.32, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Backend**: Express.js, MongoDB
- **SMS Service**: 네이버 클라우드 플랫폼 / 카카오톡 비즈니스 / AWS SNS

## 환경 변수 설정

### Frontend (.env.local)
```bash
NEXT_PUBLIC_ADMIN_ACCESS_KEY=thevida_admin_2024
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```bash
# 데이터베이스
MONGODB_URI=mongodb://localhost:27017/thevida

# SMS 서비스 (선택사항)
NAVER_CLOUD_ACCESS_KEY=your_access_key
NAVER_CLOUD_SECRET_KEY=your_secret_key
NAVER_CLOUD_SERVICE_ID=your_service_id
NAVER_CLOUD_SENDER_NUMBER=your_sender_number

# 또는 카카오톡 비즈니스
KAKAO_API_KEY=your_api_key
KAKAO_SENDER_NUMBER=your_sender_number

# 또는 AWS SNS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_SNS_TOPIC_ARN=your_topic_arn
```

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone [repository-url]
cd thevida-admin-new
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 값들을 설정
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 접근
브라우저에서 다음 URL로 접근:
- 키 기반: `http://localhost:3000?key=thevida_admin_2024`
- 이메일 기반: `http://localhost:3000?email=helena.jeu@gmail.com`

## 프로젝트 구조

```
thevida-admin-new/
├── app/                    # Next.js 앱 라우터
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── Dashboard.tsx      # 대시보드
│   ├── Content.tsx        # 홈페이지 관리
│   ├── Locations.tsx      # 지점 관리
│   ├── Programs.tsx       # 프로그램 관리
│   ├── Gallery.tsx        # 갤러리 관리
│   ├── Appointments.tsx   # 상담 예약 관리
│   ├── Users.tsx          # 직원 관리
│   ├── UserApproval.tsx   # 직원 승인
│   ├── PermissionManagement.tsx # 권한 관리
│   ├── Settings.tsx       # 설정
│   └── Sidebar.tsx        # 사이드바
├── lib/                   # 유틸리티 및 타입
│   ├── authStore.ts       # 인증 상태 관리
│   └── types.ts           # TypeScript 타입 정의
└── README.md              # 프로젝트 문서
```

## API 연동

### 상담 예약 API
- `POST /api/appointments` - 상담 예약 생성 (SMS 알림 자동 발송)
- `GET /api/appointments/availability/:branch/:date` - 가용 시간 조회

### 콘텐츠 관리 API
- `GET /api/content` - 홈페이지 콘텐츠 조회
- `PUT /api/content/:id` - 콘텐츠 업데이트

### 지점 관리 API
- `GET /api/locations` - 지점 정보 조회
- `POST /api/locations` - 지점 추가
- `PUT /api/locations/:id` - 지점 정보 수정

### 프로그램 관리 API
- `GET /api/programs` - 프로그램 목록 조회
- `POST /api/programs` - 프로그램 추가
- `PUT /api/programs/:id` - 프로그램 수정

### 갤러리 관리 API
- `GET /api/gallery` - 이미지 목록 조회
- `POST /api/gallery` - 이미지 업로드
- `DELETE /api/gallery/:id` - 이미지 삭제

### SMS 알림 API
- `POST /api/notifications/sms` - SMS 발송

## UI/UX 특징

- **TheVida 브랜딩**: 브랜드 컬러와 로고 적용
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **직관적 인터페이스**: 사용하기 쉬운 관리자 인터페이스
- **모달 편집**: 팝업 형태의 편집 기능
- **실시간 업데이트**: 변경사항 즉시 반영

## 보안

- **접근 제어**: 키 기반 또는 이메일 기반 인증
- **권한 관리**: 역할별 메뉴 접근 제한
- **데이터 검증**: 입력 데이터 유효성 검사
- **에러 처리**: 안전한 에러 처리 및 로깅

## SMS 알림 설정

상담 예약 시 자동으로 SMS 알림을 받으려면 다음 중 하나의 SMS 서비스를 설정하세요:

### 1. 네이버 클라우드 플랫폼
- [네이버 클라우드 플랫폼](https://www.ncloud.com/) 가입
- SMS 서비스 신청 및 발신번호 등록
- 환경 변수 설정 후 `src/utils/sms.ts` 수정

### 2. 카카오톡 비즈니스
- [카카오톡 비즈니스](https://business.kakao.com/) 가입
- SMS 서비스 신청 및 발신번호 등록
- 환경 변수 설정 후 `src/utils/sms.ts` 수정

### 3. AWS SNS
- AWS 계정 생성 및 SNS 서비스 활성화
- IAM 사용자 생성 및 권한 설정
- 환경 변수 설정 후 `src/utils/sms.ts` 수정

자세한 설정 방법은 `../thevida/backend/SMS_SETUP.md` 파일을 참조하세요.

## 라이선스

MIT License

## 문의

더비다 스테이 & 케어 요양원
- 이메일: admin@thevida.co.kr
- 전화: 010-2166-9525
