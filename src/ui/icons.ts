import type {RoutePresentation} from '../routePresentation';

const commonAttributes = 'viewBox="0 0 24 24" aria-hidden="true" focusable="false"';

export const iconSvg = (icon: RoutePresentation['icon']): string => {
  switch (icon) {
    case 'notice':
      return `<svg ${commonAttributes}><path d="M6.75 3.75h8.5l2 2v14.5H6.75V3.75Z"/><path d="M15.25 3.75v2.5h2.5M9.25 10h5.5M9.25 13.5h5.5M9.25 17h3.25"/></svg>`;
    case 'cafeteria':
      return `<svg ${commonAttributes}><path d="M7.25 3.75v6.5M4.75 3.75v4.5a2.5 2.5 0 0 0 5 0v-4.5M7.25 10.25v10M15.25 3.75v16.5M15.25 3.75c2.5 1 3.75 3 3.75 5.75h-3.75"/></svg>`;
    case 'board':
      return `<svg ${commonAttributes}><path d="M4.25 5.25h15.5v11.5H11l-4.75 3v-3h-2V5.25Z"/><path d="M8 9.25h8M8 12.75h5.5"/></svg>`;
    case 'link':
      return `<svg ${commonAttributes}><path d="m9.75 14.25 4.5-4.5M7.75 16.25l-1 1a3.18 3.18 0 0 1-4.5-4.5l3-3a3.18 3.18 0 0 1 4.5 0M16.25 7.75l1-1a3.18 3.18 0 0 1 4.5 4.5l-3 3a3.18 3.18 0 0 1-4.5 0"/></svg>`;
  }
};

export const arrowIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M14 7l5 5-5 5"/></svg>`;
export const appleIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" stroke="none" d="M17.1 12.6c0-2.5 2.1-3.7 2.2-3.8a4.7 4.7 0 0 0-3.7-2c-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.6.9 1.3 2 2.8 3.4 2.7 1.3-.1 1.9-.9 3.5-.9s2.1.9 3.5.8c1.5 0 2.4-1.3 3.3-2.7a10.8 10.8 0 0 0 1.5-3c-.1 0-3.4-1.3-3.4-4.3ZM14.6 5.1a4.4 4.4 0 0 0 1-3.2 4.6 4.6 0 0 0-3 1.5 4.2 4.2 0 0 0-1.1 3.1 3.8 3.8 0 0 0 3.1-1.4Z"/></svg>`;
export const playIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" stroke="none" d="M3.6 2.5c-.4.4-.6 1-.6 1.8v15.4c0 .8.2 1.4.6 1.8l.1.1 8.6-8.6v-2L3.7 2.4l-.1.1Zm11.5 13.3-2.8-2.8v-2l2.8-2.8.1.1 3.4 1.9c1 .6 1 1.5 0 2.1l-3.4 1.9-.1.1v1.5Zm-.9.5-2.9-2.9-7.6 7.7c.4.4 1.1.5 1.8.1l8.7-4.9Zm0-8.6L5.5 2.8c-.7-.4-1.4-.3-1.8.1l7.6 7.7 2.9-2.9Z"/></svg>`;
