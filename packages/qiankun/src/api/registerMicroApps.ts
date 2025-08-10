import {
  registerApplication,
  start as startSingleSpa,
} from "../../../single-spa/src";
import type { ObjectType, LifeCycles, RegistrableApp } from "../types";
import loadApp from "../core/loadApp";
import { toArray } from "../utils";

// 标记主框架是否已启动
export let started = false;

// 已注册的微应用列表
export const microApps: Array<RegistrableApp<Record<string, unknown>>> = [];

// 用于控制微应用挂载时机的异步锁，确保主框架启动后再挂载微应用
// const frameworkStartedDefer = new Deferred<void>();

/**
 * 注册多个微应用
 * @param apps 微应用配置数组
 * @param lifeCycles 生命周期钩子
 */
export function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: LifeCycles<T>
) {
  // 过滤已注册的微应用，避免重复注册
  const unregisteredApps = apps.filter(
    (app) => !microApps.some((registeredApp) => registeredApp.name === app.name)
  );
  // 合并到全局微应用列表
  microApps.push(...unregisteredApps);
  // 遍历注册每个未注册的微应用
  unregisteredApps.forEach((app) => {
    const { name, activeRule, props, entry, container } = app;

    // 调用 single-spa 的 registerApplication 注册微应用
    registerApplication({
      name,
      app: async () => {
        const microAppConfig = await loadApp(app);
        console.log(microAppConfig, 89);
        return microAppConfig;
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}

export function start() {
  // 标记主框架已启动
  started = true;

  // 启动 single-spa
  startSingleSpa();
}
