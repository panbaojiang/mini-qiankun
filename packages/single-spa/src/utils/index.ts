// 工具函数集合

/**
 * 检查元素是否存在
 */
export function elementExists(selector: string): boolean {
  return !!document.querySelector(selector);
}

/**
 * 获取容器元素
 */
export function getContainerElement(
  container: string | HTMLElement
): HTMLElement | null {
  if (typeof container === "string") {
    return document.querySelector(container);
  }
  return container;
}

/**
 * 检查 URL 是否匹配激活规则
 */
export function isActiveRule(
  activeRule: string | ((location: Location) => boolean),
  location: Location
): boolean {
  if (typeof activeRule === "string") {
    return location.pathname.startsWith(activeRule);
  }
  if (typeof activeRule === "function") {
    return activeRule(location);
  }
  return false;
}

/**
 * 生成唯一的应用名称
 */
export function generateAppName(prefix: string = "app"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 验证应用配置
 */
export function validateAppConfig(config: any): boolean {
  return !!(
    config &&
    typeof config.name === "string" &&
    typeof config.entry === "string" &&
    (typeof config.container === "string" ||
      config.container instanceof HTMLElement) &&
    (typeof config.activeRule === "string" ||
      typeof config.activeRule === "function")
  );
}

/**
 * 检查是否在浏览器环境
 */
export function isInBrowser(): boolean {
  return typeof window !== "undefined";
}
