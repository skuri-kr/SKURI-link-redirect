import {describe, expect, it} from 'vitest';
import {
  buildAppOpenUrl,
  buildCustomSchemeUrl,
  buildHandoffLinkUrl,
  buildPublicLinkUrl,
  parseLinkRoute,
} from './linkRoutes';

describe('parseLinkRoute', () => {
  it.each([
    ['/notice/2nfkA1', {kind: 'notice', id: '2nfkA1'}],
    ['/cafeteria', {kind: 'cafeteria'}],
    ['/board/2hgka1', {kind: 'board', id: '2hgka1'}],
  ])('%s를 앱 라우트로 해석한다', (pathname, expected) => {
    expect(parseLinkRoute(pathname)).toEqual(expected);
  });

  it.each([
    '/',
    '/notice',
    '/notice/a/b',
    '/notice/%2Fetc',
    '/board/id.with.dot',
    '/cafeteria/2026-08-27',
    '/timetable/123',
  ])('%s를 지원하지 않는 경로로 처리한다', pathname => {
    expect(parseLinkRoute(pathname)).toEqual({kind: 'unsupported'});
  });
});

describe('HTTPS 링크 생성', () => {
  it('공개 공유 주소와 앱 handoff 주소에 같은 경로를 보존한다', () => {
    const route = {kind: 'notice', id: 'ab_CD-12'} as const;

    expect(buildPublicLinkUrl(route)).toBe(
      'https://link.skuri.kr/notice/ab_CD-12',
    );
    expect(buildHandoffLinkUrl(route)).toBe(
      'https://open.skuri.kr/notice/ab_CD-12',
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
      buildAppOpenUrl({kind: 'notice', id: '2nfkA1'}, 'link.skuri.kr'),
    ).toBe('https://open.skuri.kr/notice/2nfkA1');
  });

  it('handoff 웹페이지에서는 custom scheme으로 한 번 더 시도한다', () => {
    expect(
      buildAppOpenUrl({kind: 'notice', id: '2nfkA1'}, 'open.skuri.kr'),
    ).toBe('skuri://open?target=notice&id=2nfkA1');
  });
});

describe('buildCustomSchemeUrl', () => {
  it('공지 ID를 앱 실행 URL에 보존한다', () => {
    expect(buildCustomSchemeUrl({kind: 'notice', id: 'ab_CD-12'})).toBe(
      'skuri://open?target=notice&id=ab_CD-12',
    );
  });

  it('학식은 날짜 없이 앱 실행 URL을 만든다', () => {
    expect(buildCustomSchemeUrl({kind: 'cafeteria'})).toBe('skuri://open?target=cafeteria');
  });

  it('지원하지 않는 경로에는 앱 실행 URL을 만들지 않는다', () => {
    expect(buildCustomSchemeUrl({kind: 'unsupported'})).toBeNull();
  });
});
