import {APP_STORE_URL, buildCustomSchemeUrl, parseLinkRoute, PLAY_STORE_URL} from '../linkRoutes';
import {getRoutePresentation} from '../routePresentation';
import {appleIcon, arrowIcon, iconSvg, playIcon} from './icons';

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>'"]/g,
    character =>
      ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'})[character] ?? character,
  );

export const renderApp = (root: HTMLDivElement, location: Pick<Location, 'pathname'>): void => {
  const route = parseLinkRoute(location.pathname);
  const presentation = getRoutePresentation(route);
  const customSchemeUrl = buildCustomSchemeUrl(route);

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
              customSchemeUrl
                ? `<a class="primary-action" href="${escapeHtml(customSchemeUrl)}">
                    <span>스쿠리 앱에서 열기</span>${arrowIcon}
                  </a>`
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
          일부 앱 안의 브라우저에서는 자동 실행이 제한될 수 있어요.<br />
          이 경우 위 버튼을 누르거나 Safari·Chrome에서 열어 주세요.
        </p>
      </main>

      <footer>
        <span>성결대학교 학생을 위한 올인원 캠퍼스 앱</span>
        <span aria-hidden="true">·</span>
        <strong>SKURI</strong>
      </footer>
    </div>
  `;
};
