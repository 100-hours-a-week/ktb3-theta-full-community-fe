# Community (Frontend)

- 커뮤니티 웹 애플리케이션 서비스의 Vite 기반 React
- 정적 HTML/CSS + 바닐라 ES 모듈 버전은 `legacy/` 내에 존재

## 기술 스택

- React 19, Vite, React Router DOM 7
- TanStack Query 5 + Axios로 Spring Boot 백엔드(`http://localhost:8080`) 호출
- 쿠키 기반 인증, Axios 인터셉터로 토큰 만료 시 리프레시 후 재요청
- CSS Modules + 전역 스타일 시트 구성
- (Legacy) HTML, CSS, JavaScript(ES Modules) + 브라우저 `fetch` 호출

## 주요 기능 / 특징

- 회원가입/로그인/로그아웃 및 프로필/비밀번호 변경
- 게시글 목록/상세 조회, 작성/수정/삭제, 페이지네이션
- 댓글 작성/수정/삭제 및 좋아요 토글, 게시글별 카운트 반영
- 비로그인 접근 시 로그인 페이지로 리다이렉트

## 시연 영상

- 추가 예정

## 프로젝트 구조

```
ktb3-theta-full-community-fe/
 ㄴ src/
    ㄴ api/            # Axios 클라이언트, 도메인별 API 모듈, React Query 클라이언트
    ㄴ components/     # 레이아웃, 공용 컴포넌트(헤더/푸터/토스트 등)
    ㄴ contexts/       # 전역 컨텍스트 (예: 사용자 상태)
    ㄴ features/       # 도메인별 훅/컴포넌트(articles/auth/comments/likes/users)
    ㄴ hooks, lib, utils
    ㄴ pages/          # 라우팅 페이지 컴포넌트(Home/Login/Join/My/게시글 CRUD 등)
    ㄴ App.jsx, main.jsx, 스타일(App.css, global.css)
 ㄴ public/            # 정적 리소스
 ㄴ legacy/            # 바닐라 ES 모듈 기반 정적 버전(HTML/CSS/JS)
 ㄴ package.json, vite.config.js, eslint.config.js
```

## 학습한 내용

- 추가 예정

## 설치 및 실행 방법

1. 저장소 클론: `git clone <repo-url>`
2. 디렉터리 이동: `cd ktb3-theta-full-community-fe`
3. 패키지 설치: `npm install`
4. 로컬 개발 서버: `npm run dev` 후 Vite가 안내한 주소로 접속 (백엔드 `http://localhost:8080` 가동 필요)
5. 프로덕션 번들: `npm run build` (빌드 산출물은 `dist/`)
6. (Legacy 정적 버전) `npm install -g http-server` 후 `http-server legacy -p 5500` 로 기존 바닐라 버전 확인 가능
