import {describe, expect, it} from 'vitest';
import {renderPreviewMarkup} from './previewMarkup';

describe('renderPreviewMarkup', () => {
  it('공지를 앱 상세 형태로 렌더링하고 모든 문자열을 escape한다', () => {
    const html = renderPreviewMarkup({
      kind: 'notice',
      code: '7Kp3mQxA',
      title: '<script>제목</script>',
      category: '학사',
      blocks: [
        {type: 'TEXT', text: '<img src=x onerror=alert(1)>', truncated: false},
        {
          type: 'TABLE',
          rows: [{cells: [{text: '<b>구분</b>', header: true, rowSpan: 99, colSpan: 99}]}],
          truncated: true,
        },
      ],
      truncated: true,
    });

    expect(html).toContain('&lt;script&gt;제목&lt;/script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('rowspan="4" colspan="5"');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>구분</b>');
  });

  it('익명 게시물에는 공개 projection 필드만 렌더링한다', () => {
    const html = renderPreviewMarkup({
      kind: 'board',
      code: '5Rm2Qn8B',
      title: '공유 게시물',
      category: 'GENERAL',
      author: '익명',
      content: '게시물 일부 내용',
      truncated: false,
    });

    expect(html).toContain('공유 게시물');
    expect(html).toContain('익명');
    expect(html).toContain('게시물 일부 내용');
    expect(html).toContain('커뮤니티 · 자유');
  });

  it('공지 이미지 비율은 CSP가 허용하는 width와 height 속성으로 보존한다', () => {
    const html = renderPreviewMarkup({
      kind: 'notice',
      code: '7Kp3mQxA',
      title: '이미지 공지',
      blocks: [{
        type: 'IMAGE',
        imageUrl: 'https://www.sungkyul.ac.kr/image.png',
        alt: '공지 이미지',
        aspectRatio: 2,
        truncated: false,
      }],
      truncated: false,
    });

    expect(html).toContain('width="1000" height="500"');
    expect(html).not.toContain('style=');
  });

  it('학식 날짜는 방문자 위치와 무관하게 서울 날짜로 표시한다', () => {
    const html = renderPreviewMarkup({
      kind: 'cafeteria',
      weekId: '2026-W35',
      weekStart: '2026-08-24',
      weekEnd: '2026-08-30',
      categories: [],
      days: {'2026-08-24': {}},
    });

    expect(html).toContain('8. 24. (월)');
  });
});
