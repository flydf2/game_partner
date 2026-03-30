# 抢单详情API文档

## 1. 接口概述

本文档描述了抢单详情页面所需的API接口，用于获取抢单的详细信息、撤回抢单申请等操作。

## 2. 接口列表

| 接口名称 | URL | 方法 | 功能描述 |
|---------|-----|------|----------|
| 获取抢单详情 | /api/playmate/grab-orders/{id} | GET | 获取指定抢单的详细信息 |
| 撤回抢单申请 | /api/playmate/grab-orders/{id}/withdraw | POST | 撤回抢单申请 |

## 3. 接口详情

### 3.1 获取抢单详情

**URL:** `/api/playmate/grab-orders/{id}`

**方法:** `GET`

**请求参数:**
| 参数名 | 类型 | 位置 | 必填 | 描述 |
|--------|------|------|------|------|
| id | string | 路径 | 是 | 抢单ID |

**响应数据:**
```json
{
  "code": 0,
  "data": {
    "id": "1",
    "rewardId": "1",
    "title": "王者荣耀：巅峰赛上分",
    "game": "王者荣耀",
    "category": "MOBA 竞技",
    "reward": 188.00,
    "status": "ongoing",
    "statusText": "进行中",
    "requirements": {
      "level": "最强王者 20星+",
      "duration": "约 3 小时",
      "startTime": "今日 20:00",
      "mode": "巅峰赛 5V5"
    },
    "publisher": {
      "name": "晴天小浪君",
      "avatar": "https://example.com/avatar.jpg",
      "level": "极高 (S)",
      "isOwner": true
    },
    "timeline": [
      {
        "step": 1,
        "title": "已提交申请",
        "time": "2023-10-24 14:30",
        "status": "completed"
      },
      {
        "step": 2,
        "title": "房主查看中",
        "time": "2023-10-24 15:12",
        "status": "completed"
      },
      {
        "step": 3,
        "title": "待确认",
        "time": "等待房主最终确认",
        "status": "current"
      }
    ],
    "recommendation": "全能选手，擅长打野和对抗路。当前段位百星，可以高效带飞。时间充裕，随时可以开始，信誉保障！"
  },
  "msg": "获取成功"
}
```

### 3.2 撤回抢单申请

**URL:** `/api/playmate/grab-orders/{id}/withdraw`

**方法:** `POST`

**请求参数:**
| 参数名 | 类型 | 位置 | 必填 | 描述 |
|--------|------|------|------|------|
| id | string | 路径 | 是 | 抢单ID |

**响应数据:**
```json
{
  "code": 0,
  "data": {
    "message": "申请已撤回"
  },
  "msg": "操作成功"
}
```

## 4. 错误码

| 错误码 | 描述 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 抢单不存在 |
| 500 | 服务器内部错误 |

## 5. 注意事项

1. 所有API请求都需要在请求头中携带有效的认证token
2. 撤回抢单申请只能在抢单状态为"进行中"或"待确认"时操作
3. 接口返回的数据结构可能会根据业务需求进行调整

## 6. 实现说明

当前项目中，抢单详情页面使用了模拟数据，实际项目中需要替换为真实的API调用。建议后端实现上述接口，以支持完整的抢单流程。