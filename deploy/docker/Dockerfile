# 第一阶段：构建依赖和子应用
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm 和依赖
RUN npm install -g pnpm@10.13.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# 构建公共包
COPY packages/ ./packages/
RUN pnpm run build:packages

# 构建子应用（利用缓存）
COPY apps/ ./apps/
RUN cd apps/main-app && pnpm build
RUN cd apps/sub-react && pnpm build
RUN cd apps/sub-vue2 && pnpm build
RUN cd apps/sub-vue3 && pnpm build

# 第二阶段：生产环境
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/apps/main-app/dist /usr/share/nginx/html
COPY --from=builder /app/apps/sub-react/dist /usr/share/nginx/html/sub-react
COPY --from=builder /app/apps/sub-vue2/dist /usr/share/nginx/html/sub-vue2
COPY --from=builder /app/apps/sub-vue3/dist /usr/share/nginx/html/sub-vue3

# 合并 Nginx 配置（避免覆盖默认配置）
COPY deploy/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
RUN cat /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.bak && \
    cat deploy/nginx/nginx.conf > /etc/nginx/nginx.conf && \
    echo "include /etc/nginx/nginx.conf.bak;" >> /etc/nginx/nginx.conf

# 清理临时文件
RUN rm -rf /app /root/.npm /tmp/*

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]