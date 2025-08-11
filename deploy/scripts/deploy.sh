#!/bin/bash

# 部署脚本
set -e

# 配置变量
IMAGE_NAME="qiankun-app"
CONTAINER_NAME="qiankun-app"
DOCKER_REGISTRY=""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running or not accessible"
        exit 1
    fi
    log_info "Docker is running"
}

# 停止并删除旧容器
cleanup_old_container() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "Stopping old container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME} || true
        log_info "Removing old container: ${CONTAINER_NAME}"
        docker rm ${CONTAINER_NAME} || true
    fi
}

# 删除旧镜像
cleanup_old_image() {
    if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "^${IMAGE_NAME}:"; then
        log_info "Removing old image: ${IMAGE_NAME}"
        docker rmi ${IMAGE_NAME} || true
    fi
}

# 构建新镜像
build_image() {
    log_info "Building new Docker image..."
    docker build -t ${IMAGE_NAME} -f deploy/docker/Dockerfile .
    if [ $? -eq 0 ]; then
        log_info "Image built successfully"
    else
        log_error "Failed to build image"
        exit 1
    fi
}

# 运行新容器
run_container() {
    log_info "Starting new container..."
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        -p 80:80 \
        -v $(pwd)/deploy/logs:/var/log/nginx \
        ${IMAGE_NAME}
    
    if [ $? -eq 0 ]; then
        log_info "Container started successfully"
    else
        log_error "Failed to start container"
        exit 1
    fi
}

# 健康检查
health_check() {
    log_info "Waiting for application to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/health > /dev/null 2>&1; then
            log_info "Application is healthy and ready!"
            return 0
        fi
        
        log_warn "Attempt $attempt/$max_attempts: Application not ready yet, waiting..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    log_error "Application failed health check after $max_attempts attempts"
    return 1
}

# 显示部署信息
show_deployment_info() {
    log_info "Deployment completed successfully!"
    log_info "Container name: ${CONTAINER_NAME}"
    log_info "Application URL: http://localhost"
    log_info "Health check: http://localhost/health"
    
    echo ""
    log_info "Container status:"
    docker ps --filter "name=${CONTAINER_NAME}"
    
    echo ""
    log_info "Container logs:"
    docker logs --tail 20 ${CONTAINER_NAME}
}

# 主函数
main() {
    log_info "Starting deployment process..."
    
    check_docker
    cleanup_old_container
    cleanup_old_image
    build_image
    run_container
    health_check
    
    if [ $? -eq 0 ]; then
        show_deployment_info
    else
        log_error "Deployment failed during health check"
        exit 1
    fi
}

# 执行主函数
main "$@"
