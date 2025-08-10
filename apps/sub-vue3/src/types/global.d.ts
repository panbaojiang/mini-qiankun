// 全局类型声明
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

// Vue 组件类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

export {};
