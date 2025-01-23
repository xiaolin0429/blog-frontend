# 博客系统前端

基于 Vue 3 + TypeScript + Vite 构建的现代化博客系统前端。

## 技术栈

- **核心框架:** Vue 3
- **开发语言:** TypeScript
- **构建工具:** Vite
- **UI 框架:** Element Plus
- **状态管理:** Pinia
- **路由管理:** Vue Router
- **HTTP 客户端:** Axios
- **样式预处理:** Sass
- **工具类:** TailwindCSS
- **Markdown 编辑器:** MD Editor V3

## 项目结构

```
blog-frontend/
├── docs/           # 项目文档
├── front/          # 前台项目
├── admin/          # 后台项目
├── package.json    # 项目依赖
└── .vscode/        # VS Code配置
```

## 功能特性

### 后台管理系统

1. **文章管理**
   - 支持 Markdown 编辑
   - 文章草稿和发布
   - 文章分类和标签
   - 文章封面上传
   - 自动保存
   - 历史版本

2. **分类管理**
   - 分类列表
   - 创建/编辑/删除分类
   - 分类描述

3. **标签管理**
   - 标签列表
   - 创建/编辑/删除标签
   - 标签描述
   - 文章数统计

4. **回收站**
   - 已删除文章列表
   - 恢复文章
   - 彻底删除
   - 清空回收站

5. **系统功能**
   - 用户认证
   - 主题切换(明亮/暗黑)
   - 响应式设计

### 前台展示系统

> 待开发...

## 开发指南

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
# 安装项目依赖
npm install

# 安装后台项目依赖
cd admin && npm install

# 安装前台项目依赖
cd front && npm install
```

### 开发服务

```bash
# 启动后台开发服务
cd admin && npm run dev

# 启动前台开发服务
cd front && npm run dev
```

### 构建部署

```bash
# 构建后台项目
cd admin && npm run build

# 构建前台项目
cd front && npm run build
```

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 风格指南
- 使用 TypeScript 类型声明

## 主题定制

- 支持明亮/暗黑主题切换
- 使用 CSS 变量实现主题色定制
- 支持 Element Plus 组件主题定制

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 许可证

[MIT](LICENSE)
