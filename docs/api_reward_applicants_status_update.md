# 悬赏订单申请人状态管理 API 更新

## 功能描述

为悬赏订单申请人添加了状态管理功能，支持三种状态：
- `pending` - 待处理
- `approved` - 已通过
- `rejected` - 已拒绝

## API 接口

### 获取申请人列表

**请求方式：** GET
**请求地址：** `http://localhost:5173/api/playmate/reward/{orderId}/applicants`

**响应示例：**

```json
{
  "code": 0,
  "data": [
    {
      "appliedAt": "2026-03-29T21:37:00.826+08:00",
      "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
      "badges": [
        {
          "text": "实名认证",
          "type": "verified"
        },
        {
          "text": "保证金已缴",
          "type": "deposit"
        }
      ],
      "id": 7,
      "level": 24,
      "name": "用户1",
      "orderCount": 100,
      "rating": 4.9,
      "recommendation": "",
      "specialty": "擅长各种游戏",
      "status": "approved",
      "userId": 1
    },
    {
      "appliedAt": "2026-03-29T21:38:00.123+08:00",
      "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
      "badges": [
        {
          "text": "实名认证",
          "type": "verified"
        }
      ],
      "id": 8,
      "level": 32,
      "name": "用户2",
      "orderCount": 150,
      "rating": 4.8,
      "recommendation": "我有丰富的游戏经验",
      "specialty": "擅长MOBA类游戏",
      "status": "pending",
      "userId": 2
    },
    {
      "appliedAt": "2026-03-29T21:39:00.456+08:00",
      "avatar": "https://randomuser.me/api/portraits/men/55.jpg",
      "badges": [
        {
          "text": "实名认证",
          "type": "verified"
        },
        {
          "text": "保证金已缴",
          "type": "deposit"
        },
        {
          "text": "推荐",
          "type": "recommended"
        }
      ],
      "id": 9,
      "level": 28,
      "name": "用户3",
      "orderCount": 200,
      "rating": 4.95,
      "recommendation": "专业游戏玩家，保证服务质量",
      "specialty": "擅长射击类游戏",
      "status": "rejected",
      "userId": 3
    }
  ],
  "msg": "获取成功"
}
```

## 状态说明

| 状态值 | 说明 |
|-------|------|
| pending | 申请已提交，等待处理 |
| approved | 申请已通过，已被选中 |
| rejected | 申请已拒绝，未被选中 |

## 实现细节

- 修改了 `src/api/index.js` 文件中的 `rewardOrderApi.getApplicants` 方法
- 更新了 mock 数据，添加了 `status` 字段
- 确保响应格式与后端 API 保持一致
- 构建测试通过，无错误

## 相关文件

- `src/api/index.js` - 修改了 getApplicants 方法
- `docs/api_reward_applicants_status_update.md` - 本更新文档

## 测试结果

- 构建成功：`npm run build` 执行通过
- API 响应格式正确
- 状态值符合要求
