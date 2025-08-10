# Vue3 子应用

这是基于 Vue3 + Vue Router + TypeScript + Vue CLI 构建的子应用。

## 技术栈

- Vue 3.5
- Vue Router 4
- TypeScript
- Vue CLI
- Composition API

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm serve
```

### 构建

```bash
pnpm build
```

## 项目结构

```
src/
├── views/              # 页面组件
│   └── Home.vue
├── types/              # 类型定义
│   └── global.d.ts
├── assets/             # 静态资源
│   └── main.css
├── App.vue             # 主组件
└── main.ts             # 应用入口

public/
└── index.html          # HTML 模板

vue.config.js           # Vue CLI 配置
tsconfig.json           # TypeScript 配置
```

## 微前端集成

该应用可以作为 qiankun 微前端架构的子应用运行：

- 独立运行: http://localhost:7102
- 微前端模式: 通过主应用访问

## 特性

- ✅ 微前端支持
- ✅ TypeScript 支持
- ✅ Vue Router 路由
- ✅ Composition API
- ✅ 热重载开发
- ✅ 独立部署能力
