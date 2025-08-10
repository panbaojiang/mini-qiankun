# Vue2 子应用

这是基于 Vue2 + Vue Router + Vue CLI 构建的子应用。

## 技术栈

- Vue 2.7
- Vue Router 3
- Vue CLI
- JavaScript

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
├── router/             # 路由配置
│   └── index.js
├── assets/             # 静态资源
│   └── main.css
├── App.vue             # 主组件
└── main.js             # 应用入口

public/
└── index.html          # HTML 模板

vue.config.js           # Vue CLI 配置
```

## 微前端集成

该应用可以作为 qiankun 微前端架构的子应用运行：

- 独立运行: http://localhost:7101
- 微前端模式: 通过主应用访问

## 特性

- ✅ 微前端支持
- ✅ Vue Router 路由
- ✅ 热重载开发
- ✅ 独立部署能力
