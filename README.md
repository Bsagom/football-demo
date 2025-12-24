# ⚽ Football Match Viewer

실시간 축구 경기 정보를 확인할 수 있는 React 웹 애플리케이션입니다. Football-data.org API를 활용하여 유럽 5대리그와 UEFA 챔피언스리그의 경기 일정, 스코어, 라인업, 골/어시스트 정보를 제공합니다.

![Football Match Viewer](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ 주요 기능

### 🏆 리그 선택
- UEFA Champions League
- Premier League (영국)
- La Liga (스페인)
- Bundesliga (독일)
- Serie A (이탈리아)
- Ligue 1 (프랑스)

### 📅 날짜 네비게이션
- 캘린더 클릭으로 원하는 날짜 선택
- 이전/다음 날짜 탐색
- "오늘" 버튼으로 빠른 복귀

### ⚡ 경기 정보
- 실시간 스코어 및 경기 상태
- 팀별 라인업 (4-3-3 포메이션 뷰)
- 골 득점자 및 어시스트 정보
- 경고/퇴장 카드 정보

### 💾 스마트 캐싱
- localStorage를 활용한 5분 캐싱
- API 호출 횟수 최소화
- 빠른 데이터 로딩

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크

### UI Components
- **lucide-react** - 아이콘 라이브러리
- 커스텀 컴포넌트:
  - `MatchCard` - 경기 카드
  - `PitchView` - 축구장 라인업 뷰
  - `LeagueSelector` - 리그 선택
  - `LoadingSpinner` - 로딩 표시

### API & Data
- **Football-data.org API v4** - 축구 데이터
- **localStorage** - 클라이언트 캐싱 (5분 TTL)
- **Vite Proxy** - CORS 처리

## 🚀 실행 방법

### 1. 사전 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 2. 설치
```bash
# 저장소 클론
git clone <repository-url>
cd Demo3

# 의존성 설치
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 루트 디렉토리에 생성하고 API 키를 설정합니다:

```env
VITE_FOOTBALL_API_KEY=your_api_key_here
```

> 💡 **API 키 발급**: [Football-data.org](https://www.football-data.org/)에서 무료 API 키를 발급받으세요.

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5176` 접속

### 5. 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 📁 프로젝트 구조

```
Demo3/
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── MatchCard.tsx
│   │   ├── PitchView.tsx
│   │   ├── LeagueSelector.tsx
│   │   └── LoadingSpinner.tsx
│   ├── api/              # API 호출 함수
│   │   └── football.ts
│   ├── types/            # TypeScript 타입
│   │   └── index.ts
│   ├── utils/            # 유틸리티 함수
│   │   └── cache.ts
│   ├── App.tsx           # 메인 앱
│   ├── main.tsx          # 엔트리 포인트
│   └── index.css         # 글로벌 스타일
├── public/               # 정적 파일
├── .env                  # 환경 변수
├── vite.config.js        # Vite 설정
└── package.json          # 의존성
```

## 🎯 사용 방법

1. **리그 선택**: 드롭다운에서 원하는 리그 선택
2. **날짜 선택**: 
   - 캘린더 아이콘 클릭하여 날짜 선택
   - ◀ ▶ 버튼으로 전/후 날짜 이동
   - "오늘" 버튼으로 현재 날짜로 복귀
3. **경기 탐색**: ◀ ▶ 버튼으로 경기 간 이동
4. **상세 정보**: 경기 카드 클릭하여 라인업, 골, 카드 정보 확인

## ⚠️ API 제한 사항

Football-data.org 무료 플랜 제약:
- **분당 10회** 요청 제한
- 일부 경기의 라인업 정보 제한
- 과거 경기 데이터 제한

**해결책**:
- localStorage 캐싱 (5분) 으로 API 호출 최소화
- 429 에러 발생 시 20-30초 대기 후 재시도

## 🔧 디버깅

브라우저 콘솔(F12)에서 사용 가능한 함수:

```javascript
// 캐시 확인
showCache()

// 캐시 삭제
clearCache()

// 특정 경기 상세 정보 확인
showMatchDetail(matchId)
```

## 📝 주요 기능 구현

### 캐싱 시스템
```typescript
// 5분 TTL 캐싱
const CACHE_DURATION = 5 * 60 * 1000;

// 캐시 저장
localStorage.setItem(cacheKey, JSON.stringify({
    data: matches,
    timestamp: Date.now()
}));

// 캐시 조회 및 만료 확인
if (age < CACHE_DURATION) {
    return cachedData;
}
```

### 날짜 네비게이션
- HTML5 `<input type="date">` + `showPicker()` API
- 브라우저 네이티브 캘린더 UI

## 🤝 기여

프로젝트에 기여를 환영합니다! 이슈나 Pull Request를 자유롭게 제출해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🙏 감사의 말

- [Football-data.org](https://www.football-data.org/) - 축구 데이터 API 제공
- [Lucide](https://lucide.dev/) - 아이콘 제공

---

**Made with ⚽ and ❤️**
