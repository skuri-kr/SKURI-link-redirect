import type {LinkRoute} from './linkRoutes';

export type RoutePresentation = {
  eyebrow: string;
  title: string;
  description: string;
  icon: 'notice' | 'cafeteria' | 'board' | 'link';
};

export const getRoutePresentation = (route: LinkRoute): RoutePresentation => {
  switch (route.kind) {
    case 'notice':
      return {
        eyebrow: '학교 공지',
        title: '공지를 확인해 보세요',
        description: '스쿠리 앱에서 공유된 학교 공지의 전체 내용을 확인할 수 있어요.',
        icon: 'notice',
      };
    case 'cafeteria':
      return {
        eyebrow: '이번 주 학식',
        title: '오늘은 뭐 먹지?',
        description: '스쿠리 앱에서 이번 주 성결대학교 학식 메뉴를 한눈에 확인해 보세요.',
        icon: 'cafeteria',
      };
    case 'board':
      return {
        eyebrow: '커뮤니티',
        title: '공유된 게시글을 확인해 보세요',
        description: '스쿠리 앱에서 성결대 학생들과 나눈 게시글을 확인할 수 있어요.',
        icon: 'board',
      };
    case 'unsupported':
      return {
        eyebrow: '스쿠리 공유 링크',
        title: '링크를 확인할 수 없어요',
        description: '주소가 정확한지 확인하거나 스쿠리 앱을 직접 실행해 주세요.',
        icon: 'link',
      };
  }
};
