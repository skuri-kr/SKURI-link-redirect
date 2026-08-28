import {describe, expect, it} from 'vitest';
import {PreviewApiError} from '../previewApi';
import {isMissingShareLinkError, renderLoading} from './renderApp';

describe('renderApp helpers', () => {
  it('API의 공유링크없음오류만 만료된 링크로 분류한다', () => {
    expect(isMissingShareLinkError(
      new PreviewApiError('없음', 404, 'SHARE_LINK_NOT_FOUND'),
    )).toBe(true);
    expect(isMissingShareLinkError(
      new PreviewApiError('라우팅 오류', 404),
    )).toBe(false);
    expect(isMissingShareLinkError(
      new PreviewApiError('학식 없음', 404, 'CAFETERIA_MENU_NOT_FOUND'),
    )).toBe(false);
  });

  it('로딩상태도 section의 접근성제목을 제공한다', () => {
    expect(renderLoading()).toContain('id="page-title"');
    expect(renderLoading()).toContain('미리보기 불러오는 중');
  });
});
