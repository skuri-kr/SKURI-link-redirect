export const APP_STORE_URL = 'https://apps.apple.com/app/id6754636203';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.jisung.sktaxi';

const SAFE_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;

export type LinkRoute =
  | {kind: 'notice'; id: string}
  | {kind: 'cafeteria'}
  | {kind: 'board'; id: string}
  | {kind: 'unsupported'};

const decodeSegment = (segment: string): string | null => {
  try {
    const decoded = decodeURIComponent(segment);
    return decoded.length > 0 && decoded.length <= 160 && SAFE_SEGMENT_PATTERN.test(decoded)
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
    const id = decodeSegment(segments[1]);
    if (id) {
      return {kind: segments[0], id};
    }
  }

  return {kind: 'unsupported'};
};

export const buildCustomSchemeUrl = (route: LinkRoute): string | null => {
  const url = new URL('skuri://open');

  switch (route.kind) {
    case 'notice':
      url.searchParams.set('target', 'notice');
      url.searchParams.set('id', route.id);
      break;
    case 'cafeteria':
      url.searchParams.set('target', 'cafeteria');
      break;
    case 'board':
      url.searchParams.set('target', 'board');
      url.searchParams.set('id', route.id);
      break;
    case 'unsupported':
      return null;
  }

  return url.toString();
};
