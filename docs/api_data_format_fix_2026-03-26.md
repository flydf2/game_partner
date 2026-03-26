# API数据格式修复记录

## 问题描述
页面读取接口后，数据正常返回，但是页面没有正常显示数据。

控制台日志显示：
```
API Request: /api/playmate/games
API Request: /api/playmate/playmates
API Response: { code: 0, data: {…}, msg: "获取成功" }
```

但页面没有渲染游戏和陪玩数据。

## 问题原因
后端API返回的数据格式与前端处理逻辑不一致：

### 后端返回格式
```json
{
  "code": 0,
  "data": {
    "data": [...],
    "pagination": {...}
  },
  "msg": "获取成功"
}
```

### 前端原有处理逻辑
在 `src/services/api.js` 中，代码没有正确处理嵌套的data结构，导致页面组件接收到的数据格式不正确。

## 修复方案

### 1. 修改 services/api.js 中的 getGames 函数
正确处理游戏数据格式：

```javascript
getGames: async () => {
  if (USE_MOCK) {
    // ... mock处理
  }
  const response = await request('/games')
  // 真实API返回: {success: true, data: [...]} 或 {success: true, data: {data: [...]}}
  if (response.success && response.data) {
    const gamesData = Array.isArray(response.data) ? response.data : response.data.data || []
    return { success: true, data: gamesData }
  }
  return { success: false, data: [] }
},
```

### 2. 修改 services/api.js 中的 getPlaymates 函数
正确处理陪玩列表数据格式：

```javascript
getPlaymates: async (params = {}) => {
  if (USE_MOCK) {
    // ... mock处理
  }
  const response = await request('/playmates', { params })
  // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
  if (response.success && response.data) {
    return { success: true, data: response.data.data || response.data }
  }
  return { success: false, data: [] }
},
```

### 3. 修改 services/api.js 中的 getFeaturedPlaymate 函数
正确处理特色陪玩数据：

```javascript
getFeaturedPlaymate: async () => {
  // ... mock处理 ...
  } else {
    response = await request('/playmates')
    // 真实API返回: {success: true, data: {data: [...], pagination: {...}}}
    if (response.success && response.data) {
      const playmateList = response.data.data || response.data
      if (playmateList.length > 2) {
        return { success: true, data: playmateList[2] }
      }
    }
    return { success: false, data: null }
  }
  // ...
}
```

### 4. 修复 Home.vue 中的数据映射
修复陪玩数据的字段映射（nickname vs name）：

```javascript
// PlaymateCard 使用 nickname
:playmate="{
  id: playmate.id,
  nickname: playmate.nickname || playmate.name,  // 兼容两种字段名
  avatar: playmate.avatar,
  rating: playmate.rating,
  price: playmate.price,
  tags: playmate.tags,
  isOnline: playmate.isOnline || false,
  likes: playmate.likes || 0
}"
```

### 5. 修复 FeaturedPlaymateCard 的数据映射
FeaturedPlaymateCard 使用 name 而不是 nickname：

```javascript
if (featuredResponse.success && featuredResponse.data) {
  const data = featuredResponse.data
  featuredPlaymate.value = {
    ...data,
    id: data.id,
    name: data.name || data.nickname,  // 兼容两种字段名
    avatar: data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
    price: data.price,
    tags: data.tags,
    description: data.description || `累计陪玩 ${data.likes || 0} 人喜欢`
  }
}
```

## 修改文件
1. `src/services/api.js` - 修复getGames、getPlaymates、getFeaturedPlaymate函数
2. `src/views/Home.vue` - 修复数据字段映射

## 数据格式对比

### 后端原始格式
```json
{
  "code": 0,
  "data": {
    "data": [...],
    "pagination": {...}
  },
  "msg": "获取成功"
}
```

### request函数处理后
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {...}
  }
}
```

### api.xxx函数最终返回
```json
{
  "success": true,
  "data": [...]  // 直接返回数组
}
```

## 验证
修复后，页面应该能够正常显示：
1. ✅ 首页游戏分类列表
2. ✅ 首页陪玩列表
3. ✅ 首页特色陪玩信息
4. ✅ 发现页陪玩列表
5. ✅ 游戏分类页面

## 注意事项
1. 后端返回的数据结构可能是嵌套的 `{data: {data: [...]}}`
2. 需要兼容 `nickname` 和 `name` 两种字段名
3. 所有API调用都应该通过 `src/services/api.js` 中的统一接口
4. 真实API和Mock数据的格式可能不同，需要分别处理
