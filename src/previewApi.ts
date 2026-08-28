import type {LinkRoute} from './linkRoutes';

export const API_ORIGIN = 'https://api.skuri.kr';

export type PreviewBlock =
  | {type: 'TEXT'; text: string; truncated: boolean}
  | {type: 'IMAGE'; imageUrl: string; alt?: string; aspectRatio?: number; truncated: boolean}
  | {
      type: 'TABLE';
      rows: Array<{
        cells: Array<{text: string; header: boolean; rowSpan: number; colSpan: number}>;
      }>;
      truncated: boolean;
    };

export type NoticePreview = {
  kind: 'notice';
  code: string;
  title: string;
  category?: string;
  department?: string;
  author?: string;
  postedAt?: string;
  blocks: PreviewBlock[];
  truncated: boolean;
};

export type BoardPreview = {
  kind: 'board';
  code: string;
  title: string;
  category: string;
  author: string;
  createdAt?: string;
  content: string;
  truncated: boolean;
};

export type CafeteriaPreview = {
  kind: 'cafeteria';
  weekId: string;
  weekStart: string;
  weekEnd: string;
  categories: Array<{code: string; label: string}>;
  days: Record<
    string,
    Record<string, Array<{title: string; badges: Array<{code: string; label: string}>}>>
  >;
};

export type ContentPreview = NoticePreview | BoardPreview | CafeteriaPreview;

type ApiResponse<T> = {success: boolean; data?: T; message?: string; errorCode?: string};

export class PreviewApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly errorCode?: string,
  ) {
    super(message);
  }
}

const previewPath = (route: LinkRoute): string | null => {
  switch (route.kind) {
    case 'notice':
      return `/v1/share-links/notice/${route.code}/preview`;
    case 'board':
      return `/v1/share-links/board/${route.code}/preview`;
    case 'cafeteria':
      return '/v1/share-links/cafeteria/preview';
    case 'unsupported':
      return null;
  }
};

export const fetchPreview = async (
  route: LinkRoute,
  fetcher: typeof fetch = fetch,
): Promise<ContentPreview | null> => {
  const path = previewPath(route);
  if (!path) {
    return null;
  }

  const response = await fetcher(`${API_ORIGIN}${path}`, {
    credentials: 'omit',
    headers: {Accept: 'application/json'},
  });
  let payload: ApiResponse<Omit<ContentPreview, 'kind'>> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<Omit<ContentPreview, 'kind'>>;
  } catch {
    throw new PreviewApiError('미리보기를 불러오지 못했어요.', response.status);
  }

  if (!response.ok || !payload.success || !payload.data) {
    throw new PreviewApiError(
      payload.message ?? '미리보기를 불러오지 못했어요.',
      response.status,
      payload.errorCode,
    );
  }

  return {...payload.data, kind: route.kind} as ContentPreview;
};
