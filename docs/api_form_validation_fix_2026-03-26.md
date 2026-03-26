# useFormValidation 组合式函数创建记录

## 问题描述
页面出现动态导入模块错误：
```
TypeError: error loading dynamically imported module: http://localhost:5176/src/views/Discover.vue?t=1774486538966
Uncaught (in promise) TypeError: error loading dynamically imported module: http://localhost:5176/src/views/Discover.vue?t=1774486538966
```

## 问题原因
在 `src/components/common/SearchInput.vue` 文件中，导入并使用了 `useFormValidation` 组合式函数，但是 `src/composables/useFormValidation.js` 文件不存在，导致模块导入失败。

## 修复方案

### 1. 创建 `useFormValidation.js` 文件
创建 `src/composables/useFormValidation.js` 文件，实现表单验证功能：

```javascript
import { ref, reactive } from 'vue'

export const validationRules = {
  required: (message = '此字段为必填项') => (value) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    if (Array.isArray(value) && value.length === 0) {
      return message
    }
    return true
  },
  
  minLength: (length, message = `最少需要${length}个字符`) => (value) => {
    if (!value) return true
    return value.length >= length || message
  },
  
  maxLength: (length, message = `最多允许${length}个字符`) => (value) => {
    if (!value) return true
    return value.length <= length || message
  },
  
  email: (message = '请输入有效的邮箱地址') => (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || message
  },
  
  phone: (message = '请输入有效的手机号') => (value) => {
    if (!value) return true
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value) || message
  },
  
  number: (message = '请输入数字') => (value) => {
    if (!value) return true
    return !isNaN(value) || message
  },
  
  positive: (message = '请输入正数') => (value) => {
    if (!value) return true
    return Number(value) > 0 || message
  },
  
  integer: (message = '请输入整数') => (value) => {
    if (!value) return true
    return Number.isInteger(Number(value)) || message
  }
}

export function useFormValidation() {
  const errors = reactive({})
  
  function validateField(field, rules, value) {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }
    clearFieldError(field)
    return true
  }
  
  function validateForm(formData, validationRules) {
    let isValid = true
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = formData[field]
      if (!validateField(field, rules, value)) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  function clearFieldError(field) {
    delete errors[field]
  }
  
  function clearAllErrors() {
    Object.keys(errors).forEach(field => {
      delete errors[field]
    })
  }
  
  function hasFieldError(field) {
    return !!errors[field]
  }
  
  function getFieldError(field) {
    return errors[field] || ''
  }
  
  function hasErrors() {
    return Object.keys(errors).length > 0
  }
  
  return {
    errors,
    validateField,
    validateForm,
    clearFieldError,
    clearAllErrors,
    hasFieldError,
    getFieldError,
    hasErrors
  }
}
```

## 修改文件
- `src/composables/useFormValidation.js` - 创建表单验证组合式函数

## 验证
修复后，Discover页面应该能够正常加载和运行，不再出现动态导入模块错误。

## 注意事项
1. 确保所有导入的模块都存在
2. 当使用组合式函数时，需要确保它们被正确实现和导出
3. 动态导入模块错误通常是由缺失的依赖或语法错误引起的
