import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: window.__POWERED_BY_QIANKUN__ ? "/sub-vue2" : "/",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
  ],
});
