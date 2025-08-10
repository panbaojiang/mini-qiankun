import { reroute } from "./navigation/reroute";
import { setupNavigationListeners } from "./navigation/navigation-events";
import { isInBrowser } from "./utils";

// 标记是否已经启动
let _isStarted = false;

// 启动 single-spa
export function start(opts?: { urlRerouteOnly?: boolean }): void {
  if (_isStarted) {
    console.warn("single-spa has already been called with start().");
    return;
  }

  _isStarted = true;
  if (isInBrowser()) {
    // 设置路由监听
    setupNavigationListeners(opts);

    // 执行初始路由
    reroute();
  }
}

// 检查是否已经启动
export function isStarted(): boolean {
  return _isStarted;
}
