# GitHub Actions 工作流说明

## 概述

本项目使用 GitHub Actions 进行自动化构建、测试和部署。工作流会在每次推送到 master 分支或创建 PR 时自动触发。

## 工作流结构

### 1. 测试任务 (test)

- **触发条件**: 所有推送和 PR
- **功能**:
  - 安装依赖
  - 运行测试（如果配置）
  - 代码检查（如果配置）
- **运行环境**: Ubuntu Latest

### 2. 构建任务 (build)

- **触发条件**: 测试任务成功后
- **功能**:
  - 构建所有 packages
  - 构建主应用 (main-app)
  - 构建子应用 (sub-react, sub-vue2, sub-vue3)
  - 验证构建输出
  - 上传构建产物
  - 部署到 GitHub Pages（仅 master 分支）
- **运行环境**: Ubuntu Latest，支持 Node.js 18 和 20

### 3. 部署状态检查 (deploy-status)

- **触发条件**: 构建任务成功后，仅在 master 分支
- **功能**: 检查部署状态并输出部署信息

## 缓存策略

- **pnpm 缓存**: 使用 GitHub Actions 缓存来加速依赖安装
- **缓存键**: 基于`pnpm-lock.yaml`文件哈希值
- **缓存路径**: pnpm 存储目录

## 部署配置

- **部署目录**: `apps/main-app/dist`
- **自定义域名**: `qiankun-dom.com`
- **部署分支**: `gh-pages`
- **部署条件**: 仅在 master 分支推送时部署

## 环境变量和 Secrets

需要在 GitHub 仓库中配置以下 Secrets：

- `GITHUB_USER`: GitHub 用户名
- `GITHUB_EMAIL`: GitHub 邮箱地址
- `GITHUB_TOKEN`: 自动提供，无需手动配置

## 手动触发

可以通过以下方式手动触发工作流：

1. 在 GitHub 仓库页面点击"Actions"标签
2. 选择"Build and Deploy"工作流
3. 点击"Run workflow"按钮
4. 选择分支并点击"Run workflow"

## 故障排除

### 常见问题

1. **构建失败**: 检查依赖是否正确安装，构建脚本是否存在
2. **部署失败**: 确认 GitHub Pages 已启用，自定义域名配置正确
3. **缓存问题**: 清除 GitHub Actions 缓存或等待缓存过期

### 调试步骤

1. 查看工作流日志
2. 检查构建产物是否正确生成
3. 验证部署配置
4. 检查 GitHub Pages 设置

## 自定义配置

### 添加新的构建步骤

在`build`任务中添加新的步骤：

```yaml
- name: Custom build step
  run: |
    echo "Running custom build step"
    # 你的自定义命令
```

### 修改 Node.js 版本

在`strategy.matrix.node-version`中修改支持的版本：

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
```

### 添加新的子应用

在构建子应用步骤中添加新的应用：

```yaml
- name: Build new sub app
  run: |
    cd apps/new-sub-app
    pnpm build
```

## 性能优化

- 使用 pnpm 缓存减少依赖安装时间
- 并行构建多个 Node.js 版本
- 构建产物缓存 7 天
- 使用最新的 GitHub Actions 版本

## 安全考虑

- 使用`--frozen-lockfile`确保依赖版本锁定
- 仅在 master 分支部署
- 使用 GitHub 提供的 token 进行认证
- 定期更新 GitHub Actions 版本
