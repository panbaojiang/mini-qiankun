# Qiankun 微前端项目

这是一个基于 qiankun 的微前端项目，包含一个主应用和三个子应用。

## 项目结构

```
qiankun-dom/
├── apps/
│   ├── main-app/          # 主应用 (React + TypeScript + Vite)
│   ├── sub-react/         # React 子应用
│   ├── sub-vue2/          # Vue2 子应用
│   └── sub-vue3/          # Vue3 子应用
├── package.json
└── pnpm-workspace.yaml
```

## 技术栈

- **主应用**: React + TypeScript + Vite + Qiankun
- **React 子应用**: React + TypeScript + Webpack
- **Vue2 子应用**: Vue2 + Vue Router + Vue CLI
- **Vue3 子应用**: Vue3 + Vue Router + TypeScript + Vue CLI

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

启动所有应用：

```bash
pnpm dev
```

或者分别启动：

```bash
# 启动主应用
pnpm run dev:main

# 启动 Vue2 子应用
pnpm run dev:vue2

# 启动 Vue3 子应用
pnpm run dev:vue3

# 启动 React 子应用
pnpm run dev:react
```

### 访问地址

- 主应用: http://localhost:5173
- Vue2 子应用: http://localhost:7101
- Vue3 子应用: http://localhost:7102
- React 子应用: http://localhost:7103

## 构建

```bash
# 构建所有应用
pnpm run build
```

## 特性

- ✅ 微前端架构
- ✅ 多框架支持 (React, Vue2, Vue3)
- ✅ TypeScript 支持
- ✅ 热重载开发
- ✅ 独立部署能力
