export const APP_STORE_URL = 'https://apps.apple.com/app/id6754636203';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jisung.sktaxi';
export const PUBLIC_LINK_ORIGIN = 'https://link.skuri.kr';
export const HANDOFF_LINK_ORIGIN = 'https://open.skuri.kr';
export const HANDOFF_LINK_HOST = 'open.skuri.kr';

const SHARE_CODE_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{8}$/;

export type LinkRoute =
  | {kind: 'notice'; code: string}
  | {kind: 'cafeteria'}
  | {kind: 'board'; code: string}
  | {kind: 'unsupported'};

const decodeSegment = (segment: string): string | null => {
  try {
    const decoded = decodeURIComponent(segment);
    return SHARE_CODE_PATTERN.test(decoded)
      ? decoded
      : null;
  } catch {
    return null;
  }
};

export const parseLinkRoute = (pathname: string): LinkRoute => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 1 && segments[0] === 'cafeteria') {
    return {kind: 'cafeteria'};
  }

  if (segments.length === 2 && (segments[0] === 'notice' || segments[0] === 'board')) {
    const code = decodeSegment(segments[1]);
    if (code) {
      return {kind: segments[0], code};
    }
  }

  return {kind: 'unsupported'};
};

const buildRoutePath = (route: LinkRoute): string | null => {
  switch (route.kind) {
    case 'notice':
      return `/notice/${route.code}`;
    case 'cafeteria':
      return '/cafeteria';
    case 'board':
      return `/board/${route.code}`;
    case 'unsupported':
      return null;
  }
};

const buildHttpsUrl = (origin: string, route: LinkRoute): string | null => {
  const path = buildRoutePath(route);
  return path ? `${origin}${path}` : null;
};

export const buildPublicLinkUrl = (route: LinkRoute): string | null =>
  buildHttpsUrl(PUBLIC_LINK_ORIGIN, route);

export const buildHandoffLinkUrl = (route: LinkRoute): string | null =>
  buildHttpsUrl(HANDOFF_LINK_ORIGIN, route);

export const buildCustomSchemeUrl = (route: LinkRoute): string | null => {
  const url = new URL('skuri://open');

  switch (route.kind) {
    case 'notice':
      url.searchParams.set('target', 'notice');
      url.searchParams.set('id', route.code);
      break;
    case 'cafeteria':
      url.searchParams.set('target', 'cafeteria');
      break;
    case 'board':
      url.searchParams.set('target', 'board');
      url.searchParams.set('id', route.code);
      break;
    case 'unsupported':
      return null;
  }

  return url.toString();
};

export const buildAppOpenUrl = (
  route: LinkRoute,
  currentHostname: string,
): string | null =>
  currentHostname === HANDOFF_LINK_HOST
    ? buildCustomSchemeUrl(route)
    : buildHandoffLinkUrl(route);

export const buildAndroidIntentUrl = (route: LinkRoute): string | null => {
  const customSchemeUrl = buildCustomSchemeUrl(route);
  if (!customSchemeUrl) {
    return null;
  }

  const intentTarget = customSchemeUrl.replace(/^skuri:\/\//, 'intent://');
  return `${intentTarget}#Intent;scheme=skuri;package=com.jisung.sktaxi;S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
};
