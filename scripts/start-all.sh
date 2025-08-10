#!/bin/bash

# 启动所有微前端应用的脚本

echo "🚀 启动微前端项目..."

# 检查是否安装了 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 请先安装 pnpm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 启动所有应用
echo "🔥 启动所有应用..."
pnpm dev

echo "✅ 所有应用已启动！"
echo "📱 访问地址："
echo "   - 主应用: http://localhost:5173"
echo "   - Vue2 子应用: http://localhost:7101"
echo "   - Vue3 子应用: http://localhost:7102"
echo "   - React 子应用: http://localhost:7103" 