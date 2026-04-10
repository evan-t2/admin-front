# CLAUDE.md

## Project Overview

카모아 운영툴(admin) 프론트엔드. 백엔드(`admin-spring`)와 분리된 SPA.
기존 PHP 어드민(CodeIgniter + jQuery)을 Vue로 마이그레이션하는 사이드 프로젝트.

- **백엔드**: `admin-spring/` (Spring Boot 3.4.4, Java 21)
- **기존 어드민**: `admin/` (PHP 7.2 + CodeIgniter 3.1.5)
- **GitHub**: evan-t2/admin-front

## Tech Stack

- Vue 3 + TypeScript
- Element Plus (UI 컴포넌트) + 한국어 locale
- Pinia (상태관리)
- Vue Router
- Axios

## Commands

```bash
npm run dev        # 개발 서버 (Vite)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과물 미리보기
```

## 프로젝트 구조

```
src/
├── api/
│   └── index.ts              # axios 설정 (JWT 자동 주입, 401/403 처리)
├── layouts/
│   └── DefaultLayout.vue     # 사이드바 + 메인 레이아웃
├── stores/
│   └── auth.ts               # 로그인/로그아웃, token 관리
├── router/
│   └── index.ts              # 라우팅 + 인증 가드
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── notice/
│   ├── faq/
│   └── content/          # 포스트탭, MD추천, 게시판
├── App.vue
└── main.ts
```

## 현재 완료된 것

- 로그인 페이지 + JWT 인증 흐름
- 사이드바 메뉴 16개 그룹 (기존 PHP와 동일 순서/구조)
  - 호텔모아 바로가기, 즐겨찾는 메뉴 (localStorage 기반), 권한 설정(TODO), 로그아웃
  - 하위 메뉴 구분선 (divider), 메뉴 검색, 검색 시 자동 펼침
  - 즐겨찾기 별 아이콘 토글, 즐겨찾기 섹션 배경색 구분
- 공지사항 CRUD (목록/등록/수정/삭제 + 선택 노출/숨김)
- FAQ 관리 (카테고리 트리 + 질문 CRUD)
- 팀 관리 CRUD (다이얼로그)
- 어드민 관리 CRUD (폼 페이지)
- MD 추천 CRUD (다이얼로그)
- 포스트탭 목록/등록/수정 화면
- 대시보드 화면 (ECharts 차트 + 통계 테이블)
- 게시판 목록/상세/등록수정 화면 + 댓글 기능
- 비밀번호 변경
- 403 권한 오류 → 경고 다이얼로그 + 이전 페이지 이동 (중복 방지)
- PageContainer 공통 컴포넌트 (제목 + 구분선 + 컨텐츠 통일)

## 다음에 할 것

- 백엔드 API 추가에 맞춰 프론트 화면 순차 구현
- 권한 설정 모달 (마스터 전용)

## 백엔드 API

- Base URL: `http://localhost:8080` (개발)
- `.env.development`에서 `VITE_API_URL` 설정
- 모든 API 요청에 `Authorization: Bearer {token}` 자동 주입

## 기존 PHP와 맞추기

- 사이드바 메뉴 순서/구조는 기존 PHP 어드민(`admin/web/application/views/head.php`)과 동일하게 유지
- API 응답은 camelCase (프론트에서 맞춤)
- 기존에 없는 기능을 임의로 추가하지 않음

## Git Convention

- admin-spring과 동일한 컨벤션 사용
- 형식: `${TYPE}: (${ISSUE_NUMBER} | NONE) ${TITLE}`
- prod 브랜치에 직접 커밋

## 작업 방식

- 학습 목적 포함 (Vue + TypeScript 연습)
- 화면 레이아웃/구조는 자동 생성 OK
- API 연동 로직은 사용자가 직접 구현, 막히면 도움
