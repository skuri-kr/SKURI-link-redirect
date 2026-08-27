import {describe, expect, it} from 'vitest';
import {buildCustomSchemeUrl, parseLinkRoute} from './linkRoutes';

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
