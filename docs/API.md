# 个人博客系统API文档

## 接口规范

### 基础信息
- 基础路径：`/api/v1`
- 请求方式：REST风格
- 数据格式：JSON
- 字符编码：UTF-8
- 请求头：
  - Content-Type: application/json
  - Accept: application/json
  - Authorization: Bearer {access} (需要认证的接口)

### 认证方式
- Bearer Token认证
- 在请求头中添加：`Authorization: Bearer {access}`
- Token有效期：
  - access token: 24小时
  - refresh token: 7天

### 响应格式
```json
{
    "code": 200,          // 业务状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {},          // 响应数据（可能为null）
    "timestamp": "",     // 时间戳(ISO格式)（必返回）
    "requestId": ""      // 请求ID（必返回）
}
```

### HTTP状态码说明
所有成功的API请求都返回HTTP状态码200，具体的业务状态通过响应体中的code字段表示。
特殊情况：
- 401: 未认证（DRF权限错误）
- 403: 权限不足（DRF权限错误）
- 404: 路由不存在
- 500: 服务器错误

### 业务状态码
- 200: 操作成功
- 400: 请求参数错误
- 401: 未登录
- 403: 权限不足
- 404: 资源不存在
- 409: 资源冲突（如重复的标签名）
- 429: 请求过于频繁

### 错误响应格式
1. DRF权限错误（401/403）:
```json
{
    "detail": "错误信息"
}
```

2. 业务错误:
```json
{
    "code": 400,           // 业务状态码
    "message": "错误信息",  // 错误描述
    "data": null,         // 可能包含详细错误信息
    "timestamp": "",      // 时间戳
    "requestId": ""       // 请求ID
}
```

### 分页格式
- 请求参数
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认10，最大50）
  - ordering: 排序字段（可选，默认-created_at，前缀-表示降序）

- 响应格式
```json
{
    "total": number,      // 总数（必返回）
    "items": [],         // 数据列表（必返回）
    "page": number,      // 当前页码（必返回）
    "size": number,      // 每页数量（必返回）
    "pages": number      // 总页数（必返回）
}
```

### 通用状态码
- 200: 成功
- 201: 创建成功
- 204: 删除成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 429: 请求过于频繁
- 500: 服务器错误

## 接口详情

### 1. 用户认证

#### 1.1 用户登录
- **接口说明**: 用户登录接口，成功后返回访问令牌和刷新令牌
- **请求方式**: POST
- **接口路径**: `/auth/login`
- **请求头**:
  - Content-Type: application/json
- **请求参数**
```json
{
    "username": "string",  // 用户名（必填，长度4-20）
    "password": "string",  // 密码（必填，长度6-20）
    "remember": boolean    // 记住我（可选，默认false）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "refresh": "string",   // 刷新令牌（必返回）
        "access": "string",    // 访问令牌（必返回）
        "user": {             // 用户信息（必返回）
            "id": number,           // 用户ID（必返回）
            "username": "string",   // 用户名（必返回）
            "email": "string",      // 邮箱（必返回）
            "nickname": "string",   // 昵称（可能为null）
            "avatar": "string",     // 头像URL（可能为null）
            "date_joined": "string",// 注册时间（必返回）
            "last_login": "string"  // 最后登录时间（可能为null）
        }
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 用户名或密码错误
  - 403: 账号已被锁定
  - 429: 登录尝试次数过多

#### 1.2 刷新Token
- **接口说明**: 使用刷新令牌获取新的访问令牌
- **请求方式**: POST
- **接口路径**: `/auth/refresh`
- **请求头**:
  - Content-Type: application/json
- **请求参数**
```json
{
    "refresh": "string"  // 刷新令牌（必填）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "access": "string"    // 新的访问令牌（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 刷新令牌无效或已过期

#### 1.3 用户登出
- **接口说明**: 用户登出，使当前token失效
- **请求方式**: POST
- **接口路径**: `/auth/logout`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**: 无
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权或token已失效

#### 1.4 用户注册
- **接口说明**: 新用户注册
- **请求方式**: POST
- **接口路径**: `/users`
- **请求头**:
  - Content-Type: application/json
- **请求参数**
```json
{
    "username": "string",   // 用户名（必填，长度4-20，只能包含字母、数字、下划线）
    "email": "string",      // 邮箱（必填，有效的邮箱格式）
    "password": "string",   // 密码（必填，长度6-20，必须包含字母和数字）
    "password2": "string",  // 确认密码（必填，必须与password一致）
    "nickname": "string"    // 昵称（可选，长度2-20）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 用户ID（必返回）
        "username": "string", // 用户名（必返回）
        "email": "string",    // 邮箱（必返回）
        "nickname": "string"  // 昵称（可能为null）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 409: 用户名或邮箱已存在

#### 1.5 获取当前用户信息
- **接口说明**: 获取当前登录用户的详细信息
- **请求方式**: GET
- **接口路径**: `/users/me`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**: 无
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 用户ID（必返回）
        "username": "string", // 用户名（必返回）
        "email": "string",    // 邮箱（必返回）
        "nickname": "string", // 昵称（可能为null）
        "avatar": "string",   // 头像URL（可能为null）
        "bio": "string",      // 个人简介（可能为null）
        "date_joined": "string", // 注册时间（必返回）
        "last_login": "string"   // 最后登录时间（可能为null）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权或token已失效

#### 1.6 更新当前用户信息
- **接口说明**: 更新当前登录用户的信息
- **请求方式**: PUT
- **接口路径**: `/users/me`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "nickname": "string",  // 昵称（可选，长度2-20）
    "avatar": "string",    // 头像URL（可选，有效的URL格式）
    "bio": "string"       // 个人简介（可选，最大长度500）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 用户ID（必返回）
        "username": "string", // 用户名（必返回）
        "email": "string",    // 邮箱（必返回）
        "nickname": "string", // 昵称（可能为null）
        "avatar": "string",   // 头像URL（可能为null）
        "bio": "string"       // 个人简介（可能为null）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权或token已失效

### 2. 文章管理

#### 2.1 创建文章
- **接口说明**: 创建新文章
- **请求方式**: POST
- **接口路径**: `/posts`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "title": "string",         // 文章标题（必填，长度2-100）
    "content": "string",       // 文章内容（必填，支持Markdown格式）
    "excerpt": "string",       // 文章摘要（可选，最大长度500）
    "category": number,        // 分类ID（必填，必须是有效的分类ID）
    "tags": number[],         // 标签ID数组（可选，每个ID必须是有效的标签ID）
    "status": "string",       // 文章状态（必填）：draft(草稿)、published(已发布)、private(私密)
    "meta_description": "string", // META描述（可选，最大长度200）
    "meta_keywords": "string",    // META关键词（可选，最大长度100）
    "published_at": "string"      // 发布时间（可选，status为published时必填，ISO格式）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 文章ID（必返回）
        "title": "string",    // 文章标题（必返回）
        "status": "string",   // 文章状态（必返回）
        "created_at": "string" // 创建时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限创建文章
  - 404: 分类或标签不存在

#### 2.2 获取文章列表
- **接口说明**: 获取文章列表，支持分页、筛选和排序
- **请求方式**: GET
- **接口路径**: `/posts`
- **请求参数**:
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认10，最大50）
  - status: 文章状态（可选，默认published）：draft|published|private
  - category: 分类ID（可选）
  - tags: 标签ID（可选，多个用逗号分隔）
  - search: 搜索关键词（可选，搜索标题、内容、摘要）
  - ordering: 排序字段（可选，默认-created_at）
    - 支持字段：created_at、published_at、view_count、comment_count、like_count
    - 降序在字段前加-，如-created_at
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 总数（必返回）
        "page": number,       // 当前页码（必返回）
        "size": number,       // 每页数量（必返回）
        "pages": number,      // 总页数（必返回）
        "items": [           // 文章列表（必返回）
            {
                "id": number,           // 文章ID（必返回）
                "title": "string",      // 文章标题（必返回）
                "slug": "string",       // 文章别名（必返回）
                "excerpt": "string",    // 文章摘要（可能为null）
                "author": {            // 作者信息（必返回）
                    "id": number,       // 作者ID（必返回）
                    "username": "string", // 用户名（必返回）
                    "nickname": "string"  // 昵称（可能为null）
                },
                "category": {          // 分类信息（必返回）
                    "id": number,       // 分类ID（必返回）
                    "name": "string"    // 分类名称（必返回）
                },
                "tags": [             // 标签列表（必返回）
                    {
                        "id": number,   // 标签ID（必返回）
                        "name": "string" // 标签名称（必返回）
                    }
                ],
                "status": "string",     // 文章状态（必返回）
                "view_count": number,   // 浏览量（必返回）
                "comment_count": number, // 评论数（必返回）
                "like_count": number,   // 点赞数（必返回）
                "created_at": "string", // 创建时间（必返回）
                "published_at": "string" // 发布时间（可能为null）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误

#### 2.3 获取文章详情
- **接口说明**: 获取文章详细信息
- **请求方式**: GET
- **接口路径**: `/posts/{id}`
- **路径参数**:
  - id: 文章ID（必填）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,           // 文章ID（必返回）
        "title": "string",      // 文章标题（必返回）
        "slug": "string",       // 文章别名（必返回）
        "content": "string",    // 文章内容（必返回）
        "excerpt": "string",    // 文章摘要（可能为null）
        "author": {            // 作者信息（必返回）
            "id": number,       // 作者ID（必返回）
            "username": "string", // 用户名（必返回）
            "nickname": "string"  // 昵称（可能为null）
        },
        "category": {          // 分类信息（必返回）
            "id": number,       // 分类ID（必返回）
            "name": "string"    // 分类名称（必返回）
        },
        "tags": [             // 标签列表（必返回）
            {
                "id": number,   // 标签ID（必返回）
                "name": "string" // 标签名称（必返回）
            }
        ],
        "status": "string",     // 文章状态（必返回）
        "view_count": number,   // 浏览量（必返回）
        "comment_count": number, // 评论数（必返回）
        "like_count": number,   // 点赞数（必返回）
        "meta_description": "string", // META描述（可能为null）
        "meta_keywords": "string",    // META关键词（可能为null）
        "created_at": "string",      // 创建时间（必返回）
        "updated_at": "string",      // 更新时间（必返回）
        "published_at": "string"     // 发布时间（可能为null）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权（私密文章需要登录）
  - 403: 无权限查看
  - 404: 文章不存在

#### 2.4 更新文章
- **接口说明**: 更新文章信息
- **请求方式**: PUT
- **接口路径**: `/posts/{id}`
- **路径参数**:
  - id: 文章ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "title": "string",         // 文章标题（必填，长度2-100）
    "content": "string",       // 文章内容（必填，支持Markdown格式）
    "excerpt": "string",       // 文章摘要（可选，最大长度500）
    "category": number,        // 分类ID（必填，必须是有效的分类ID）
    "tags": number[],         // 标签ID数组（可选，每个ID必须是有效的标签ID）
    "status": "string",       // 文章状态（必填）：draft|published|private
    "meta_description": "string", // META描述（可选，最大长度200）
    "meta_keywords": "string"     // META关键词（可选，最大长度100）
}
```
- **说明**:
  - published_at 字段在文章发布后不能修改
  - 私密文章不能改为已发布状态
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 文章ID（必返回）
        "title": "string",    // 文章标题（必返回）
        "status": "string",   // 文章状态（必返回）
        "updated_at": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改文章
  - 404: 文章不存在或分类/标签不存在

#### 2.5 删除文章
- **接口说明**: 删除指定文章
- **请求方式**: DELETE
- **接口路径**: `/posts/{id}`
- **路径参数**:
  - id: 文章ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限删除文章
  - 404: 文章不存在

#### 2.6 文章点赞
- **接口说明**: 对文章进行点赞或取消点赞
- **请求方式**: POST
- **接口路径**: `/posts/{id}/like`
- **路径参数**:
  - id: 文章ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "liked": boolean,     // 是否已点赞（必返回）
        "like_count": number  // 最新点赞数（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 404: 文章不存在

#### 2.7 增加浏览量
- **接口说明**: 增加文章浏览量
- **请求方式**: POST
- **接口路径**: `/posts/{id}/view`
- **路径参数**:
  - id: 文章ID（必填）
- **请求头**:
  - Authorization: Bearer {access}（可选）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "view_count": number  // 最新浏览量（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 404: 文章不存在
  - 429: 请求过于频繁

#### 2.8 获取文章归档
- **接口说明**: 获取文章归档信息，按年月分组
- **请求方式**: GET
- **接口路径**: `/posts/archive`
- **请求参数**:
  - year: 年份（可选，格式YYYY）
  - month: 月份（可选，格式MM，year不为空时有效）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 文章总数（必返回）
        "archives": {        // 归档数据（必返回）
            "year": {         // 年份（YYYY）
                "count": number,  // 该年文章数
                "months": {      // 月份数据
                    "month": {    // 月份（MM）
                        "count": number, // 该月文章数
                        "posts": [      // 文章列表
                            {
                                "id": number,     // 文章ID（必返回）
                                "title": "string", // 文章标题（必返回）
                                "slug": "string",  // 文章别名（必返回）
                                "published_at": "string" // 发布时间（必返回）
                            }
                        ]
                    }
                }
            }
        }
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误

#### 2.9 自动保存文章
- **接口说明**: 自动保存文章内容。每10秒最多保存一次，每2分钟强制保存一次。
- **请求方式**: POST
- **接口路径**: `/api/v1/posts/{id}/auto-save`
- **请求头**:
  - Authorization: Bearer {access}（必填）
  - Content-Type: application/json
- **请求参数**
```json
{
    "title": "string",     // 文章标题
    "content": "string",   // 文章内容
    "excerpt": "string",   // 文章摘要（可选）
    "category": 0,        // 分类ID（可选）
    "tags": [0],         // 标签ID列表（可选）
    "force_save": false  // 是否强制保存（可选，距离上次保存超过2分钟时可用）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "version": 1,                              // 当前版本号
        "next_save_time": "2024-01-25T12:00:10Z"  // 下次允许保存的时间
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权（未登录或token无效）
  - 403: 无权限（非文章作者）
  - 404: 文章不存在
  - 429: 请求过于频繁（需等待10秒）
  - 500: 数据库错误

#### 2.10 获取自动保存内容
- **接口说明**: 获取文章最近一次自动保存的内容。如果没有自动保存内容，则返回当前内容。
- **请求方式**: GET
- **接口路径**: `/api/v1/posts/{id}/auto-save`
- **请求头**:
  - Authorization: Bearer {access}（必填）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "title": "string",                        // 文章标题
        "content": "string",                      // 文章内容
        "excerpt": "string",                      // 文章摘要
        "category": 0,                           // 分类ID
        "tags": [0],                            // 标签ID列表
        "version": 1,                           // 版本号
        "auto_save_time": "2024-01-25T12:00:00Z" // 自动保存时间
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权（未登录或token无效）
  - 403: 无权限（非文章作者）
  - 404: 文章不存在

### 3. 分类管理

#### 3.1 获取分类列表
- **接口说明**: 获取所有分类列表，支持分页、排序和筛选。返回的分类列表按照order和id排序，子分类也遵循相同的排序规则。
- **请求方式**: GET
- **接口路径**: `/categories`
- **请求参数**:
  - search: 搜索关键词（可选，搜索名称、描述）
  - ordering: 排序字段（可选，支持order, name, created_at）
  - parent: 父分类ID（可选，传null获取顶级分类，不传则获取所有分类）
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认10，最大50）

- **说明**:
  1. 分类支持无限层级嵌套，每个分类都有一个level字段表示其在树中的层级（0表示顶级分类）
  2. children字段包含当前分类的所有子分类，子分类同样可以包含其自己的children
  3. 当不传parent参数时，API返回所有分类；当parent=null时，只返回顶级分类
  4. 分类列表默认按order字段升序排序，order相同时按id升序排序

- **响应数据**:
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 分类总数（必返回）
        "items": [           // 分类列表（必返回）
            {
                "id": number,         // 分类ID（必返回）
                "name": "string",     // 分类名称（必返回）
                "description": "string", // 分类描述（可能为null）
                "parent": number,     // 父分类ID（可能为null）
                "parent_name": "string", // 父分类名称（可能为null）
                "level": 0,           // 分类层级，0表示顶级分类
                "order": number,      // 排序（必返回）
                "post_count": number, // 文章数量（必返回）
                "children": [        // 子分类列表，支持无限层级嵌套
                    {
                        "id": number,
                        "name": "string",
                        "description": "string",
                        "level": 1,
                        "order": number,
                        "post_count": number,
                        "children": []  // 递归嵌套的子分类
                    }
                ],
                "created_at": "string",
                "updated_at": "string"
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```

#### 3.2 创建分类
- **接口说明**: 创建新分类
- **请求方式**: POST
- **接口路径**: `/categories`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "name": "string",        // 分类名称（必填，长度2-50）
    "description": "string", // 分类描述（可选，最大长度200）
    "parent": number,        // 父分类ID（可选，必须是有效的分类ID）
    "order": number         // 排序权重（可选，默认0，值越小排序越靠前）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 分类ID（必返回）
        "name": "string",     // 分类名称（必返回）
        "description": "string", // 分类描述（可能为null）
        "parent": number,     // 父分类ID（可能为null）
        "parent_name": "string", // 父分类名称（可能为null）
        "level": 0,           // 分类层级，0表示顶级分类
        "order": number,      // 排序（必返回）
        "post_count": number, // 文章数量（必返回）
        "children": [        // 子分类列表，支持无限层级嵌套
            {
                "id": number,
                "name": "string",
                "description": "string",
                "level": 1,
                "order": number,
                "post_count": number,
                "children": []  // 递归嵌套的子分类
            }
        ],
        "created_at": "string",
        "updated_at": "string"
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限创建分类
  - 404: 父分类不存在
  - 409: 分类名称已存在

#### 3.3 更新分类
- **接口说明**: 更新分类信息
- **请求方式**: PUT
- **接口路径**: `/categories/{id}`
- **路径参数**:
  - id: 分类ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "name": "string",        // 分类名称（必填，长度2-50）
    "description": "string", // 分类描述（可选，最大长度200）
    "parent": number,        // 父分类ID（可选，必须是有效的分类ID）
    "order": number         // 排序权重（可选，默认0，值越小排序越靠前）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 分类ID（必返回）
        "name": "string",     // 分类名称（必返回）
        "description": "string", // 分类描述（可能为null）
        "parent": number,     // 父分类ID（可能为null）
        "parent_name": "string", // 父分类名称（可能为null）
        "level": 0,           // 分类层级，0表示顶级分类
        "order": number,      // 排序（必返回）
        "post_count": number, // 文章数量（必返回）
        "children": [        // 子分类列表，支持无限层级嵌套
            {
                "id": number,
                "name": "string",
                "description": "string",
                "level": 1,
                "order": number,
                "post_count": number,
                "children": []  // 递归嵌套的子分类
            }
        ],
        "updated_at": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改分类
  - 404: 分类不存在或父分类不存在
  - 409: 分类名称已存在

#### 3.4 删除分类
- **接口说明**: 删除指定分类。如果分类或其子分类下存在文章，则无法删除。如果分类下有子分类但整个分类链路都没有文章引用，则会递归删除所有子分类。
- **请求方式**: DELETE
- **接口路径**: `/categories/{id}`
- **路径参数**:
  - id: 分类ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 204,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限删除分类
  - 404: 分类不存在
  - 422: 分类或其子分类下存在文章，无法删除

### 4. 标签管理

#### 4.1 获取标签列表
- **接口说明**: 获取所有标签列表，支持搜索和排序
- **请求方式**: GET
- **接口路径**: `/tags`
- **请求参数**:
  - search: 搜索关键词（可选，搜索名称、描述）
  - ordering: 排序字段（可选，默认-post_count）
    - 支持字段：id、name、post_count
    - 降序在字段前加-，如-post_count
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认20，最大100）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 标签总数（必返回）
        "page": number,       // 当前页码（必返回）
        "size": number,       // 每页数量（必返回）
        "pages": number,      // 总页数（必返回）
        "items": [           // 标签列表（必返回）
            {
                "id": number,         // 标签ID（必返回）
                "name": "string",     // 标签名称（必返回）
                "description": "string", // 标签描述（可能为null）
                "post_count": number,  // 文章数量（必返回）
                "created_at": "string" // 创建时间（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误

#### 4.2 创建标签
- **接口说明**: 创建新标签
- **请求方式**: POST
- **接口路径**: `/tags`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "name": "string",        // 标签名称（必填，长度2-50）
    "description": "string"  // 标签描述（可选，最大长度200）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 标签ID（必返回）
        "name": "string",     // 标签名称（必返回）
        "description": "string", // 标签描述（可能为null）
        "created_at": "string" // 创建时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限创建标签
  - 409: 标签名称已存在

#### 4.3 更新标签
- **接口说明**: 更新标签信息
- **请求方式**: PUT
- **接口路径**: `/tags/{id}`
- **路径参数**:
  - id: 标签ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "name": "string",        // 标签名称（必填，长度2-50）
    "description": "string"  // 标签描述（可选，最大长度200）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": number,         // 标签ID（必返回）
        "name": "string",     // 标签名称（必返回）
        "description": "string", // 标签描述（可能为null）
        "updated_at": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改标签
  - 404: 标签不存在
  - 409: 标签名称已存在

#### 4.4 删除标签
- **接口说明**: 删除指定标签
- **请求方式**: DELETE
- **接口路径**: `/tags/{id}`
- **路径参数**:
  - id: 标签ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限删除标签
  - 404: 标签不存在
  - 409: 标签下存在文章，不能删除

#### 4.5 批量创建标签
- **接口说明**: 批量创建多个标签
- **请求方式**: POST
- **接口路径**: `/tags/batch`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "tags": [             // 标签列表（必填，最多50个）
        {
            "name": "string",        // 标签名称（必填，长度2-50）
            "description": "string"  // 标签描述（可选，最大长度200）
        }
    ]
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "success": number,    // 成功创建数量（必返回）
        "failed": number,     // 失败数量（必返回）
        "items": [          // 创建结果列表（必返回）
            {
                "name": "string",    // 标签名称（必返回）
                "success": boolean,  // 是否成功（必返回）
                "message": "string", // 失败原因（失败时返回）
                "id": number        // 标签ID（成功时返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限创建标签

### 5. 插件管理

#### 5.1 获取插件列表
- **接口说明**: 获取所有插件列表，支持状态筛选
- **请求方式**: GET
- **接口路径**: `/plugins`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - status: 插件状态（可选，默认all）：all|enabled|disabled
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认20，最大50）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 插件总数（必返回）
        "page": number,       // 当前页码（必返回）
        "size": number,       // 每页数量（必返回）
        "pages": number,      // 总页数（必返回）
        "items": [           // 插件列表（必返回）
            {
                "id": "string",       // 插件ID（必返回）
                "name": "string",     // 插件名称（必返回）
                "version": "string",  // 插件版本（必返回）
                "description": "string", // 插件描述（可能为null）
                "author": "string",   // 作者（必返回）
                "homepage": "string", // 主页（可能为null）
                "enabled": boolean,   // 是否启用（必返回）
                "install_time": "string", // 安装时间（必返回）
                "update_time": "string",  // 更新时间（必返回）
                "dependencies": [     // 依赖列表（必返回）
                    {
                        "name": "string",    // 依赖名称（必返回）
                        "version": "string"  // 依赖版本（必返回）
                    }
                ],
                "settings": {        // 插件配置（可能为null）
                    "key": "value"   // 配置项
                }
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看插件列表

#### 5.2 安装插件
- **接口说明**: 安装新插件
- **请求方式**: POST
- **接口路径**: `/plugins`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "pluginId": "string",  // 插件ID（必填，长度2-50）
    "version": "string"    // 版本号（必填，符合语义化版本规范）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": "string",       // 插件ID（必返回）
        "name": "string",     // 插件名称（必返回）
        "version": "string",  // 插件版本（必返回）
        "description": "string", // 插件描述（可能为null）
        "author": "string",   // 作者（必返回）
        "homepage": "string", // 主页（可能为null）
        "enabled": boolean,   // 是否启用（必返回）
        "install_time": "string" // 安装时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限安装插件
  - 404: 插件不存在
  - 409: 插件已安装或版本冲突

#### 5.3 启用/禁用插件
- **接口说明**: 启用或禁用指定插件
- **请求方式**: PUT
- **接口路径**: `/plugins/{pluginId}/status`
- **路径参数**:
  - pluginId: 插件ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "enabled": boolean  // 是否启用（必填）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": "string",       // 插件ID（必返回）
        "enabled": boolean,   // 是否启用（必返回）
        "update_time": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改插件状态
  - 404: 插件不存在
  - 409: 插件依赖冲突

#### 5.4 卸载插件
- **接口说明**: 卸载指定插件
- **请求方式**: DELETE
- **接口路径**: `/plugins/{pluginId}`
- **路径参数**:
  - pluginId: 插件ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限卸载插件
  - 404: 插件不存在
  - 409: 插件被其他插件依赖，不能卸载

#### 5.5 更新插件配置
- **接口说明**: 更新插件配置信息
- **请求方式**: PUT
- **接口路径**: `/plugins/{pluginId}/settings`
- **路径参数**:
  - pluginId: 插件ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "settings": {        // 插件配置（必填）
        "key": "value"   // 配置项（根据插件定义）
    }
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": "string",       // 插件ID（必返回）
        "settings": {        // 最新配置（必返回）
            "key": "value"   // 配置项
        },
        "update_time": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改插件配置
  - 404: 插件不存在

### 6. 主题管理

#### 6.1 获取主题列表
- **接口说明**: 获取所有可用主题列表及当前使用的主题
- **请求方式**: GET
- **接口路径**: `/themes`
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "current": "string",  // 当前使用的主题ID（必返回）
        "themes": [          // 主题列表（必返回）
            {
                "id": "string",       // 主题ID（必填）
                "name": "string",     // 主题名称（必填）
                "version": "string",  // 主题版本（必填）
                "description": "string", // 主题描述（可能为null）
                "author": "string",   // 作者（必填）
                "preview": "string",  // 预览图URL（可能为null）
                "config": {          // 主题配置（必填）
                    "colors": [      // 支持的颜色方案（必填）
                        "light",
                        "dark"
                    ],
                    "layouts": [     // 支持的布局（必填）
                        "classic",
                        "modern"
                    ],
                    "widgets": [     // 支持的小部件（必填）
                        "recent",
                        "categories",
                        "tags"
                    ]
                }
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限查看主题列表

#### 6.2 切换主题
- **接口说明**: 切换到指定主题
- **请求方式**: PUT
- **接口路径**: `/themes/current`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "themeId": "string"  // 主题ID（必填，必须是有效的主题ID）
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "id": "string",       // 主题ID（必返回）
        "name": "string",     // 主题名称（必返回）
        "version": "string",  // 主题版本（必返回）
        "update_time": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限切换主题
  - 404: 主题不存在

#### 6.3 更新主题配置
- **接口说明**: 更新指定主题的配置信息
- **请求方式**: PUT
- **接口路径**: `/themes/{themeId}/config`
- **路径参数**:
  - themeId: 主题ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: application/json
- **请求参数**
```json
{
    "colors": {  // 颜色配置（可选）
        "primary": "string",    // 主色（可选，有效的颜色值）
        "secondary": "string",  // 次色（可选，有效的颜色值）
        "background": "string", // 背景色（可选，有效的颜色值）
        "text": "string"       // 文本色（可选，有效的颜色值）
    },
    "layout": {  // 布局配置（可选）
        "sidebar": "left|right|none", // 侧边栏位置（可选）
        "headerFixed": boolean,       // 头部固定（可选，默认false）
        "footerFixed": boolean        // 底部固定（可选，默认false）
    },
    "typography": {  // 排版配置（可选）
        "fontFamily": "string", // 字体（可选，有效的字体名称）
        "fontSize": "string",   // 字号（可选，有效的CSS尺寸值）
        "lineHeight": "string"  // 行高（可选，有效的CSS值）
    }
}
```
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "themeId": "string",  // 主题ID（必返回）
        "config": {          // 最新配置（必返回）
            "colors": {      // 颜色配置
                "primary": "string",
                "secondary": "string",
                "background": "string",
                "text": "string"
            },
            "layout": {      // 布局配置
                "sidebar": "string",
                "headerFixed": boolean,
                "footerFixed": boolean
            },
            "typography": {  // 排版配置
                "fontFamily": "string",
                "fontSize": "string",
                "lineHeight": "string"
            }
        },
        "update_time": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限修改主题配置
  - 404: 主题不存在

#### 6.4 获取主题配置
- **接口说明**: 获取指定主题的配置信息
- **请求方式**: GET
- **接口路径**: `/themes/{themeId}/config`
- **路径参数**:
  - themeId: 主题ID（必填）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "themeId": "string",  // 主题ID（必返回）
        "config": {          // 当前配置（必返回）
            "colors": {      // 颜色配置
                "primary": "string",
                "secondary": "string",
                "background": "string",
                "text": "string"
            },
            "layout": {      // 布局配置
                "sidebar": "string",
                "headerFixed": boolean,
                "footerFixed": boolean
            },
            "typography": {  // 排版配置
                "fontFamily": "string",
                "fontSize": "string",
                "lineHeight": "string"
            }
        },
        "update_time": "string" // 更新时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限查看主题配置
  - 404: 主题不存在

### 7. 系统配置

#### 7.1 获取系统配置
- **GET** `/settings`
- **示例**
  - 请求示例：
  ```bash
  curl -X GET http://api.example.com/api/v1/settings \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```
  - 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "site": {
        "title": "My Tech Blog",
        "description": "A blog about programming and technology",
        "keywords": "programming,technology,web development",
        "logo": "/uploads/logo.png",
        "favicon": "/uploads/favicon.ico"
      },
      "user": {
        "allowRegistration": true,
        "defaultRole": "subscriber",
        "loginAttempts": 5,
        "lockDuration": 1800
      },
      "comment": {
        "enabled": true,
        "moderation": true,
        "allowAnonymous": false,
        "notification": true
      },
      "cache": {
        "enabled": true,
        "duration": 3600,
        "types": ["page", "post", "api"]
      },
      "email": {
        "enabled": true,
        "from": "noreply@example.com",
        "smtp": {
          "host": "smtp.example.com",
          "port": 587,
          "secure": true
        }
      }
    },
    "timestamp": "2024-01-20T13:35:00Z",
    "requestId": "req_123456812"
  }
  ```

#### 7.2 更新系统配置
- **PUT** `/settings`
- **请求参数**
```json
{
    "site": {
        "title": "string",
        "description": "string",
        "keywords": "string",
        "logo": "string",
        "favicon": "string"
    },
    "user": {
        "allowRegistration": boolean,
        "defaultRole": "string",
        "loginAttempts": number,
        "lockDuration": number
    },
    "comment": {
        "enabled": boolean,
        "moderation": boolean,
        "allowAnonymous": boolean,
        "notification": boolean
    },
    "cache": {
        "enabled": boolean,
        "duration": number,
        "types": string[]
    },
    "email": {
        "enabled": boolean,
        "from": "string",
        "smtp": {
            "host": "string",
            "port": number,
            "secure": boolean,
            "username": "string",
            "password": "string"
        }
    }
}
```
- **示例**
  - 请求示例：
  ```bash
  curl -X PUT http://api.example.com/api/v1/settings \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
    -H "Content-Type: application/json" \
    -d '{
      "site": {
        "title": "Updated Tech Blog",
        "description": "An updated blog about programming and technology",
        "keywords": "programming,technology,web development,tutorials",
        "logo": "/uploads/new-logo.png",
        "favicon": "/uploads/new-favicon.ico"
      },
      "user": {
        "allowRegistration": false,
        "defaultRole": "subscriber",
        "loginAttempts": 3,
        "lockDuration": 3600
      },
      "comment": {
        "enabled": true,
        "moderation": true,
        "allowAnonymous": false,
        "notification": true
      },
      "cache": {
        "enabled": true,
        "duration": 7200,
        "types": ["page", "post", "api"]
      },
      "email": {
        "enabled": true,
        "from": "support@example.com",
        "smtp": {
          "host": "smtp.example.com",
          "port": 587,
          "secure": true,
          "username": "support@example.com",
          "password": "password123"
        }
      }
    }'
  ```
  - 响应示例：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "updateTime": "2024-01-20T13:40:00Z"
    },
    "timestamp": "2024-01-20T13:40:00Z",
    "requestId": "req_123456813"
  }
  ```

### 8. 文件上传

#### 8.1 上传文件
- **接口说明**: 上传文件到服务器
- **请求方式**: POST
- **接口路径**: `/upload`
- **请求头**:
  - Authorization: Bearer {access}
  - Content-Type: multipart/form-data
- **请求参数**:
  - file: 文件（必填，multipart/form-data格式）
  - type: 文件类型（可选，默认自动识别）
    - image: 图片文件
    - document: 文档文件
    - media: 媒体文件
  - path: 保存路径（可选，默认按日期生成）
    - 格式：目录/子目录
    - 示例：posts/2024/01
- **说明**:
  - 支持的文件类型：
    - 图片：jpg、jpeg、png、gif、webp
    - 文档：pdf、doc、docx、txt、md
    - 媒体：mp4、mp3、wav
  - 文件大小限制：
    - 图片：最大10MB
    - 文档：最大20MB
    - 媒体：最大50MB
  - 文件命名规则：
    - 原文件名会被转换为安全的URL友好格式
    - 添加时间戳和随机字符串避免重名
    - 保留原始扩展名
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "url": "string",      // 文件访问URL（必返回）
        "path": "string",     // 文件存储路径（必返回）
        "name": "string",     // 文件名（必返回）
        "originalName": "string", // 原始文件名（必返回）
        "type": "string",     // 文件类型（必返回）
        "size": number,       // 文件大小(字节)（必返回）
        "mimeType": "string", // MIME类型（必返回）
        "uploadTime": "string" // 上传时间（必返回）
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限上传文件
  - 413: 文件大小超出限制
  - 415: 不支持的文件类型

#### 8.2 删除文件
- **接口说明**: 删除已上传的文件
- **请求方式**: DELETE
- **接口路径**: `/upload/{path}`
- **路径参数**:
  - path: 文件路径（必填，URL编码的相对路径）
- **请求头**:
  - Authorization: Bearer {access}
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": null,        // 响应数据
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限删除文件
  - 404: 文件不存在

#### 8.3 获取文件列表
- **接口说明**: 获取已上传的文件列表
- **请求方式**: GET
- **接口路径**: `/upload`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - path: 目录路径（可选，默认根目录）
  - type: 文件类型（可选）：all|image|document|media
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认20，最大100）
  - ordering: 排序字段（可选，默认-uploadTime）
    - 支持字段：name、size、uploadTime
    - 降序在字段前加-，如-uploadTime
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,      // 文件总数（必返回）
        "page": number,       // 当前页码（必返回）
        "size": number,       // 每页数量（必返回）
        "pages": number,      // 总页数（必返回）
        "items": [           // 文件列表（必返回）
            {
                "url": "string",      // 文件访问URL（必返回）
                "path": "string",     // 文件存储路径（必返回）
                "name": "string",     // 文件名（必返回）
                "originalName": "string", // 原始文件名（必返回）
                "type": "string",     // 文件类型（必返回）
                "size": number,       // 文件大小(字节)（必返回）
                "mimeType": "string", // MIME类型（必返回）
                "uploadTime": "string" // 上传时间（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看文件列表

### 9. 统计分析

#### 9.1 获取访问统计
- **接口说明**: 获取指定时间段内的访问统计数据
- **请求方式**: GET
- **接口路径**: `/statistics/visits`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - startDate: 开始日期（必填，YYYY-MM-DD格式）
  - endDate: 结束日期（必填，YYYY-MM-DD格式）
  - type: 统计类型（可选，默认daily）：daily|weekly|monthly
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": {           // 总计数据（必返回）
            "pv": number,     // 页面浏览量（必返回）
            "uv": number,     // 独立访客数（必返回）
            "ip": number      // IP数（必返回）
        },
        "trends": [         // 趋势数据（必返回）
            {
                "date": "string",  // 日期（必返回，YYYY-MM-DD）
                "pv": number,      // 页面浏览量（必返回）
                "uv": number,      // 独立访客数（必返回）
                "ip": number       // IP数（必返回）
            }
        ],
        "topPages": [       // 热门页面（必返回）
            {
                "path": "string",  // 页面路径（必返回）
                "title": "string", // 页面标题（必返回）
                "pv": number,      // 浏览量（必返回）
                "uv": number       // 访客数（必返回）
            }
        ],
        "topSources": [     // 来源网站（必返回）
            {
                "domain": "string", // 来源域名（必返回）
                "count": number,    // 访问次数（必返回）
                "percent": number   // 占比（必返回）
            }
        ],
        "topLocations": [   // 访客地区（必返回）
            {
                "country": "string", // 国家（必返回）
                "region": "string",  // 地区（必返回）
                "count": number,     // 访问次数（必返回）
                "percent": number    // 占比（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看统计数据

#### 9.2 获取内容统计
- **接口说明**: 获取指定时间段内的内容统计数据
- **请求方式**: GET
- **接口路径**: `/statistics/content`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - startDate: 开始日期（必填，YYYY-MM-DD格式）
  - endDate: 结束日期（必填，YYYY-MM-DD格式）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "posts": {          // 文章统计（必返回）
            "total": number,     // 总文章数（必返回）
            "published": number, // 已发布数（必返回）
            "draft": number,     // 草稿数（必返回）
            "private": number,   // 私密文章数（必返回）
            "topAuthors": [     // 热门作者（必返回）
                {
                    "id": number,       // 作者ID（必返回）
                    "username": "string", // 用户名（必返回）
                    "postCount": number,  // 文章数（必返回）
                    "totalViews": number  // 总浏览量（必返回）
                }
            ]
        },
        "comments": {       // 评论统计（必返回）
            "total": number,    // 总评论数（必返回）
            "approved": number, // 已通过数（必返回）
            "pending": number,  // 待审核数（必返回）
            "spam": number      // 垃圾评论数（必返回）
        },
        "categories": {     // 分类统计（必返回）
            "total": number,    // 总分类数（必返回）
            "topCategories": [  // 热门分类（必返回）
                {
                    "id": number,       // 分类ID（必返回）
                    "name": "string",   // 分类名称（必返回）
                    "postCount": number, // 文章数（必返回）
                    "totalViews": number // 总浏览量（必返回）
                }
            ]
        },
        "tags": {          // 标签统计（必返回）
            "total": number,   // 总标签数（必返回）
            "topTags": [      // 热门标签（必返回）
                {
                    "id": number,       // 标签ID（必返回）
                    "name": "string",   // 标签名称（必返回）
                    "postCount": number, // 文章数（必返回）
                    "totalViews": number // 总浏览量（必返回）
                }
            ]
        }
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看统计数据

#### 9.3 获取搜索统计
- **接口说明**: 获取指定时间段内的搜索统计数据
- **请求方式**: GET
- **接口路径**: `/statistics/search`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - startDate: 开始日期（必填，YYYY-MM-DD格式）
  - endDate: 结束日期（必填，YYYY-MM-DD格式）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "total": number,       // 总搜索次数（必返回）
        "uniqueKeywords": number, // 不同关键词数（必返回）
        "noResultsCount": number, // 无结果次数（必返回）
        "topKeywords": [      // 热门关键词（必返回）
            {
                "keyword": "string", // 关键词（必返回）
                "count": number,     // 搜索次数（必返回）
                "avgPosition": number // 平均排名（必返回）
            }
        ],
        "trends": [          // 趋势数据（必返回）
            {
                "date": "string",    // 日期（必返回，YYYY-MM-DD）
                "count": number,     // 搜索次数（必返回）
                "uniqueCount": number // 不同关键词数（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看统计数据

#### 9.4 获取性能统计
- **接口说明**: 获取指定时间段内的系统性能统计数据
- **请求方式**: GET
- **接口路径**: `/statistics/performance`
- **请求头**:
  - Authorization: Bearer {access}
- **请求参数**:
  - startDate: 开始日期（必填，YYYY-MM-DD格式）
  - endDate: 结束日期（必填，YYYY-MM-DD格式）
- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "server": {         // 服务器性能（必返回）
            "cpu": {         // CPU使用率（必返回）
                "average": number,  // 平均值（必返回）
                "peak": number,     // 峰值（必返回）
                "timestamp": "string" // 峰值时间（必返回）
            },
            "memory": {      // 内存使用（必返回）
                "average": number,  // 平均值(MB)（必返回）
                "peak": number,     // 峰值(MB)（必返回）
                "timestamp": "string" // 峰值时间（必返回）
            },
            "disk": {        // 磁盘使用（必返回）
                "total": number,    // 总空间(MB)（必返回）
                "used": number,     // 已用空间(MB)（必返回）
                "free": number      // 剩余空间(MB)（必返回）
            }
        },
        "api": {            // API性能（必返回）
            "totalRequests": number,   // 总请求数（必返回）
            "avgResponseTime": number, // 平均响应时间(ms)（必返回）
            "p95ResponseTime": number, // 95%响应时间(ms)（必返回）
            "p99ResponseTime": number, // 99%响应时间(ms)（必返回）
            "errorRate": number,      // 错误率（必返回）
            "topEndpoints": [        // 热门接口（必返回）
                {
                    "path": "string",   // 接口路径（必返回）
                    "method": "string", // 请求方法（必返回）
                    "count": number,    // 请求次数（必返回）
                    "avgResponseTime": number // 平均响应时间(ms)（必返回）
                }
            ]
        },
        "cache": {          // 缓存性能（必返回）
            "hitRate": number,    // 命中率（必返回）
            "missRate": number,   // 未命中率（必返回）
            "size": number,       // 缓存大小(MB)（必返回）
            "itemCount": number   // 缓存项数（必返回）
        }
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 请求参数错误
  - 401: 未授权
  - 403: 无权限查看统计数据

## 错误码说明

### 通用错误码
- **200 成功**
  - 描述: 请求成功完成
  - 示例:
  ```json
  {
      "code": 200,
      "message": "success",
      "data": {},
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **201 创建成功**
  - 描述: 资源创建成功
  - 示例:
  ```json
  {
      "code": 201,
      "message": "created",
      "data": {
          "id": 1,
          "created_at": "2024-01-20T12:00:00Z"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **400 请求参数错误**
  - 描述: 请求参数不符合要求
  - 示例:
  ```json
  {
      "code": 400,
      "message": "Bad Request",
      "data": {
          "errors": {
              "username": "用户名长度必须在4-20个字符之间",
              "email": "邮箱格式不正确"
          }
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **401 未授权**
  - 描述: 用户未登录或token已失效
  - 示例:
  ```json
  {
      "code": 401,
      "message": "Unauthorized",
      "data": {
          "error": "token已过期，请重新登录"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **403 禁止访问**
  - 描述: 用户无权限执行该操作
  - 示例:
  ```json
  {
      "code": 403,
      "message": "Forbidden",
      "data": {
          "error": "您没有权限执行此操作"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **404 资源不存在**
  - 描述: 请求的资源不存在
  - 示例:
  ```json
  {
      "code": 404,
      "message": "Not Found",
      "data": {
          "error": "文章不存在"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **409 资源冲突**
  - 描述: 资源已存在或状态冲突
  - 示例:
  ```json
  {
      "code": 409,
      "message": "Conflict",
      "data": {
          "error": "用户名已被使用"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **413 请求实体过大**
  - 描述: 上传的文件超出大小限制
  - 示例:
  ```json
  {
      "code": 413,
      "message": "Payload Too Large",
      "data": {
          "error": "文件大小不能超过10MB"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **415 不支持的媒体类型**
  - 描述: 上传的文件类型不支持
  - 示例:
  ```json
  {
      "code": 415,
      "message": "Unsupported Media Type",
      "data": {
          "error": "不支持的文件类型",
          "supported": ["jpg", "png", "gif"]
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **429 请求过于频繁**
  - 描述: 超出接口调用频率限制
  - 示例:
  ```json
  {
      "code": 429,
      "message": "Too Many Requests",
      "data": {
          "error": "请求过于频繁，请稍后再试",
          "retryAfter": 60
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

- **500 服务器错误**
  - 描述: 服务器内部错误
  - 示例:
  ```json
  {
      "code": 500,
      "message": "Internal Server Error",
      "data": {
          "error": "服务器内部错误，请稍后再试"
      },
      "timestamp": "2024-01-20T12:00:00Z",
      "requestId": "req_123456789"
  }
  ```

### 业务错误码
- **1001 用户相关**
  - 1001: 用户名或密码错误
  - 1002: 账号已被锁定
  - 1003: 用户名已存在
  - 1004: 邮箱已被使用
  - 1005: 原密码错误

- **1002 文章相关**
  - 2001: 文章标题已存在
  - 2002: 文章状态不正确
  - 2003: 发布时间不能修改
  - 2004: 私密文章不能公开

- **1003 分类相关**
  - 3001: 分类名称已存在
  - 3002: 父分类不存在
  - 3003: 存在子分类，不能删除
  - 3004: 分类下存在文章，不能删除

- **1004 标签相关**
  - 4001: 标签名称已存在
  - 4002: 标签下存在文章，不能删除

- **1005 插件相关**
  - 5001: 插件已安装
  - 5002: 插件版本冲突
  - 5003: 插件依赖冲突
  - 5004: 插件被依赖，不能卸载

- **1006 主题相关**
  - 6001: 主题不存在
  - 6002: 主题配置无效

- **1007 系统相关**
  - 7001: 系统维护中
  - 7002: 功能已禁用
  - 7003: 配置无效

## 标签管理API

### 获取标签列表
GET /api/tags/

**权限要求**：允许所有用户访问（包括未认证用户）

**请求参数**：
- page: 页码（可选，默认1）
- page_size: 每页数量（可选，默认10）
- ordering: 排序字段（可选，支持name,-name）
- search: 搜索关键词（可选）

**响应格式**：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "count": 100,           // 总数
        "results": [            // 当前页数据
            {
                "id": 1,
                "name": "标签1",
                "created_at": "2024-01-22T10:00:00Z",
                "updated_at": "2024-01-22T10:00:00Z"
            }
        ]
    },
    "timestamp": "2024-01-22T10:00:00Z",
    "requestId": "xxx"
}
```

### 创建标签
POST /api/tags/

**权限要求**：需要认证

**请求体**：
```json
{
    "name": "新标签"
}
```

**可能的错误**：
- 409: 标签名称已存在
- 400: 标签名称为空或超过长度限制
- 401: 未提供认证信息

### 批量创建标签
POST /api/tags/batch-create/

**权限要求**：需要认证

**请求体**：
```json
{
    "tags": [
        {"name": "标签1"},
        {"name": "标签2"}
    ]
}
```

**可能的错误**：
- 409: 标签名称已存在
- 400: 标签名称为空或超过长度限制
- 401: 未提供认证信息

### 更新标签
PUT /api/tags/{id}/

**权限要求**：需要认证

**请求体**：
```json
{
    "name": "新标签名"
}
```

**可能的错误**：
- 404: 标签不存在
- 409: 标签名称已存在
- 400: 标签名称为空或超过长度限制
- 401: 未提供认证信息

### 删除标签
DELETE /api/tags/{id}/

**权限要求**：需要认证

**可能的错误**：
- 404: 标签不存在
- 401: 未提供认证信息

### 4.4 清空回收站
- 请求方式: DELETE
- 接口路径: `/trash/posts/empty`
- 请求头:
  - Authorization: Bearer {token}
- 响应数据:
```json
{
    "code": 204,
    "message": "success",
    "data": {
        "deleted_count": number  // 删除的文章数量
    }
}
```

### 10. 搜索功能

#### 10.1 高级搜索
- **接口说明**: 支持多字段组合的模糊搜索，可按分类、标签、作者、日期范围过滤，支持结果高亮显示
- **请求方式**: GET
- **接口路径**: `/search`
- **请求参数**:
  - keyword: 搜索关键词（必填，支持模糊匹配，不区分大小写）
  - fields: 搜索字段（可选，多个字段用逗号分隔，可选值：title,content,excerpt）
  - category: 分类ID（可选）
  - tags: 标签ID列表（可选，多个标签用逗号分隔）
  - author: 作者ID（可选）
  - date_start: 开始日期（可选，YYYY-MM-DD格式）
  - date_end: 结束日期（可选，YYYY-MM-DD格式）
  - highlight: 是否高亮显示搜索结果（可选，默认true）
  - page: 页码（可选，默认1）
  - page_size: 每页数量（可选，默认10）

- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "count": number,      // 总数（必返回）
        "next": "string",     // 下一页URL（可能为null）
        "previous": "string", // 上一页URL（可能为null）
        "results": [         // 搜索结果列表（必返回）
            {
                "id": number,           // 文章ID（必返回）
                "title": "string",      // 文章标题（必返回，可能包含高亮标签）
                "excerpt": "string",    // 文章摘要（必返回，可能包含高亮标签）
                "content": "string",    // 文章内容（必返回，可能包含高亮标签）
                "author": {            // 作者信息（必返回）
                    "id": number,       // 作者ID（必返回）
                    "username": "string" // 用户名（必返回）
                },
                "category": {          // 分类信息（必返回）
                    "id": number,       // 分类ID（必返回）
                    "name": "string"    // 分类名称（必返回）
                },
                "tags": [             // 标签列表（必返回）
                    {
                        "id": number,   // 标签ID（必返回）
                        "name": "string" // 标签名称（必返回）
                    }
                ],
                "created_at": "string", // 创建时间（必返回）
                "updated_at": "string"  // 更新时间（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 搜索关键词不能为空
  - 400: 无效的日期格式

#### 10.2 搜索建议
- **接口说明**: 根据输入的关键词返回相关的文章、分类、标签建议
- **请求方式**: GET
- **接口路径**: `/search/suggest`
- **请求参数**:
  - keyword: 搜索关键词（必填，支持模糊匹配，不区分大小写）
  - limit: 返回结果数量限制（可选，默认10）

- **响应数据**
```json
{
    "code": 200,          // 状态码（必返回）
    "message": "success", // 状态信息（必返回）
    "data": {            // 响应数据（必返回）
        "suggestions": [   // 建议列表（必返回）
            {
                "type": "string",    // 建议类型（必返回）：post|category|tag
                "id": number,        // ID（必返回）
                "title": "string",   // 标题（必返回）
                "excerpt": "string"  // 摘要（必返回）
            }
        ]
    },
    "timestamp": "string", // 时间戳（必返回）
    "requestId": "string"  // 请求ID（必返回）
}
```
- **错误码**:
  - 400: 搜索关键词不能为空
