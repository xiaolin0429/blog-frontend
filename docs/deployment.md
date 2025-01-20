# 前端项目部署文档

## 目录
- [环境要求](#环境要求)
- [前台项目](#前台项目)
  - [目录结构](#前台目录结构)
  - [开发环境](#前台开发环境)
  - [生产环境](#前台生产环境)
- [后台项目](#后台项目)
  - [目录结构](#后台目录结构)
  - [开发环境](#后台开发环境)
  - [生产环境](#后台生产环境)
- [开发规范](#开发规范)

## 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+
- 操作系统：Windows/Linux/MacOS
- 开发工具：推荐使用 VS Code
- 浏览器：推荐使用 Chrome 最新版

## 前台项目

### 前台目录结构

```
frontend/front/
├── src/                    # 源代码目录
│   ├── views/             # 页面组件
│   │   ├── home/         # 首页
│   │   ├── post/         # 文章页
│   │   ├── category/     # 分类页
│   │   ├── tag/          # 标签页
│   │   ├── search/       # 搜索页
│   │   ├── auth/         # 认证页
│   │   └── about/        # 关于页
│   ├── components/        # 通用组件
│   │   ├── business/     # 业务组件
│   │   ├── common/       # 通用组件
│   │   └── layout/       # 布局组件
│   ├── store/            # 状态管理
│   ├── api/              # API 接口
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义 hooks
│   ├── styles/           # 样式文件
│   ├── assets/           # 静态资源
│   ├── types/            # TS 类型定义
│   ├── router/           # 路由配置
│   └── layouts/          # 布局组件
├── public/                # 静态资源目录
├── .env                   # 环境变量配置
├── vite.config.ts         # Vite 配置
├── package.json           # 项目配置
└── tsconfig.json          # TypeScript 配置
```

### 前台开发环境

1. 进入前台项目目录：
```bash
# 启动路径：E:/project/blog/frontend/front
cd E:/project/blog/frontend/front
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
```

3. 配置环境变量：
```bash
copy .env.example .env
```

4. 启动开发服务器：
```bash
npm run dev
# 或
yarn dev
```

访问地址：http://localhost:5173

## 后台项目

### 后台目录结构

```
frontend/admin/
├── src/                    # 源代码目录
│   ├── views/             # 页面组件
│   │   ├── dashboard/    # 仪表盘
│   │   │   ├── components/  # 仪表盘组件
│   │   │   └── hooks/      # 仪表盘钩子
│   │   ├── post/         # 文章管理
│   │   │   ├── list/       # 文章列表
│   │   │   ├── edit/       # 文章编辑
│   │   │   └── category/   # 文章分类
│   │   ├── category/     # 分类管理
│   │   │   ├── list/       # 分类列表
│   │   │   └── edit/       # 分类编辑
│   │   ├── tag/          # 标签管理
│   │   │   ├── list/       # 标签列表
│   │   │   └── edit/       # 标签编辑
│   │   ├── user/         # 用户管理
│   │   │   ├── list/       # 用户列表
│   │   │   └── edit/       # 用户编辑
│   │   ├── system/       # 系统管理
│   │   │   ├── role/       # 角色管理
│   │   │   ├── menu/       # 菜单管理
│   │   │   └── log/        # 日志管理
│   │   ├── settings/     # 系统设置
│   │   │   ├── site/       # 站点设置
│   │   │   └── theme/      # 主题设置
│   │   └── profile/      # 个人中心
│   ├── components/        # 通用组件
│   │   ├── business/     # 业务组件
│   │   │   ├── Table/      # 表格组件
│   │   │   ├── Form/       # 表单组件
│   │   │   └── Editor/     # 编辑器组件
│   │   ├── common/       # 通用组件
│   │   │   ├── Button/     # 按钮组件
│   │   │   ├── Input/      # 输入组件
│   │   │   └── Modal/      # 弹窗组件
│   │   └── layout/       # 布局组件
│   │       ├── Header/     # 头部组件
│   │       ├── Sidebar/    # 侧边栏组件
│   │       └── Footer/     # 底部组件
│   ├── store/            # 状态管理
│   │   ├── modules/      # 状态模块
│   │   │   ├── user/       # 用户状态
│   │   │   ├── app/        # 应用状态
│   │   │   └── permission/ # 权限状态
│   │   └── types/        # 状态类型
│   ├── api/              # API 接口
│   │   ├── modules/      # 接口模块
│   │   │   ├── user/       # 用户接口
│   │   │   ├── post/       # 文章接口
│   │   │   └── system/     # 系统接口
│   │   └── types/        # 接口类型
│   ├── utils/            # 工具函数
│   │   ├── request/      # 请求工具
│   │   ├── auth/         # 认证工具
│   │   └── validate/     # 验证工具
│   ├── hooks/            # 自定义 hooks
│   │   ├── useTable/     # 表格 hooks
│   │   ├── useForm/      # 表单 hooks
│   │   └── useAuth/      # 认证 hooks
│   ├── styles/           # 样式文件
│   │   ├── themes/       # 主题样式
│   │   ├── components/   # 组件样式
│   │   └── layouts/      # 布局样式
│   ├── assets/           # 静态资源
│   │   ├── images/       # 图片资源
│   │   └── icons/        # 图标资源
│   ├── types/            # TS 类型定义
│   │   ├── api/          # API 类型
│   │   ├── store/        # 状态类型
│   │   └── components/   # 组件类型
│   ├── router/           # 路由配置
│   │   ├── modules/      # 路由模块
│   │   └── guards/       # 路由守卫
│   └── layouts/          # 布局模板
│       ├── default/      # 默认布局
│       └── auth/         # 认证布局
├── public/                # 静态资源目录
├── .env                   # 环境变量配置
├── vite.config.ts         # Vite 配置
├── package.json           # 项目配置
└── tsconfig.json          # TypeScript 配置
```

### 后台开发环境

1. 进入后台项目目录：
```bash
# 启动路径：E:/project/blog/frontend/admin
cd E:/project/blog/frontend/admin
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器：
```bash
npm run dev
# 或
yarn dev
```

访问地址：http://localhost:5174

## 开发规范

1. 代码规范：
- 遵循项目的 ESLint 和 TypeScript 配置
- 使用 Prettier 进行代码格式化
- 组件和工具函数需要编写注释

2. 开发流程：
- 遵循组件化开发原则
- 使用 TypeScript 进行类型检查
- 保持代码简洁，避免重复代码

3. 调试工具：
- Vue DevTools
- Chrome DevTools
- Vite HMR

4. 常见问题：
- 如遇到 HMR 不生效，请检查文件命名
- 代理配置问题，检查 `vite.config.ts`
- 类型报错，检查 `tsconfig.json`

5. 注意事项：
- 前台和后台项目使用不同的端口，避免冲突
- 前台和后台共用的组件或工具函数应该提取到公共目录
- 保持前后台的代码风格一致 