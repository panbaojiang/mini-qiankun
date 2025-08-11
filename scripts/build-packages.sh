#!/bin/bash

set -e

echo "开始构建包..."

# 检查必要的依赖
echo "检查依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "错误: pnpm 未安装"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
pnpm install --frozen-lockfile

# 清理之前的构建
echo "清理之前的构建..."
pnpm run clean:packages

# 按顺序构建包
echo "构建 single-spa 包..."
cd packages/single-spa
pnpm build
cd ../..

echo "构建 qiankun 包..."
cd packages/qiankun
pnpm build
cd ../..

echo "构建 loader 包..."
cd packages/loader
pnpm build
cd ../..

echo "所有包构建完成！"
