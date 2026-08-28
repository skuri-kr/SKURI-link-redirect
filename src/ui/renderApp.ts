import {
  APP_STORE_URL,
  buildAppOpenUrl,
  buildPublicLinkUrl,
  parseLinkRoute,
  PLAY_STORE_URL,
} from '../linkRoutes';
import {getRoutePresentation} from '../routePresentation';
import {appleIcon, arrowIcon, iconSvg, playIcon} from './icons';

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    character =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'})[character] ?? character,
  );

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
  if (!copied) {
    throw new Error('클립보드 복사를 지원하지 않습니다.');
  }
};

export const renderApp = (
  root: HTMLDivElement,
  location: Pick<Location, 'hostname' | 'pathname'>,
): void => {
  const route = parseLinkRoute(location.pathname);
  const presentation = getRoutePresentation(route);
  const publicLinkUrl = buildPublicLinkUrl(route);
  const primaryActionUrl = buildAppOpenUrl(route, location.hostname);

  document.title = `${presentation.eyebrow} | 스쿠리`;

  root.innerHTML = `
    <div class="page-shell">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <header class="brand-header" aria-label="스쿠리">
        <a class="brand" href="/" aria-label="스쿠리 홈">
          <img src="/assets/skuri-app-icon.png" width="40" height="40" alt="" />
          <span>SKURI</span>
        </a>
        <span class="brand-caption">성결대 캠퍼스 앱</span>
      </header>

      <main class="content">
        <section class="link-card" aria-labelledby="page-title">
          <div class="route-icon route-icon-${presentation.icon}">${iconSvg(presentation.icon)}</div>
          <p class="eyebrow">${escapeHtml(presentation.eyebrow)}</p>
          <h1 id="page-title">${escapeHtml(presentation.title)}</h1>
          <p class="description">${escapeHtml(presentation.description)}</p>

          <div class="actions">
            ${
              primaryActionUrl
                ? `<a class="primary-action" href="${escapeHtml(primaryActionUrl)}">
                    <span>스쿠리 앱에서 열기</span>${arrowIcon}
                  </a>`
                : ''
            }
            ${
              publicLinkUrl
                ? `<button class="secondary-action" type="button" data-copy-link>
                    링크 복사
                  </button>
                  <p class="copy-feedback" data-copy-feedback aria-live="polite"></p>`
                : ''
            }
            <p class="store-guide">앱이 설치되어 있지 않나요?</p>
            <div class="store-actions">
              <a class="store-action" href="${APP_STORE_URL}" rel="noopener noreferrer">
                ${appleIcon}<span><small>Download on the</small>App Store</span>
              </a>
              <a class="store-action" href="${PLAY_STORE_URL}" rel="noopener noreferrer">
                ${playIcon}<span><small>GET IT ON</small>Google Play</span>
              </a>
            </div>
          </div>
        </section>

        <p class="browser-note">
          일부 앱 안의 브라우저에서는 앱 실행이 제한될 수 있어요.<br />
          반응이 없다면 링크를 복사하거나 브라우저 메뉴에서 Safari·Chrome으로 열어 주세요.
        </p>
      </main>

      <footer>
        <span>성결대학교 학생을 위한 올인원 캠퍼스 앱</span>
        <span aria-hidden="true">·</span>
        <strong>SKURI</strong>
      </footer>
    </div>
  `;

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
};
