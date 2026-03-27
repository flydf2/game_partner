# 申诉 Mock 数据文档

## 概述

为申诉模块添加了完整的 Mock 数据支持，包括申诉列表、创建申诉和申诉详情等功能。

## Mock 数据文件

**文件路径**: `src/api/mock-appeals.js`

### mockAppeals 数据结构

```javascript
{
  id: 'SP202310240092',           // 申诉单号
  type: '违规言论/引战',           // 申诉类型
  status: 'processing',            // 状态: pending/processing/completed
  statusText: '处理中',             // 状态文本
  statusClass: 'bg-primary-container/20 text-primary', // 状态样式类
  target: {
    name: '夜火狂潮',              // 申诉对象名称
    avatar: '...'                  // 申诉对象头像
  },
  submitTime: '2023.10.24 14:20',  // 提交时间
  content: '该用户在游戏过程中...', // 申诉内容
  evidence: ['...'],               // 证据图片链接
  result: null                     // 处理结果
}
```

### Mock 数据列表

| 申诉单号 | 类型 | 状态 | 申诉对象 |
|---------|------|------|---------|
| SP202310240092 | 违规言论/引战 | 处理中 | 夜火狂潮 |
| SP202310220145 | 消极比赛/挂机 | 已完成 | 小甜心软软 |
| SP202310210887 | 代练嫌疑 | 待处理 | 野王带你飞 |
| SP202310200563 | 违规言论/引战 | 已完成 | 游戏小王子 |
| SP202310190234 | 虚假宣传 | 待处理 | 电竞女神 |

## API 接口

### 1. 获取申诉列表

**函数**: `mockGetAppeals(params)`

**参数**:
- `params.status` (可选): 按状态过滤 (pending/processing/completed)
- `params.type` (可选): 按类型过滤

**返回示例**:
```javascript
{
  success: true,
  data: [ /* 申诉列表 */ ]
}
```

### 2. 创建申诉

**函数**: `mockCreateAppeal(appealData)`

**参数**:
- `appealData`: 申诉数据对象
  - `type`: 申诉类型
  - `content`: 申诉内容
  - `evidence`: 证据图片数组

**返回示例**:
```javascript
{
  success: true,
  message: '申诉提交成功',
  data: {
    id: 'SP1679900000000',
    ...appealData
  }
}
```

### 3. 获取申诉详情

**函数**: `mockGetAppealDetail(appealId)`

**参数**:
- `appealId`: 申诉单号

**返回示例**:
```javascript
{
  success: true,
  data: { /* 申诉详情 */ }
}
```

## 集成说明

### 1. Mock 数据导出

在 `src/api/mock-index.js` 中添加:
```javascript
export * from './mock-appeals.js'
```

### 2. API 集成

在 `src/api/index.js` 中导入并使用:

```javascript
import { 
  mockGetAppeals,
  mockCreateAppeal,
  mockGetAppealDetail
} from './mock-index.js'

export const appealApi = {
  async getAppeals(params = {}) {
    if (USE_MOCK) {
      return await mockGetAppeals(params)
    } else {
      return await withRetry(() => get('/appeals', { params }))
    }
  },

  async createAppeal(appealData) {
    if (USE_MOCK) {
      return await mockCreateAppeal(appealData)
    } else {
      return await withRetry(() => post('/appeals', appealData))
    }
  },

  async getAppealDetail(appealId) {
    if (USE_MOCK) {
      return await mockGetAppealDetail(appealId)
    } else {
      return await withRetry(() => get(`/appeals/${appealId}`))
    }
  }
}
```

## 使用方式

### 开启 Mock 模式

在环境变量中设置:
```
VITE_USE_MOCK=true
```

### 关闭 Mock 模式

```env
VITE_USE_MOCK=false
```

## 优势

1. **数据一致性**: Mock 数据与真实数据结构保持一致
2. **筛选功能**: 支持按状态和类型进行筛选
3. **延迟模拟**: 300-500ms 延迟，模拟真实网络请求
4. **易于维护**: 独立的 Mock 文件，便于数据管理和扩展

## 注意事项

- Mock 数据仅用于开发和测试环境
- 生产环境请确保 `VITE_USE_MOCK=false`
- 申诉单号格式: `SP{timestamp}`
