# 悬赏订单申请人状态显示更新

## 功能描述

为悬赏订单申请人列表添加了状态显示功能，支持三种状态的视觉展示：
- `pending` - 待处理
- `approved` - 已通过
- `rejected` - 已拒绝

## 实现细节

### 1. API 数据结构

修改了 `src/api/index.js` 文件中的 `rewardOrderApi.getApplicants` 方法，为每个申请人添加了 `status` 字段：

```json
{
  "appliedAt": "2026-03-29T21:37:00.826+08:00",
  "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
  "badges": [
    { "text": "实名认证", "type": "verified" },
    { "text": "保证金已缴", "type": "deposit" }
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
}
```

### 2. 页面显示效果

修改了 `src/views/RewardOrderDetail.vue` 文件，在申请人列表中添加了以下状态显示：

#### 状态标签
- **待处理**：黄色背景，显示为 "待处理"
- **已通过**：绿色背景，显示为 "已通过"
- **已拒绝**：红色背景，显示为 "已拒绝"

#### 头像徽章
- **已通过**：绿色徽章，显示 "已通过"
- **已拒绝**：红色徽章，显示 "已拒绝"
- **待处理**：显示等级徽章

#### 边框样式
- **已通过**：添加蓝色边框和阴影效果
- **其他状态**：默认样式

#### 推荐理由
- 显示申请人的 `recommendation` 字段

#### 按钮控制
- 只有待处理状态的申请才显示选择按钮
- 已通过状态显示已选中图标

## 状态说明

| 状态值 | 显示文本 | 背景颜色 | 边框样式 |
|-------|---------|---------|----------|
| pending | 待处理 | 黄色 | 默认 |
| approved | 已通过 | 绿色 | 蓝色边框+阴影 |
| rejected | 已拒绝 | 红色 | 默认 |

## 相关文件

- `src/api/index.js` - 修改了 getApplicants 方法，添加状态字段
- `src/views/RewardOrderDetail.vue` - 修改了申请人列表显示，添加状态视觉效果
- `docs/api_reward_applicants_status_display.md` - 本更新文档

## 测试结果

- 构建成功：`npm run build` 执行通过
- 状态显示正确：三种状态都能正确显示对应的视觉效果
- 交互逻辑正确：只有待处理状态的申请可以被选择
- 数据结构完整：包含所有必要的字段
