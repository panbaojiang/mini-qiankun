# 第一阶段：构建依赖和子应用
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm 和依赖
RUN npm install -g pnpm@10.13.1

# 复制所有配置文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .fatherrc.cjs ./
COPY packages/ ./packages/
COPY apps/ ./apps/

# 安装所有依赖（包括workspace依赖）
RUN pnpm install --frozen-lockfile

# 显示依赖安装结果
RUN pnpm list --depth=0

# 构建公共包（添加详细输出）
RUN pnpm run build:packages --verbose

# 构建子应用
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
COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf

# 清理临时文件
RUN rm -rf /app /root/.npm /tmp/*

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]