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

## 部署

### 自动部署 (GitHub Actions)

项目配置了完整的 CI/CD 流程，支持自动部署到 GitHub Pages 和 Docker 服务器。

#### 前置条件

1. 在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中添加以下 secrets：

   - `SERVER_HOST`: 服务器 IP 地址
   - `SERVER_USERNAME`: 服务器用户名
   - `SERVER_PASSWORD`: 服务器密码
   - `SERVER_PORT`: SSH 端口（通常是 22）

2. 确保服务器已安装 Docker

#### 部署流程

当代码推送到 `master` 或 `main` 分支时，GitHub Actions 会自动：

1. 运行测试和代码检查
2. 构建所有应用
3. 部署到 GitHub Pages
4. 构建 Docker 镜像
5. 部署到服务器并启动容器

### 手动部署

#### 使用 Docker Compose

```bash
cd deploy
docker-compose up -d
```

#### 使用部署脚本

```bash
cd deploy/scripts
chmod +x deploy.sh
./deploy.sh
```

#### 手动 Docker 命令

```bash
# 构建镜像
docker build -t qiankun-app -f deploy/docker/Dockerfile .

# 运行容器
docker run -d \
  --name qiankun-app \
  --restart unless-stopped \
  -p 80:80 \
  -v $(pwd)/deploy/logs:/var/log/nginx \
  qiankun-app
```

### 应用访问

- 主应用: `http://your-domain/`
- React 子应用: `http://your-domain/sub-react/`
- Vue2 子应用: `http://your-domain/sub-vue2/`
- Vue3 子应用: `http://your-domain/sub-vue3/`
- 健康检查: `http://your-domain/health`

## 特性

- ✅ 微前端架构
- ✅ 多框架支持 (React, Vue2, Vue3)
- ✅ TypeScript 支持
- ✅ 热重载开发
- ✅ 独立部署能力
- ✅ Docker 容器化部署
- ✅ 自动化 CI/CD 流程
- ✅ Nginx 反向代理
- ✅ 健康检查机制
