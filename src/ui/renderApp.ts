import {
  APP_STORE_URL,
  buildAndroidIntentUrl,
  buildHandoffLinkUrl,
  buildPublicLinkUrl,
  HANDOFF_LINK_HOST,
  parseLinkRoute,
  PLAY_STORE_URL,
} from '../linkRoutes';
import {fetchPreview, PreviewApiError} from '../previewApi';
import {escapeHtml, renderPreviewMarkup} from '../previewMarkup';
import {getRoutePresentation} from '../routePresentation';
import {appleIcon, arrowIcon, playIcon} from './icons';

const copyText = async (value: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('클립보드 복사를 지원하지 않습니다.');
};

type Platform = 'ios' | 'android' | 'other';

const detectPlatform = (userAgent: string): Platform => {
  if (/android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  return 'other';
};

const renderStoreActions = (): string => `
  <p class="store-guide">앱이 설치되어 있지 않나요?</p>
  <div class="store-actions">
    <a class="store-action" href="${APP_STORE_URL}" rel="noopener noreferrer">
      ${appleIcon}<span><small>Download on the</small>App Store</span>
    </a>
    <a class="store-action" href="${PLAY_STORE_URL}" rel="noopener noreferrer">
      ${playIcon}<span><small>GET IT ON</small>Google Play</span>
    </a>
  </div>`;

const renderActions = (
  hostname: string,
  platform: Platform,
  publicLinkUrl: string | null,
  handoffUrl: string | null,
  androidIntentUrl: string | null,
): string => {
  if (hostname !== HANDOFF_LINK_HOST) {
    return `
      ${handoffUrl ? `<a class="primary-action" href="${escapeHtml(handoffUrl)}"><span>스쿠리 앱에서 전체 보기</span>${arrowIcon}</a>` : ''}
      ${publicLinkUrl ? '<button class="secondary-action" type="button" data-copy-link>링크 복사</button><p class="copy-feedback" data-copy-feedback aria-live="polite"></p>' : ''}
      ${renderStoreActions()}`;
  }

  if (platform === 'android' && androidIntentUrl) {
    return `
      <a class="primary-action" href="${escapeHtml(androidIntentUrl)}"><span>스쿠리 앱에서 전체 보기</span>${arrowIcon}</a>
      <p class="handoff-help">앱을 열 수 없으면 Play Store로 이동해요.</p>
      ${renderStoreActions()}`;
  }

  if (platform === 'ios') {
    return `
      <a class="primary-action" href="${APP_STORE_URL}" rel="noopener noreferrer"><span>App Store에서 스쿠리 받기</span>${arrowIcon}</a>
      <p class="handoff-help">앱이 설치되어 있었다면 이전 화면의 공유 링크를 Safari에서 다시 눌러 주세요.</p>
      ${publicLinkUrl ? `<a class="secondary-link" href="${escapeHtml(publicLinkUrl)}">원래 공유 링크로 돌아가기</a>` : ''}`;
  }

  return renderStoreActions();
};

export const renderLoading = (): string => `
  <article class="detail-preview preview-loading" aria-label="미리보기 불러오는 중">
    <h1 id="page-title" class="visually-hidden">미리보기 불러오는 중</h1>
    <div class="skeleton skeleton-label"></div>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-meta"></div>
    <div class="detail-divider"></div>
    <div class="skeleton skeleton-line"></div>
    <div class="skeleton skeleton-line short"></div>
    <div class="skeleton skeleton-media"></div>
  </article>`;

export const isMissingShareLinkError = (error: unknown): boolean =>
  error instanceof PreviewApiError
  && error.status === 404
  && error.errorCode === 'SHARE_LINK_NOT_FOUND';

export const renderApp = async (
  root: HTMLDivElement,
  location: Pick<Location, 'hostname' | 'pathname'>,
): Promise<void> => {
  const route = parseLinkRoute(location.pathname);
  const presentation = getRoutePresentation(route);
  const publicLinkUrl = buildPublicLinkUrl(route);
  const handoffUrl = buildHandoffLinkUrl(route);
  const androidIntentUrl = buildAndroidIntentUrl(route);
  const platform = detectPlatform(navigator.userAgent);
  const isSupported = route.kind !== 'unsupported';

  document.title = `${presentation.eyebrow} | 스쿠리`;
  root.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <header class="brand-header" aria-label="스쿠리">
        <a class="brand" href="https://link.skuri.kr" aria-label="스쿠리 홈">
          <img src="/assets/skuri-app-icon.png" width="40" height="40" alt="" />
          <span>SKURI</span>
        </a>
        <span class="brand-caption">성결대 캠퍼스 앱</span>
      </header>

      <main class="content">
        <section class="link-card ${isSupported ? 'has-preview' : 'unsupported-card'}" aria-labelledby="page-title">
          <div data-preview-slot>
            ${isSupported ? renderLoading() : `<div class="unsupported-copy"><p class="detail-kicker">${escapeHtml(presentation.eyebrow)}</p><h1 id="page-title">${escapeHtml(presentation.title)}</h1><p>${escapeHtml(presentation.description)}</p></div>`}
          </div>
          <div class="preview-fade" aria-hidden="true"></div>
          <div class="actions">
            ${renderActions(location.hostname, platform, publicLinkUrl, handoffUrl, androidIntentUrl)}
          </div>
        </section>

        <p class="browser-note">
          일부 앱 안의 브라우저에서는 자동 실행이 제한될 수 있어요.<br />
          이 경우 위 버튼을 누르거나 브라우저 메뉴에서 Safari·Chrome으로 열어 주세요.
        </p>
      </main>

      <footer><span>성결대학교 학생을 위한 올인원 캠퍼스 앱</span><span aria-hidden="true">·</span><strong>SKURI</strong></footer>
    </div>`;

  const copyButton = root.querySelector<HTMLButtonElement>('[data-copy-link]');
  const copyFeedback = root.querySelector<HTMLElement>('[data-copy-feedback]');
  if (copyButton && copyFeedback && publicLinkUrl) {
    copyButton.addEventListener('click', async () => {
      copyButton.disabled = true;
      try {
        await copyText(publicLinkUrl);
        copyFeedback.textContent = '링크를 복사했어요.';
      } catch {
        copyFeedback.textContent = '복사하지 못했어요. 브라우저 메뉴의 링크 복사를 이용해 주세요.';
      } finally {
        copyButton.disabled = false;
      }
    });
  }

  if (!isSupported) return;
  const previewSlot = root.querySelector<HTMLElement>('[data-preview-slot]');
  if (!previewSlot) return;

  try {
    const preview = await fetchPreview(route);
    if (preview) previewSlot.innerHTML = renderPreviewMarkup(preview);
  } catch (error) {
    const notFound = isMissingShareLinkError(error);
    previewSlot.innerHTML = `<div class="preview-error" role="status">
      <p class="detail-kicker">스쿠리 공유 링크</p>
      <h1 id="page-title">${notFound ? '공유 링크를 찾을 수 없어요' : '미리보기를 불러오지 못했어요'}</h1>
      <p>${notFound ? '링크가 만료된 것은 아니지만, 원본이 삭제되었거나 주소가 정확하지 않을 수 있어요.' : '잠시 후 다시 시도하거나 스쿠리 앱에서 확인해 주세요.'}</p>
    </div>`;
  }
};
