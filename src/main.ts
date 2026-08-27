import './styles.css';
import {renderApp} from './ui/renderApp';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('앱 루트 요소를 찾을 수 없습니다.');
}

renderApp(root, window.location);
