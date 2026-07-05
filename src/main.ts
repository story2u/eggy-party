import { EggyIslandApp } from './app/EggyIslandApp';
import './styles.css';

declare global {
  interface Window {
    __EGGY_ISLAND_READY__?: boolean;
  }
}

const container = document.querySelector<HTMLElement>('#app');

if (!container) {
  throw new Error('Missing #app container');
}

const app = new EggyIslandApp(container);
app.start();

window.__EGGY_ISLAND_READY__ = true;

window.addEventListener('beforeunload', () => {
  app.dispose();
});
