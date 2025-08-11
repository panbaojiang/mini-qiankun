# 使用多阶段构建
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm@10.13.1

# 复制package文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ ./apps/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建packages
RUN pnpm run build:packages

# 构建主应用
RUN cd apps/main-app && pnpm build

# 构建子应用
RUN cd apps/sub-react && pnpm build
RUN cd apps/sub-vue2 && pnpm build
RUN cd apps/sub-vue3 && pnpm build

# 生产环境镜像
FROM nginx:alpine

# 复制构建产物到nginx目录
COPY --from=builder /app/apps/main-app/dist /usr/share/nginx/html
COPY --from=builder /app/apps/sub-react/dist /usr/share/nginx/html/sub-react
COPY --from=builder /app/apps/sub-vue2/dist /usr/share/nginx/html/sub-vue2
COPY --from=builder /app/apps/sub-vue3/dist /usr/share/nginx/html/sub-vue3

# 复制nginx配置
COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
