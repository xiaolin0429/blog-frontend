# 博客前端项目部署文档

## 目录
- [环境要求](#环境要求)
- [开发环境](#开发环境)
- [生产环境](#生产环境)
- [开发规范](#开发规范)

## 环境要求

### 必需环境
- Node.js >= 16.0.0 (推荐使用 LTS 版本)
- npm >= 11.0.0 (已更新到最新版本)
- 操作系统：Windows/Linux/MacOS
- 开发工具：推荐使用 VS Code
- 浏览器：推荐使用 Chrome 最新版

### 主要依赖版本
- vue-tsc: 2.2.0
- vite: 最新版
- typescript: 最新版
- tailwindcss: 最新版

### 开发工具推荐配置
VS Code 插件：
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- ESLint
- Prettier

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

# 开发服务器主机
VITE_HOST=localhost

# 是否启用HTTPS
VITE_ENABLE_HTTPS=false

# 资源公共路径
VITE_PUBLIC_PATH=/

# API请求超时时间(ms)
VITE_API_TIMEOUT=10000

# 是否启用Mock数据
VITE_USE_MOCK=false
```

后台项目配置 (`admin/.env`):
```bash
# API基础路径
VITE_API_BASE_URL=http://localhost:8000/api/v1

# 文件上传路径
VITE_UPLOAD_URL=http://localhost:8000/api/v1/upload

# 开发服务器端口
VITE_PORT=5174

# 开发服务器主机
VITE_HOST=localhost

# 是否启用HTTPS
VITE_ENABLE_HTTPS=false

# 资源公共路径
VITE_PUBLIC_PATH=/

# API请求超时时间(ms)
VITE_API_TIMEOUT=10000

# 是否启用Mock数据
VITE_USE_MOCK=false
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

### 2. 生产环境配置

生产环境变量配置 (`front/.env.production` 和 `admin/.env.production`):
```bash
# API基础路径
VITE_API_BASE_URL=/api/v1

# 文件上传路径
VITE_UPLOAD_URL=/api/v1/upload

# 资源公共路径
VITE_PUBLIC_PATH=/

# API请求超时时间(ms)
VITE_API_TIMEOUT=10000

# 是否启用压缩
VITE_BUILD_COMPRESS=true

# 压缩算法类型 gzip | brotli | none
VITE_BUILD_COMPRESS_TYPE=gzip

# 是否删除源码映射文件
VITE_BUILD_SOURCE_MAP=false

# 是否启用PWA
VITE_PWA=false
```

### 3. Nginx配置示例

```nginx
# 开启gzip
gzip on;
gzip_min_length 1k;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/json application/javascript application/x-javascript application/xml;
gzip_vary on;
gzip_proxied any;

# 前台项目配置
server {
    listen 80;
    server_name blog.example.com;
    
    # 强制跳转HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name blog.example.com;
    
    # SSL配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS配置
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    location / {
        root /path/to/blog-frontend/front/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存配置
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
    
    # API代理
    location /api/ {
        proxy_pass http://backend-api-url/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# 后台项目配置
server {
    listen 443 ssl http2;
    server_name admin.blog.example.com;
    
    # SSL配置（同上）
    ...
    
    location / {
        root /path/to/blog-frontend/admin/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 禁止搜索引擎索引
        add_header X-Robots-Tag "noindex, nofollow, nosnippet, noarchive";
        
        # 安全头配置
        add_header X-Frame-Options "DENY";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }
    
    # API代理（同上）
    location /api/ {
        ...
    }
}
```

### 4. 部署检查清单

#### 基础环境检查
- [ ] Node.js版本 >= 16.0.0
- [ ] npm版本 >= 11.0.0
- [ ] 系统内存 >= 2GB
- [ ] 磁盘空间 >= 10GB

#### 构建检查
- [ ] 环境变量配置完整
- [ ] 依赖安装完整性
- [ ] 构建命令执行成功
- [ ] 构建产物完整性检查
- [ ] 源码映射文件处理

#### Nginx配置检查
- [ ] SSL证书配置
- [ ] HTTPS重定向配置
- [ ] 安全头配置
- [ ] 缓存策略配置
- [ ] 跨域配置
- [ ] WebSocket配置
- [ ] 超时配置

#### 性能优化检查
- [ ] 静态资源压缩
- [ ] 浏览器缓存配置
- [ ] CDN配置
- [ ] 图片优化
- [ ] 首屏加载优化

#### 安全检查
- [ ] SSL/TLS配置
- [ ] HTTP安全头配置
- [ ] XSS防护
- [ ] CSRF防护
- [ ] 敏感信息保护

#### 监控配置
- [ ] 错误日志配置
- [ ] 访问日志配置
- [ ] 性能监控配置
- [ ] 告警配置
- [ ] 备份策略

#### 上线后检查
- [ ] 功能可用性测试
- [ ] API接口测试
- [ ] 浏览器兼容性测试
- [ ] 移动端适配测试
- [ ] 性能指标测试

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

### 4. 开发服务器配置

前台项目 (`front/vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    host: process.env.VITE_HOST,
    port: parseInt(process.env.VITE_PORT || '5173'),
    https: process.env.VITE_ENABLE_HTTPS === 'true',
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

后台项目 (`admin/vite.config.ts`) 配置类似。 