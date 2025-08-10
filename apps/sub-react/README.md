# React 子应用

这是基于 React + TypeScript + Webpack 构建的子应用。

## 技术栈

- React 19
- TypeScript
- Webpack 5
- React Router DOM
- Babel

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

### 代码检查

```bash
pnpm lint
```

## 项目结构

```
src/
├── App.tsx             # 主组件
└── index.tsx           # 应用入口

public/
└── index.html          # HTML 模板

webpack.config.js       # Webpack 配置
tsconfig.json           # TypeScript 配置
.babelrc               # Babel 配置
.eslintrc.js           # ESLint 配置
```

## 微前端集成

该应用可以作为 qiankun 微前端架构的子应用运行：

- 独立运行: http://localhost:7103
- 微前端模式: 通过主应用访问

## 特性

- ✅ 微前端支持
- ✅ TypeScript 支持
- ✅ 热重载开发
- ✅ 代码规范检查
- ✅ 独立部署能力
