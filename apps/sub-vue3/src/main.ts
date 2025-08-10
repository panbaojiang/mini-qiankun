import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import "./assets/main.css";

let instance: any = null;

const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? "/sub-vue3" : "/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
  ],
});

function render(props: any = {}) {
  const { container } = props;

  instance = createApp(App);
  instance.use(router);
  instance.mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 生命周期函数
export async function bootstrap() {
  console.log("[vue3] vue app bootstraped");
}

export async function mount(props: any) {
  console.log("[vue3] props from main framework", props);
  render(props);
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
}
