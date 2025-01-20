# 样式目录结构说明

```
styles/
├── components/     # 公共组件样式
│   ├── button/
│   ├── form/
│   ├── table/
│   └── ...
├── layouts/        # 布局相关样式
│   ├── default/
│   ├── admin/
│   └── ...
├── views/          # 页面视图样式
│   ├── dashboard/
│   ├── post/
│   ├── user/
│   └── ...
├── themes/         # 主题相关样式
│   ├── variables/  # 主题变量
│   ├── dark/      # 暗色主题
│   └── light/     # 亮色主题
└── index.scss     # 样式入口文件
```

## 样式编写规范

1. 命名规范
   - 文件名使用kebab-case（如：`post-list.scss`）
   - 类名使用BEM命名规范
   - 组件样式使用组件名作为顶级类名

2. 样式作用域
   - 组件样式使用 `scoped` 或顶级类名限制作用域
   - 主题变量统一在 `themes` 目录管理
   - 公共样式放在 `components` 目录

3. 样式复用
   - 使用 SCSS 的 mixin 和 extend 特性
   - 抽取公共样式到独立文件
   - 使用变量管理主题色和常用值

4. Element Plus 样式覆盖
   - 使用 `:deep()` 选择器处理组件样式
   - 主题相关的覆盖放在 `themes` 目录
   - 组件级的覆盖放在对应组件样式文件中 