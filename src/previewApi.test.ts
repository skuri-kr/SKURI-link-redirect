import {describe, expect, it, vi} from 'vitest';
import {fetchPreview, PreviewApiError} from './previewApi';

describe('fetchPreview', () => {
  it('공지 짧은 코드로 공개 미리보기 API를 호출한다', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({
      success: true,
      data: {code: '7Kp3mQxA', title: '공지', blocks: [], truncated: false},
    }), {status: 200, headers: {'Content-Type': 'application/json'}}));

    const preview = await fetchPreview({kind: 'notice', code: '7Kp3mQxA'}, fetcher as typeof fetch);

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.skuri.kr/v1/share-links/notice/7Kp3mQxA/preview',
      {credentials: 'omit', headers: {Accept: 'application/json'}},
    );
    expect(preview).toMatchObject({kind: 'notice', code: '7Kp3mQxA', title: '공지'});
  });

  it('삭제되었거나 없는 공유 링크의 404를 보존한다', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({
      success: false,
      errorCode: 'SHARE_LINK_NOT_FOUND',
      message: '공유 링크를 찾을 수 없습니다.',
    }), {status: 404, headers: {'Content-Type': 'application/json'}}));

    await expect(fetchPreview({kind: 'board', code: '5Rm2Qn8B'}, fetcher as typeof fetch))
      .rejects.toEqual(expect.objectContaining<Partial<PreviewApiError>>({
        status: 404,
        errorCode: 'SHARE_LINK_NOT_FOUND',
      }));
  });

  it('지원하지 않는 경로는 API를 호출하지 않는다', async () => {
    const fetcher = vi.fn();
    await expect(fetchPreview({kind: 'unsupported'}, fetcher as typeof fetch)).resolves.toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
