# useToast 组合式函数修复记录

## 问题描述
页面出现动态导入模块错误：
```
TypeError: error loading dynamically imported module: http://localhost:5176/src/views/Discover.vue?t=1774486342715
Uncaught (in promise) TypeError: error loading dynamically imported module: http://localhost:5176/src/views/Discover.vue?t=1774486342715
```

## 问题原因
在 `src/composables/useToast.js` 文件中，`useToast` 函数只返回了 `{ showToast, toasts }`，但在 `Discover.vue` 中使用了 `{ success, error: showError }`，导致变量未定义错误。

## 修复方案

### 1. 修复 `useToast` 函数
在 `useToast` 函数中添加 `success`、`error`、`warning` 和 `info` 方法：

```javascript
export function useToast() {
  const showToast = (message, type = 'success', duration = 3000) => {
    const id = ++toastId
    
    toasts.value.push({
      id,
      message,
      type,
      duration
    })
    
    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, duration)
  }
  
  const success = (message, duration = 3000) => {
    showToast(message, 'success', duration)
  }
  
  const error = (message, duration = 3000) => {
    showToast(message, 'error', duration)
  }
  
  const warning = (message, duration = 3000) => {
    showToast(message, 'warning', duration)
  }
  
  const info = (message, duration = 3000) => {
    showToast(message, 'info', duration)
  }
  
  return {
    showToast,
    success,
    error,
    warning,
    info,
    toasts
  }
}
```

## 修改文件
- `src/composables/useToast.js` - 添加 `success`、`error`、`warning` 和 `info` 方法

## 验证
修复后，Discover页面应该能够正常加载和运行，不再出现动态导入模块错误。

## 注意事项
1. 确保组合式函数返回的对象包含所有在组件中使用的方法
2. 当修改组合式函数的返回值时，需要检查所有使用该函数的组件
3. 动态导入模块错误通常是由语法错误或未定义变量引起的
