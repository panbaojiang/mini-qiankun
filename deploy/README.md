# 部署配置说明

本目录包含了项目的 Docker 部署配置文件和脚本。

## 目录结构

```
deploy/
├── docker/
│   └── Dockerfile          # Docker镜像构建文件
├── nginx/
│   ├── nginx.conf          # Nginx主配置文件
│   └── conf.d/
│       └── default.conf    # Nginx站点配置文件
├── scripts/
│   └── deploy.sh           # 本地部署脚本
├── docker-compose.yml      # Docker Compose配置文件
└── README.md               # 本文件
```

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- 服务器已安装 Docker

## GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

- `SERVER_HOST`: 服务器 IP 地址
- `SERVER_USERNAME`: 服务器用户名
- `SERVER_PASSWORD`: 服务器密码
- `SERVER_PORT`: SSH 端口（通常是 22）

## 自动部署流程

### 1. GitHub Actions 自动部署

当代码推送到 `master` 或 `main` 分支时，GitHub Actions 会自动：

1. 运行测试
2. 构建 Docker 镜像
3. 通过 SSH 连接到服务器
4. 在服务器上构建并运行新容器
5. 进行健康检查

### 2. 手动部署

#### 使用 Docker Compose（推荐用于本地测试）

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

## 应用访问

- 主应用: `http://your-domain/`
- React 子应用: `http://your-domain/sub-react/`
- Vue2 子应用: `http://your-domain/sub-vue2/`
- Vue3 子应用: `http://your-domain/sub-vue3/`
- 健康检查: `http://your-domain/health`

## 日志查看

```bash
# 查看容器日志
docker logs qiankun-app

# 查看Nginx日志
docker exec -it qiankun-app tail -f /var/log/nginx/access.log
docker exec -it qiankun-app tail -f /var/log/nginx/error.log
```

## 故障排除

### 1. 容器启动失败

```bash
# 查看容器状态
docker ps -a

# 查看详细日志
docker logs qiankun-app

# 进入容器调试
docker exec -it qiankun-app /bin/sh
```

### 2. 端口冲突

如果 80 端口被占用，可以修改端口映射：

```bash
docker run -d \
  --name qiankun-app \
  --restart unless-stopped \
  -p 8080:80 \  # 修改为8080:80
  -v $(pwd)/deploy/logs:/var/log/nginx \
  qiankun-app
```

### 3. 权限问题

确保部署脚本有执行权限：

```bash
chmod +x deploy/scripts/deploy.sh
```

## 性能优化

1. **启用 Gzip 压缩**: 已在 nginx.conf 中配置
2. **静态资源缓存**: 已配置长期缓存策略
3. **健康检查**: 容器启动后自动检查应用状态
4. **自动重启**: 容器异常退出时自动重启

## 安全建议

1. 在生产环境中使用 HTTPS
2. 配置防火墙只开放必要端口
3. 定期更新 Docker 镜像和基础镜像
4. 使用非 root 用户运行容器（已在 Dockerfile 中配置）

## 监控和维护

### 容器状态监控

```bash
# 查看容器资源使用情况
docker stats qiankun-app

# 查看容器详细信息
docker inspect qiankun-app
```

### 定期维护

```bash
# 清理未使用的镜像
docker image prune -f

# 清理未使用的容器
docker container prune -f

# 清理未使用的卷
docker volume prune -f
```
