// import { registerMicroApps, start } from 'qiankun';
import { registerMicroApps, start } from '../../../packages/qiankun/src/index';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import config from './config';

// 渲染基座
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// 注册子应用
registerMicroApps([
  {
    name: config.subApps.vue2.name,
    entry: config.subApps.vue2.entry,
    container: '#subapp-container',
    activeRule: '/sub-vue2',
  },
  {
    name: config.subApps.vue3.name,
    entry: config.subApps.vue3.entry,
    container: '#subapp-container',
    activeRule: '/sub-vue3',
  },
  {
    name: config.subApps.react.name,
    entry: config.subApps.react.entry,
    container: '#subapp-container',
    activeRule: '/sub-react',
  },
]);

// 启动 qiankun
start();
