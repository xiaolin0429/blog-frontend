# 博客前端项目部署文档

## 目录
- [环境要求](#环境要求)
- [开发环境](#开发环境)
- [生产环境](#生产环境)
- [开发规范](#开发规范)

## 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+
- 操作系统：Windows/Linux/MacOS
- 开发工具：推荐使用 VS Code
- 浏览器：推荐使用 Chrome 最新版

## 开发环境

### 1. 克隆项目
```bash
git clone https://github.com/xiaolin0429/blog-frontend.git
cd blog-frontend
```

### 2. 安装依赖
```bash
# 安装项目根目录依赖
npm install

# 安装前台项目依赖
cd front
npm install

# 安装后台项目依赖
cd ../admin
npm install
```

### 3. 环境变量配置

前台项目配置 (`front/.env`):
```bash
# API基础路径
VITE_API_BASE_URL=http://localhost:8000/api/v1

# 文件上传路径
VITE_UPLOAD_URL=http://localhost:8000/api/v1/upload

# 开发服务器端口
VITE_PORT=5173
```

后台项目配置 (`admin/.env`):
```bash
# API基础路径
VITE_API_BASE_URL=http://localhost:8000/api/v1

# 文件上传路径
VITE_UPLOAD_URL=http://localhost:8000/api/v1/upload

# 开发服务器端口
VITE_PORT=5174
```

### 4. 启动开发服务器

前台项目：
```bash
# 在 front 目录下
npm run dev
# 访问 http://localhost:5173
```

后台项目：
```bash
# 在 admin 目录下
npm run dev
# 访问 http://localhost:5174
```

## 生产环境

### 1. 构建项目

前台项目：
```bash
# 在 front 目录下
npm run build
```

后台项目：
```bash
# 在 admin 目录下
npm run build
```

构建产物将分别输出到 `front/dist` 和 `admin/dist` 目录。

### 2. 部署配置

Nginx配置示例：
```nginx
# 前台项目配置
server {
    listen 80;
    server_name blog.example.com;
    
    location / {
        root /path/to/blog-frontend/front/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend-api-url/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 后台项目配置
server {
    listen 80;
    server_name admin.blog.example.com;
    
    location / {
        root /path/to/blog-frontend/admin/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend-api-url/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 环境变量配置

生产环境变量配置 (`front/.env.production` 和 `admin/.env.production`):
```bash
# API基础路径
VITE_API_BASE_URL=/api/v1

# 文件上传路径
VITE_UPLOAD_URL=/api/v1/upload

# 资源公共路径
VITE_PUBLIC_PATH=/
```

### 4. 部署检查清单

- [ ] Node.js版本检查
- [ ] 环境变量配置
- [ ] 依赖安装完整性
- [ ] 构建命令执行成功
- [ ] Nginx配置正确
- [ ] HTTPS证书配置
- [ ] 跨域配置
- [ ] 缓存策略配置
- [ ] 错误页面配置
- [ ] 监控配置

## 开发规范

### 1. 分支管理
- main: 主分支，用于生产环境
- develop: 开发分支，用于开发环境
- feature/*: 功能分支
- hotfix/*: 紧急修复分支

### 2. 环境说明
- 开发环境：本地开发使用
- 测试环境：用于测试和联调
- 预发环境：生产环境的镜像
- 生产环境：线上正式环境

### 3. 部署流程
1. 代码提交到对应环境分支
2. 执行自动化测试
3. 构建项目
4. 上传构建产物
5. 更新环境变量
6. 重启服务
7. 检查服务状态

### 4. 回滚策略
1. 保留最近5次构建产物
2. 配置文件版本控制
3. 数据库备份策略
4. 记录部署日志
5. 制定回滚流程

### 5. 监控告警
1. 服务状态监控
2. 性能指标监控
3. 错误日志监控
4. 用户行为监控
5. 告警通知配置 