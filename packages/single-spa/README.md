# Single-SPA 微前端框架

一个轻量级的微前端框架，支持多种前端框架的集成。

## 安装

```bash
npm install @qiankun/single-spa
```

## 使用方法

### API 格式

框架支持两种 API 格式来注册微应用：

#### 1. 对象格式 (推荐)

使用配置对象来注册应用，更加清晰和类型安全：

```typescript
import { registerApplication } from "@qiankun/single-spa";
import { RegisterApplicationConfig } from "@qiankun/single-spa/types";

const appConfig: RegisterApplicationConfig = {
  name: "react-app",
  app: {
    name: "react-app",
    entry: "//localhost:3000",
    container: "#react-container",
    activeRule: "/react",
    props: {
      user: { name: "张三", age: 25 },
    },
  },
  activeWhen: "/react",
  customProps: {
    theme: "light",
    language: "zh-CN",
  },
};

registerApplication(appConfig);
```

#### 2. 参数格式

使用多个参数来注册应用，兼容性更好：

```typescript
import { registerApplication } from "@qiankun/single-spa";
import { MicroAppConfig } from "@qiankun/single-spa/types";

const appConfig: MicroAppConfig = {
  name: "vue-app",
  entry: "//localhost:3001",
  container: "#vue-container",
  activeRule: "/vue",
  props: {
    user: { name: "李四", age: 30 },
  },
};

registerApplication("vue-app", appConfig, "/vue", {
  theme: "dark",
  language: "en-US",
});
```

### 异步加载

两种格式都支持异步加载函数：

#### 对象格式 - 异步加载

```typescript
const asyncAppConfig: RegisterApplicationConfig = {
  name: "angular-app",
  app: async () => {
    // 模拟异步加载
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      name: "angular-app",
      entry: "//localhost:3002",
      container: "#angular-container",
      activeRule: "/angular",
      props: {
        user: { name: "王五", age: 28 },
      },
    };
  },
  activeWhen: "/angular",
  customProps: {
    theme: "auto",
    language: "zh-CN",
  },
};

registerApplication(asyncAppConfig);
```

#### 参数格式 - 异步加载

```typescript
registerApplication(
  "svelte-app",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      name: "svelte-app",
      entry: "//localhost:3003",
      container: "#svelte-container",
      activeRule: "/svelte",
      props: {
        user: { name: "赵六", age: 32 },
      },
    };
  },
  "/svelte",
  {
    theme: "light",
    language: "en-US",
  }
);
```

### 类型定义

```typescript
// 微应用配置
interface MicroAppConfig {
  name: string;
  entry: string;
  container: string | HTMLElement;
  activeRule: string | ((location: Location) => boolean);
  props?: Record<string, any>;
}

// 注册应用配置（对象格式）
interface RegisterApplicationConfig {
  name: string;
  app: MicroAppConfig | (() => Promise<MicroAppConfig>);
  activeWhen?: string | ((location: Location) => boolean);
  customProps?: Record<string, any>;
}
```

### 参数说明

#### 对象格式参数

- `name`: 应用名称（必需）
- `app`: 应用配置或加载函数（必需）
- `activeWhen`: 激活条件（可选，默认为 "/"）
- `customProps`: 自定义属性（可选）

#### 参数格式参数

- `appNameOrConfig`: 应用名称（必需）
- `appOrLoadApp`: 应用配置或加载函数（必需）
- `activeWhen`: 激活条件（可选，默认为 "/"）
- `customProps`: 自定义属性（可选）

### 激活规则

激活规则可以是字符串或函数：

```typescript
// 字符串形式
activeWhen: "/app";

// 函数形式
activeWhen: (location: Location) => {
  return (
    location.pathname.startsWith("/app") &&
    location.search.includes("feature=on")
  );
};
```

### 错误处理

框架会验证所有参数，并在参数无效时抛出错误：

```typescript
try {
  registerApplication({
    name: "", // 错误：名称不能为空
    app: null, // 错误：应用配置不能为空
  });
} catch (error) {
  console.error("注册失败:", error.message);
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 许可证

MIT
