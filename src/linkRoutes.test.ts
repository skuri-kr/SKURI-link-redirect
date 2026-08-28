import {describe, expect, it} from 'vitest';
import {
  buildAppOpenUrl,
  buildAndroidIntentUrl,
  buildCustomSchemeUrl,
  buildHandoffLinkUrl,
  buildPublicLinkUrl,
  parseLinkRoute,
} from './linkRoutes';

describe('parseLinkRoute', () => {
  it.each([
    ['/notice/7Kp3mQxA', {kind: 'notice', code: '7Kp3mQxA'}],
    ['/cafeteria', {kind: 'cafeteria'}],
    ['/board/5Rm2Qn8B', {kind: 'board', code: '5Rm2Qn8B'}],
  ])('%s를 앱 라우트로 해석한다', (pathname, expected) => {
    expect(parseLinkRoute(pathname)).toEqual(expected);
  });

  it.each([
    '/',
    '/notice',
    '/notice/a/b',
    '/notice/%2Fetc',
    '/notice/2nfkA1',
    '/notice/aHR0cHM6Ly93d3cuc3VuZ2t5dWw',
    '/notice/12345670',
    '/board/id.with.dot',
    '/cafeteria/2026-08-27',
    '/timetable/123',
  ])('%s를 지원하지 않는 경로로 처리한다', pathname => {
    expect(parseLinkRoute(pathname)).toEqual({kind: 'unsupported'});
  });
});

describe('HTTPS 링크 생성', () => {
  it('공개 공유 주소와 앱 handoff 주소에 같은 경로를 보존한다', () => {
    const route = {kind: 'notice', code: '7Kp3mQxA'} as const;

    expect(buildPublicLinkUrl(route)).toBe(
      'https://link.skuri.kr/notice/7Kp3mQxA',
    );
    expect(buildHandoffLinkUrl(route)).toBe(
      'https://open.skuri.kr/notice/7Kp3mQxA',
    );
  });

  it('학식 주소에는 날짜를 추가하지 않는다', () => {
    expect(buildHandoffLinkUrl({kind: 'cafeteria'})).toBe(
      'https://open.skuri.kr/cafeteria',
    );
  });

  it('지원하지 않는 경로에는 HTTPS 링크를 만들지 않는다', () => {
    expect(buildPublicLinkUrl({kind: 'unsupported'})).toBeNull();
    expect(buildHandoffLinkUrl({kind: 'unsupported'})).toBeNull();
  });
});

describe('buildAppOpenUrl', () => {
  it('공개 웹페이지에서는 다른 subdomain의 HTTPS handoff를 사용한다', () => {
    expect(
      buildAppOpenUrl({kind: 'notice', code: '7Kp3mQxA'}, 'link.skuri.kr'),
    ).toBe('https://open.skuri.kr/notice/7Kp3mQxA');
  });

  it('handoff 웹페이지에서는 custom scheme으로 한 번 더 시도한다', () => {
    expect(
      buildAppOpenUrl({kind: 'notice', code: '7Kp3mQxA'}, 'open.skuri.kr'),
    ).toBe('skuri://open?target=notice&id=7Kp3mQxA');
  });
});

describe('buildCustomSchemeUrl', () => {
  it('공지 ID를 앱 실행 URL에 보존한다', () => {
    expect(buildCustomSchemeUrl({kind: 'notice', code: '7Kp3mQxA'})).toBe(
      'skuri://open?target=notice&id=7Kp3mQxA',
    );
  });

  it('학식은 날짜 없이 앱 실행 URL을 만든다', () => {
    expect(buildCustomSchemeUrl({kind: 'cafeteria'})).toBe('skuri://open?target=cafeteria');
  });

  it('지원하지 않는 경로에는 앱 실행 URL을 만들지 않는다', () => {
    expect(buildCustomSchemeUrl({kind: 'unsupported'})).toBeNull();
  });
});

describe('Android intent fallback', () => {
  it('앱이 없으면 Play Store로 이동할 수 있는 intent URL을 만든다', () => {
    const url = buildAndroidIntentUrl({kind: 'board', code: '5Rm2Qn8B'});

    expect(url).toContain('intent://open?target=board&id=5Rm2Qn8B#Intent;scheme=skuri');
    expect(url).toContain('package=com.jisung.sktaxi');
    expect(url).toContain('S.browser_fallback_url=https%3A%2F%2Fplay.google.com');
  });
});
