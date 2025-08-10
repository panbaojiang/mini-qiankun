import { registeredApps, getActiveApps, getMountedApps } from "../applications";
import { RegisteredApp, AppStatus } from "../types";

/**
 * 加载应用
 * 负责从应用配置中加载应用的生命周期函数
 * @param app 要加载的应用实例
 * @returns Promise<any> 返回加载完成的应用配置
 */
async function loadApp(app: RegisteredApp): Promise<any> {
  // 如果应用已经加载过，直接返回之前的加载Promise
  if (app.status !== AppStatus.NOT_LOADED) {
    return app.loadPromise;
  }

  // 设置应用状态为加载中
  app.status = AppStatus.LOADING;

  // 创建加载Promise，包含实际的加载逻辑
  const loadPromise = (async () => {
    try {
      let appConfig;

      // 如果loadApp是函数，则调用它获取应用配置
      if (typeof app.loadApp === "function") {
        appConfig = await app.loadApp();
      } else {
        // 否则直接使用配置对象
        appConfig = app.loadApp;
      }

      // 加载成功，设置状态为已加载
      app.status = AppStatus.LOADED;
      return appConfig;
    } catch (error) {
      // 加载失败，设置状态为跳过（因为损坏）
      app.status = AppStatus.SKIP_BECAUSE_BROKEN;
      app.loadError = error as Error;
      throw error;
    }
  })();

  // 保存加载Promise，避免重复加载
  app.loadPromise = loadPromise;
  return loadPromise;
}

/**
 * 启动应用
 * 调用应用的bootstrap生命周期函数，初始化应用
 * @param app 要启动的应用实例
 * @returns Promise<void>
 */
async function bootstrapApp(app: RegisteredApp): Promise<void> {
  // 只有已加载的应用才能启动
  if (app.status !== AppStatus.LOADED) {
    return;
  }

  // 创建启动Promise
  const bootstrapPromise = (async () => {
    // 设置应用状态为启动中
    app.status = AppStatus.BOOTSTRAPPING;

    try {
      // 确保应用已加载
      const appConfig = await app.loadPromise;

      // 调用应用的bootstrap方法进行初始化
      if (appConfig.bootstrap) {
        await appConfig.bootstrap();
      }

      // 启动完成，设置状态为未挂载，等待挂载
      app.status = AppStatus.NOT_MOUNTED;
    } catch (error) {
      // 启动失败，设置状态为跳过
      app.status = AppStatus.SKIP_BECAUSE_BROKEN;
      app.bootstrapError = error as Error;
      throw error;
    }
  })();

  // 保存启动Promise
  app.bootstrapPromise = bootstrapPromise;
  return bootstrapPromise;
}

/**
 * 挂载应用
 * 将应用挂载到DOM容器中，使其可见和可交互
 * @param app 要挂载的应用实例
 * @returns Promise<void>
 */
async function mountApp(app: RegisteredApp): Promise<void> {
  // 只有未挂载的应用才能挂载
  if (app.status !== AppStatus.NOT_MOUNTED) {
    return;
  }

  // 创建挂载Promise
  const mountPromise = (async () => {
    try {
      // 确保应用已加载和启动
      const appConfig = await loadApp(app);
      await bootstrapApp(app);

      // 调用应用的mount方法，将应用挂载到指定容器
      if (appConfig.mount) {
        await appConfig.mount({
          container: document.getElementById("root") || document.body,
          props: app.customProps || {},
        });
      }

      // 挂载成功，设置状态为已挂载
      app.status = AppStatus.MOUNTED;
    } catch (error) {
      // 挂载失败，设置状态为跳过
      app.status = AppStatus.SKIP_BECAUSE_BROKEN;
      app.mountError = error as Error;
      throw error;
    }
  })();

  // 保存挂载Promise
  app.mountPromise = mountPromise;
  return mountPromise;
}

/**
 * 卸载应用
 * 从DOM容器中移除应用，清理资源
 * @param app 要卸载的应用实例
 * @returns Promise<void>
 */
async function unmountApp(app: RegisteredApp): Promise<void> {
  // 只有已挂载的应用才能卸载
  if (app.status !== AppStatus.MOUNTED) {
    return;
  }

  // 创建卸载Promise
  const unmountPromise = (async () => {
    // 设置应用状态为卸载中
    app.status = AppStatus.UNMOUNTING;

    try {
      // 获取应用配置
      const appConfig = await app.loadPromise;

      // 调用应用的unmount方法进行清理
      if (appConfig.unmount) {
        await appConfig.unmount();
      }

      // 卸载完成，设置状态为未挂载
      app.status = AppStatus.NOT_MOUNTED;
    } catch (error) {
      // 卸载失败，设置状态为跳过
      app.status = AppStatus.SKIP_BECAUSE_BROKEN;
      app.unmountError = error as Error;
      throw error;
    }
  })();

  // 保存卸载Promise
  app.unmountPromise = unmountPromise;
  return unmountPromise;
}

/**
 * 重新路由函数
 * 这是single-spa的核心函数，负责根据当前路由状态管理应用的生命周期
 * 主要功能：
 * 1. 卸载不再活跃的应用
 * 2. 挂载新活跃的应用
 * 3. 确保应用状态的一致性
 * @returns Promise<void>
 */
export async function reroute(): Promise<void> {
  // 获取当前应该活跃的应用列表
  const activeApps = getActiveApps();
  console.log("activeApps", activeApps);
  // 获取当前已挂载的应用列表
  const mountedApps = getMountedApps();

  // 找出需要卸载的应用：已挂载但不再活跃的应用
  const appsToUnmount = mountedApps.filter((app) => !activeApps.includes(app));

  // 找出需要挂载的应用：活跃但未挂载或已加载的应用
  const appsToMount = activeApps.filter(
    (app) =>
      app.status === AppStatus.NOT_MOUNTED || app.status === AppStatus.LOADED
  );

  try {
    // 并行执行卸载和挂载操作
    await Promise.all([
      ...appsToUnmount.map(unmountApp), // 卸载不需要的应用
      ...appsToMount.map(mountApp), // 挂载需要的应用
    ]);

    // 路由变化处理完成，记录日志
    console.log("Reroute completed", { activeApps, mountedApps });
  } catch (error) {
    // 处理路由变化过程中的错误
    console.error("Reroute failed:", error);
  }
}
