import type {
  BoardPreview,
  CafeteriaPreview,
  ContentPreview,
  NoticePreview,
  PreviewBlock,
} from './previewApi';

export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    character =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'})[character] ?? character,
  );

const formatDate = (value?: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const renderMeta = (items: Array<string | null | undefined>): string => {
  const visible = items.filter((item): item is string => Boolean(item));
  return visible.length
    ? `<div class="preview-meta">${visible.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
    : '';
};

const boundedSpan = (value: number, max: number): number =>
  Number.isInteger(value) ? Math.min(Math.max(value, 1), max) : 1;

const renderNoticeBlock = (block: PreviewBlock): string => {
  switch (block.type) {
    case 'TEXT':
      return `<p class="notice-text">${escapeHtml(block.text)}</p>`;
    case 'IMAGE': {
      const dimensions = block.aspectRatio && block.aspectRatio > 0
        ? ` width="1000" height="${Math.round(1000 / Math.min(Math.max(block.aspectRatio, 0.4), 3))}"`
        : '';
      return `<figure class="notice-image"><img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.alt ?? '')}"${dimensions} loading="lazy" referrerpolicy="no-referrer" /></figure>`;
    }
    case 'TABLE':
      return `<div class="notice-table-scroll"><table class="notice-table"><tbody>${block.rows
        .map(
          row =>
            `<tr>${row.cells
              .map(cell => {
                const tag = cell.header ? 'th' : 'td';
                return `<${tag} rowspan="${boundedSpan(cell.rowSpan, 4)}" colspan="${boundedSpan(cell.colSpan, 5)}">${escapeHtml(cell.text)}</${tag}>`;
              })
              .join('')}</tr>`,
        )
        .join('')}</tbody></table></div>`;
  }
};

const renderNotice = (preview: NoticePreview): string => `
  <article class="detail-preview notice-preview">
    <p class="detail-kicker">학교 공지</p>
    <h1 id="page-title">${escapeHtml(preview.title)}</h1>
    ${renderMeta([preview.category, preview.department, preview.author, formatDate(preview.postedAt)])}
    <div class="detail-divider"></div>
    <div class="notice-blocks">${preview.blocks.map(renderNoticeBlock).join('')}</div>
  </article>`;

const BOARD_CATEGORY_LABELS: Record<string, string> = {
  GENERAL: '자유',
  QUESTION: '질문',
  REVIEW: '후기',
  ANNOUNCEMENT: '공지',
};

const renderBoard = (preview: BoardPreview): string => `
  <article class="detail-preview board-preview">
    <p class="detail-kicker">커뮤니티 · ${escapeHtml(BOARD_CATEGORY_LABELS[preview.category] ?? preview.category)}</p>
    <h1 id="page-title">${escapeHtml(preview.title)}</h1>
    ${renderMeta([preview.author, formatDate(preview.createdAt)])}
    <div class="detail-divider"></div>
    <p class="board-content">${escapeHtml(preview.content)}</p>
  </article>`;

const weekdayLabel = (dateValue: string): string => {
  const date = new Date(`${dateValue}T12:00:00+09:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'Asia/Seoul',
  }).format(date);
};

const renderCafeteria = (preview: CafeteriaPreview): string => {
  const days = Object.entries(preview.days)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, categories]) => {
      const menus = preview.categories
        .flatMap(category =>
          (categories[category.code] ?? []).map(
            menu => `<div class="menu-entry">
              <span class="menu-category">${escapeHtml(category.label)}</span>
              <div><strong>${escapeHtml(menu.title)}</strong>${menu.badges
                .map(badge => `<small>${escapeHtml(badge.label)}</small>`)
                .join('')}</div>
            </div>`,
          ),
        )
        .join('');
      return `<section class="menu-day"><h2>${escapeHtml(weekdayLabel(date))}</h2>${menus || '<p class="empty-menu">등록된 메뉴가 없어요.</p>'}</section>`;
    })
    .join('');

  return `<article class="detail-preview cafeteria-preview">
    <p class="detail-kicker">이번 주 학식</p>
    <h1 id="page-title">성결대학교 학식 메뉴</h1>
    ${renderMeta([`${preview.weekStart} — ${preview.weekEnd}`])}
    <div class="detail-divider"></div>
    <div class="menu-days">${days || '<p class="empty-menu">이번 주 등록된 메뉴가 없어요.</p>'}</div>
  </article>`;
};

export const renderPreviewMarkup = (preview: ContentPreview): string => {
  switch (preview.kind) {
    case 'notice':
      return renderNotice(preview);
    case 'board':
      return renderBoard(preview);
    case 'cafeteria':
      return renderCafeteria(preview);
  }
};
