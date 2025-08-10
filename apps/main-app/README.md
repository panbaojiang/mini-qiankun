# 主应用 (Main App)

这是基于 React + TypeScript + Vite 构建的微前端基座应用。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router DOM
- Qiankun (微前端框架)

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── ErrorBoundary.tsx
│   └── Loading.tsx
├── config/             # 配置
│   └── index.ts
├── constants/          # 常量
│   └── index.ts
├── types/              # 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── index.ts
├── App.tsx             # 主应用组件
├── App.css             # 主应用样式
└── main.tsx            # 应用入口
```

## 子应用集成

主应用集成了以下子应用：

- Vue2 子应用 (端口: 7101)
- Vue3 子应用 (端口: 7102)
- React 子应用 (端口: 7103)

## 特性

- ✅ 微前端架构
- ✅ TypeScript 支持
- ✅ 热重载开发
- ✅ 错误边界处理
- ✅ 代码规范配置
