# SKURI Link

`link.skuri.kr`과 `open.skuri.kr`의 Universal Links(iOS), App Links(Android), 웹 fallback 페이지를 제공하는 정적 웹 프로젝트입니다.

- `link.skuri.kr`: 사용자가 공유하는 공개 URL
- `open.skuri.kr`: 웹 fallback의 `스쿠리 앱에서 열기` 버튼이 사용하는 HTTPS handoff URL

Safari는 현재 페이지와 같은 도메인의 Universal Link를 웹 탐색으로 유지할 수 있으므로 앱 실행 버튼만 별도 subdomain을 사용합니다. 제3자 인앱 브라우저가 외부 앱 실행을 차단하면 링크 복사와 외부 브라우저 안내를 fallback으로 제공합니다.

## 지원 경로

| URL | 앱 화면 |
| --- | --- |
| `/notice/{code}` | 학교 공지 상세 |
| `/cafeteria` | 이번 주 학식 |
| `/board/{code}` | 커뮤니티 게시글 상세 |

운영 URL을 지원하는 앱이 설치되어 있으면 OS가 앱을 직접 엽니다. 앱을 열 수 없는 브라우저에서는 웹 fallback이 표시되며, 사용자가 앱 열기 또는 스토어 이동을 직접 선택합니다.

`code`는 백엔드가 발급하는 혼동 문자 없는 Base58 8자리입니다. 기존 Base64/원본 ID 형태의 긴 URL은 지원하지 않습니다. 앱을 설치한 뒤 원래 콘텐츠까지 자동 복원하는 deferred deep link도 제공하지 않습니다.

## 공개 미리보기

- 학교 공지는 제목·메타데이터와 제한된 텍스트, 허용된 HTTPS 이미지 1장, 구조화된 표 1개를 앱 상세 화면에 가까운 형태로 렌더링합니다.
- 게시물은 익명 안전 작성자명과 잘린 텍스트만 렌더링하며 이미지·댓글·반응 수·내부 작성자 ID를 노출하지 않습니다.
- 학식은 `Asia/Seoul` 기준 이번 주 메뉴만 표시합니다.
- 웹은 raw 공지 HTML을 렌더링하지 않고 백엔드의 제한된 공개 projection만 사용합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm test
npm run build
```

## 배포

GitHub `main` 브랜치를 Cloudflare Pages와 연결합니다.

- 빌드 명령: `npm run build`
- 출력 디렉터리: `dist`
- 사용자 도메인: `link.skuri.kr`, `open.skuri.kr`

운영 배포 후 다음 파일은 리다이렉트 없이 `200 OK`, `application/json`으로 응답해야 합니다.

- `https://link.skuri.kr/.well-known/apple-app-site-association`
- `https://link.skuri.kr/.well-known/assetlinks.json`
- `https://open.skuri.kr/.well-known/apple-app-site-association`
- `https://open.skuri.kr/.well-known/assetlinks.json`

## 확장 방법

새 공유 경로는 아래 세 곳을 함께 수정합니다.

1. `src/linkRoutes.ts`의 경로 파서와 공개·handoff·custom scheme URL 변환
2. `public/.well-known/apple-app-site-association`의 허용 경로
3. `public/_redirects`의 Cloudflare Pages fallback 경로

앱 라우팅 지원이 함께 배포되기 전에 웹 검증 파일에 새 경로를 먼저 선언하지 않습니다.

## 개인정보

이 사이트는 공개 미리보기에 필요한 제한된 콘텐츠만 `api.skuri.kr`에서 조회하며 방문 분석 도구를 사용하지 않습니다. 공유 URL에는 원본 ID 대신 무작위 8자리 코드만 포함합니다.
