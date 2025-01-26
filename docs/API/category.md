# 分类相关API

## 获取分类列表
- **接口说明**: 获取分类列表，支持分页、排序和筛选。返回的分类列表按照order和id排序，子分类也遵循相同的排序规则。
- **请求方式**: GET
- **接口路径**: `/api/v1/categories/`
- **请求参数**:
  - page: 页码（可选，默认1）
  - size: 每页数量（可选，默认10，最大50）
  - ordering: 排序字段（可选，支持order, name, created_at）
  - parent: 父分类ID（可选，传null获取顶级分类，不传则获取所有分类）
  - search: 搜索关键词（可选，搜索name, description）

- **说明**:
  1. 分类支持无限层级嵌套，每个分类都有一个level字段表示其在树中的层级（0表示顶级分类）
  2. children字段包含当前分类的所有子分类，子分类同样可以包含其自己的children
  3. 当不传parent参数时，API返回所有分类；当parent=null时，只返回顶级分类
  4. 分类列表默认按order字段升序排序，order相同时按id升序排序

- **响应数据**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "count": 0,
        "next": "string",
        "previous": "string",
        "results": [
            {
                "id": 0,
                "name": "string",
                "description": "string",
                "parent": 0,
                "parent_name": "string",
                "children": [
                    {
                        "id": 0,
                        "name": "string",
                        "description": "string"
                    }
                ],
                "created_at": "string",
                "updated_at": "string"
            }
        ]
    }
}
```

## 创建分类
- **接口说明**: 创建新分类
- **请求方式**: POST
- **接口路径**: `/api/v1/categories/`
- **请求头**:
  - Authorization: Bearer {token}
- **请求参数**:
```json
{
    "name": "string",        // 分类名称（必填，2-50字符，唯一）
    "description": "string", // 分类描述（可选，最大200字符）
    "parent": 0,            // 父分类ID（可选）
    "order": 0              // 排序权重（可选，默认0，值越小排序越靠前）
}
```
- **响应数据**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 0,
        "name": "string",
        "description": "string",
        "parent": 0,
        "parent_name": "string",
        "created_at": "string",
        "updated_at": "string"
    }
}
```
- **错误码**:
  - 400: 请求参数错误（名称为空或超长）
  - 401: 未授权
  - 404: 父分类不存在
  - 409: 分类名称已存在

## 快速创建分类
- **接口说明**: 在创建文章时快速创建分类
- **请求方式**: POST
- **接口路径**: `/api/v1/categories/quick-create/`
- **请求头**:
  - Authorization: Bearer {token}
- **请求参数**:
```json
{
    "name": "string",        // 分类名称（必填，2-50字符，唯一）
    "description": "string", // 分类描述（可选，最大200字符）
    "parent": 0             // 父分类ID（可选）
}
```
- **响应数据**: 同创建分类
- **错误码**: 同创建分类

## 获取分类详情
- **接口说明**: 获取分类详细信息，返回包含完整子分类树的数据结构
- **请求方式**: GET
- **接口路径**: `/api/v1/categories/{id}/`
- **响应数据**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 0,
        "name": "string",
        "description": "string",
        "parent": 0,
        "parent_name": "string",
        "level": 0,           // 分类层级，0表示顶级分类
        "children": [         // 子分类列表，支持无限层级嵌套
            {
                "id": 0,
                "name": "string",
                "description": "string",
                "level": 1,
                "children": []  // 递归嵌套的子分类
            }
        ],
        "created_at": "string",
        "updated_at": "string"
    }
}
```

## 更新分类
- **接口说明**: 更新分类信息
- **请求方式**: PUT
- **接口路径**: `/api/v1/categories/{id}/`
- **请求头**:
  - Authorization: Bearer {token}
- **请求参数**: 同创建分类
- **响应数据**: 同创建分类
- **错误码**:
  - 400: 请求参数错误（名称为空或超长）
  - 401: 未授权
  - 403: 无权限修改此分类
  - 404: 分类不存在或父分类不存在
  - 409: 分类名称已存在
  - 422: 不能将分类设为自己的子分类

## 删除分类
- **接口说明**: 删除分类。如果分类或其子分类下存在文章，则无法删除。如果分类下有子分类但整个分类链路都没有文章引用，则会递归删除所有子分类。
- **请求方式**: DELETE
- **接口路径**: `/api/v1/categories/{id}/`
- **请求头**:
  - Authorization: Bearer {token}
- **响应数据**:
```json
{
    "code": 204,
    "message": "success",
    "data": null
}
```
- **错误码**:
  - 401: 未授权
  - 403: 无权限删除此分类
  - 404: 分类不存在
  - 422: 分类或其子分类下存在文章，无法删除
