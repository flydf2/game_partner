# Vue 3 项目开发规范

## 一、技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建 | Vite |
| CSS | Tailwind CSS |
| 状态 | Pinia |
| 路由 | Vue Router |

## 二、项目结构

```
src/
├── api/           # API 服务层
├── assets/        # 静态资源
├── components/    # 公共组件
│   └── common/    # 通用组件
├── composables/   # 组合式函数
├── router/       # 路由配置
├── stores/       # 状态管理
├── utils/        # 工具函数
├── views/        # 页面组件
└── App.vue
```

## 三、命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserCard.vue` |
| JS 文件 | camelCase | `useFormValidation.js` |
| API 文件 | camelCase | `user.js` |
| Store | camelCase | `user.js` |

## 四、组件规范

- **必须** 使用 `<script setup>`
- **必须** 列表渲染加 `:key`
- **必须** props 和 emits 显式声明
- 组件单一职责，粒度适中

## 五、API 规范

- **禁止嵌套查询**
- API 放在 `/src/api/`
- **必须** 支持 Mock/真实 API 切换
- **必须** 使用统一拦截器处理认证和响应

## 六、文档规范

### 1. 文档目录

- **开发文档**：`/docs/`
- **Mock API 文档**：`/docs/mock/`

### 2. 文档命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 全局文档 | `global_` 前缀 | `global_project_plan.md` |
| 模块文档 | 模块名 + 功能 | `api_user_update_2026-03-26.md` |
| Mock API 文档 | `docs/mock/` + 功能 `_api.md` | `docs/mock/user_api.md` |
| 日期后缀 | `YYYY-MM-DD` | `global_development_record_2026-03-23.md` |

### 3. Mock API 文档生成规范

**触发时机**：每次 Mock 数据变更时，必须同步更新对应的 API 文档

**文档结构**：
```markdown
# [功能] API 文档

## 接口列表

### 1. [接口名称]
- **URL**: `/api/xxx`
- **Method**: GET | POST | PUT | DELETE
- **描述**: 功能说明

### 请求参数
| 参数名 | 类型 | 必填 | 说明 |

### 响应格式
```json
{
  "code": 0,
  "data": {},
  "msg": ""
}
```

### 响应示例
```json
```

### 更新记录
| 日期 | 变更内容 | 负责人 |
|------|----------|--------|
| 2026-03-31 | 初始版本 | - |
```

**文件命名**：
- 用户模块：`docs/mock/user_api.md`
- 订单模块：`docs/mock/order_api.md`
- 社区模块：`docs/mock/community_api.md`

## 七、路由规范

```javascript
meta: {
  title: '页面标题',
  requireAuth: true,
  keepAlive: true
}
```

- 页面组件使用懒加载
- **必须** 检查登录状态
- 401 响应触发重新登录

## 八、Git 规范

### 分支

- `main`: 主分支
- `develop`: 开发分支
- `feature/xxx`: 功能分支
- `fix/xxx`: 修复分支

### Commit

```
<type>(<scope>): <subject>
feat | fix | docs | style | refactor | test | chore
```

## 九、常用命令

```bash
npm run dev      # 开发服务器
npm run build    # 构建
npm run preview  # 预览
```


## 十、开发流程

### 1. 功能开发

| 阶段 | 步骤 | 说明 |
|------|------|------|
| 需求分析 | 查看设计稿 | 仔细阅读设计稿，理解功能需求和 UI 交互 |
| | 拆解任务 | 将功能拆解为具体的组件和页面任务 |
| 文档记录 | 创建文档 | 在 `/docs/` 下创建对应的开发文档 |
| | 记录方案 | 详细记录功能方案、接口定义、数据结构 |
| | **生成 API 文档** | Mock 数据变更时，同步更新 `/docs/mock/功能_api.md` |
| 编码实现 | 创建组件 | 按规范创建组件，遵循命名和组件规范 |
| | 实现页面 | 在 `views/` 下实现页面组件 |
| | 编写 Mock | 在 `api/` 下编写 Mock 数据支持开发调试 |
| | **同步文档** | Mock 变更时同步更新 `docs/mock/功能_api.md` |
| 自测验证 | 功能测试 | 测试功能是否符合需求 |
| | 边界测试 | 测试异常情况处理 |
| | 视觉检查 | 与设计稿对比，确保 UI 一致 |

### 2. API 替换流程

| 阶段 | 步骤 | 说明 |
|------|------|------|
| 环境准备 | 检查配置 | 确认 `src/api/config.js` 中 API 配置正确 |
| | 切换开关 | 设置 `VITE_USE_MOCK=false` 切换到真实 API |
| 数据替换 | 替换接口 | 将 Mock API 调用替换为真实接口 |
| | 调整参数 | 根据真实 API 响应格式调整数据处理逻辑 |
| | 处理差异 | 处理真实 API 与 Mock 数据的格式差异 |
| 测试验证 | 接口测试 | 测试每个 API 接口是否正常工作 |
| | 业务流程 | 测试完整业务流程是否顺畅 |
| | 异常处理 | 测试网络异常、接口错误等场景 |
| 问题记录 | 记录问题 | 在 `/docs/` 下记录发现的问题 |
| | 反馈后端 | 向后端团队反馈 API 规范问题或 Bug |
| | 文档更新 | 更新接口文档，记录特殊处理逻辑 |

### 3. 代码审查

- **提交前检查**：确保代码符合命名规范、无 console.log、无无用代码
- **PR 描述**：清晰说明功能变更、影响范围、测试情况
- **审查要点**：命名规范、组件复用、性能考虑、安全性

### 4. 常见问题处理

| 问题 | 处理方式 |
|------|----------|
| 接口 401 | 检查 Token 有效性，确认登录状态 |
| 数据格式不一致 | 统一在响应拦截器中处理格式转换 |
| 跨域问题 | 检查 Vite 代理配置 |
| Mock 与真实 API 差异 | 在文档中记录差异点，便于后续维护 |