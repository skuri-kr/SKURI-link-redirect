# SKURI Link

`link.skuri.kr`의 Universal Links(iOS), App Links(Android), 웹 fallback 페이지를 제공하는 정적 웹 프로젝트입니다.

## 지원 경로

| URL | 앱 화면 |
| --- | --- |
| `/notice/{id}` | 학교 공지 상세 |
| `/cafeteria` | 이번 주 학식 |
| `/board/{id}` | 커뮤니티 게시글 상세 |

운영 URL을 지원하는 앱이 설치되어 있으면 OS가 앱을 직접 엽니다. 앱을 열 수 없는 브라우저에서는 웹 fallback이 표시되며, 사용자가 앱 열기 또는 스토어 이동을 직접 선택합니다.

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
- 사용자 도메인: `link.skuri.kr`

운영 배포 후 다음 파일은 리다이렉트 없이 `200 OK`, `application/json`으로 응답해야 합니다.

- `https://link.skuri.kr/.well-known/apple-app-site-association`
- `https://link.skuri.kr/.well-known/assetlinks.json`

## 확장 방법

새 공유 경로는 아래 세 곳을 함께 수정합니다.

1. `src/linkRoutes.ts`의 경로 파서와 custom scheme 변환
2. `public/.well-known/apple-app-site-association`의 허용 경로
3. `public/_redirects`의 Cloudflare Pages fallback 경로

앱 라우팅 지원이 함께 배포되기 전에 웹 검증 파일에 새 경로를 먼저 선언하지 않습니다.

## 개인정보

이 사이트는 공지·게시글의 제목이나 본문을 조회하지 않으며 방문 분석 도구도 사용하지 않습니다. 공유 URL에는 화면 이동에 필요한 식별자만 포함합니다.
