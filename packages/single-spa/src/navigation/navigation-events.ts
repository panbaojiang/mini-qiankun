import { reroute } from "./reroute";
import { isInBrowser } from "../utils";

// 保存原始的 history 方法
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

// 捕获的事件监听器
const capturedEventListeners = {
  hashchange: [],
  popstate: [],
};

// 路由事件类型
export const routingEventsListeningTo = ["hashchange", "popstate"];

// 格式化错误消息
function formatErrorMessage(code: number, message?: string): string {
  return `single-spa: ${code}${message ? ` - ${message}` : ""}`;
}

// 查找数组中的元素
function find<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  return array.find(predicate);
}

// 解析 URI
function parseUri(str: string): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.href = str;
  return anchor;
}

// 创建 PopState 事件
function createPopStateEvent(
  state: any,
  originalMethodName: string
): PopStateEvent {
  let evt: PopStateEvent;
  try {
    evt = new PopStateEvent("popstate", { state });
  } catch (err) {
    // IE 11 兼容性
    evt = document.createEvent("PopStateEvent");
    (evt as any).initPopStateEvent("popstate", false, false, state);
  }
  (evt as any).singleSpa = true;
  (evt as any).singleSpaTrigger = originalMethodName;
  return evt;
}

// 导航到指定 URL
export function navigateToUrl(obj: string | Event | { href: string }): void {
  let url: string;

  if (typeof obj === "string") {
    url = obj;
  } else if (obj && (obj as any).href) {
    url = (obj as any).href;
  } else if (
    obj &&
    (obj as any).currentTarget &&
    (obj as any).currentTarget.href &&
    (obj as any).preventDefault
  ) {
    url = (obj as any).currentTarget.href;
    (obj as any).preventDefault();
  } else {
    throw Error(
      formatErrorMessage(
        14,
        "navigateToUrl must be called with a string url, an <a> tag, or an event with currentTarget as <a> tag"
      )
    );
  }

  const current = parseUri(window.location.href);
  const destination = parseUri(url);

  if (url.indexOf("#") === 0) {
    window.location.hash = destination.hash;
  } else if (current.host !== destination.host && destination.host) {
    window.location.href = url;
  } else if (
    destination.pathname === current.pathname &&
    destination.search === current.search
  ) {
    window.location.hash = destination.hash;
  } else {
    // 不同的路径、主机或查询参数
    window.history.pushState(null, "", url);
  }
}

// 调用捕获的事件监听器
export function callCapturedEventListeners(eventArguments?: any[]): void {
  if (eventArguments) {
    const eventType = eventArguments[0].type;
    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      capturedEventListeners[eventType].forEach((listener) => {
        try {
          // 应用事件监听器抛出的错误不应该破坏 single-spa
          listener.apply(this, eventArguments);
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      });
    }
  }
}

let urlRerouteOnly = true;
let historyApiIsPatched = false;

// URL 重新路由函数
function urlReroute(): void {
  reroute();
}

// 补丁更新状态方法
function patchedUpdateState(updateState: Function, methodName: string) {
  return function (...args: any[]) {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, args);
    const urlAfter = window.location.href;

    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      // 触发一个人工的 popstate 事件，以便 single-spa 应用知道路由变化
      window.dispatchEvent(
        createPopStateEvent(window.history.state, methodName)
      );
    }

    return result;
  };
}

// 补丁历史 API
export function patchHistoryApi(opts?: { urlRerouteOnly?: boolean }): void {
  if (historyApiIsPatched) {
    throw Error(
      formatErrorMessage(
        43,
        "patchHistoryApi() was called after the history api was already patched."
      )
    );
  }

  // 默认为 true，作为性能优化，减少多余的 popstate 事件
  urlRerouteOnly =
    opts?.urlRerouteOnly !== undefined ? opts.urlRerouteOnly : true;

  historyApiIsPatched = true;

  // 为任何路由事件触发应用变更
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  // 补丁 addEventListener，确保正确的时机
  (window as any).addEventListener = function (
    eventName: string,
    fn: EventListenerOrEventListenerObject
  ) {
    if (typeof fn === "function") {
      if (
        routingEventsListeningTo.indexOf(eventName) >= 0 &&
        !find(capturedEventListeners[eventName], (listener) => listener === fn)
      ) {
        capturedEventListeners[eventName].push(fn as EventListener);
        return;
      }
    }

    return originalAddEventListener.apply(this, arguments);
  };

  (window as any).removeEventListener = function (
    eventName: string,
    listenerFn: EventListenerOrEventListenerObject
  ) {
    if (typeof listenerFn === "function") {
      if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[
          eventName
        ].filter((fn) => fn !== listenerFn);
      }
    }

    return originalRemoveEventListener.apply(this, arguments);
  };

  window.history.pushState = patchedUpdateState(
    window.history.pushState,
    "pushState"
  );
  window.history.replaceState = patchedUpdateState(
    originalReplaceState,
    "replaceState"
  );
}

// 设置导航监听器
export function setupNavigationListeners(opts?: {
  urlRerouteOnly?: boolean;
}): void {
  if (opts?.urlRerouteOnly) {
    return;
  }

  // 监听 popstate 事件（浏览器前进后退）
  window.addEventListener("popstate", () => {
    reroute();
  });

  // 重写 history.pushState
  window.history.pushState = function (...args) {
    originalPushState.apply(this, args);
    reroute();
  };

  // 重写 history.replaceState
  window.history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    reroute();
  };
}

// 恢复原始的 history 方法
export function restoreNavigationListeners(): void {
  window.history.pushState = originalPushState;
  window.history.replaceState = originalReplaceState;
  window.addEventListener = originalAddEventListener;
  window.removeEventListener = originalRemoveEventListener;
}

// 检测 single-spa 是否已经加载
if (isInBrowser()) {
  if ((window as any).singleSpaNavigate) {
    console.warn(
      formatErrorMessage(
        41,
        "single-spa has been loaded twice on the page. This can result in unexpected behavior."
      )
    );
  } else {
    // 为了方便在 onclick 属性中使用，暴露一个全局函数用于导航
    (window as any).singleSpaNavigate = navigateToUrl;
  }
}
