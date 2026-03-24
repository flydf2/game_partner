// 表单验证工具库

/**
 * 验证规则集合
 */
export const validators = {
  // 验证必填项
  required: (value) => {
    if (value === null || value === undefined) return '此项为必填项'
    if (typeof value === 'string') return value.trim() !== '' ? '' : '此项为必填项'
    if (Array.isArray(value)) return value.length > 0 ? '' : '此项为必填项'
    return ''
  },
  
  // 验证邮箱格式
  email: (value) => {
    if (!value) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? '' : '请输入有效的邮箱地址'
  },
  
  // 验证手机号格式
  phone: (value) => {
    if (!value) return ''
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value) ? '' : '请输入有效的手机号码'
  },
  
  // 验证密码强度
  password: (value) => {
    if (!value) return ''
    if (value.length < 6) return '密码长度至少为6位'
    if (value.length > 20) return '密码长度不能超过20位'
    // 可以添加更多密码强度验证规则
    return ''
  },
  
  // 验证数字
  number: (value) => {
    if (!value) return ''
    const num = Number(value)
    return !isNaN(num) ? '' : '请输入有效的数字'
  },
  
  // 验证最小值
  min: (min) => (value) => {
    if (!value) return ''
    const num = Number(value)
    return !isNaN(num) && num >= min ? '' : `输入值不能小于${min}`
  },
  
  // 验证最大值
  max: (max) => (value) => {
    if (!value) return ''
    const num = Number(value)
    return !isNaN(num) && num <= max ? '' : `输入值不能大于${max}`
  },
  
  // 验证最小长度
  minLength: (min) => (value) => {
    if (!value) return ''
    return value.length >= min ? '' : `长度不能小于${min}个字符`
  },
  
  // 验证最大长度
  maxLength: (max) => (value) => {
    if (!value) return ''
    return value.length <= max ? '' : `长度不能超过${max}个字符`
  },
  
  // 验证两次输入是否一致
  confirm: (targetValue) => (value) => {
    if (!value) return ''
    return value === targetValue ? '' : '两次输入不一致'
  }
}

/**
 * 验证表单
 * @param {Object} form - 表单数据
 * @param {Object} rules - 验证规则
 * @returns {Object} 验证结果
 */
export const validateForm = (form, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field]
    const value = form[field]
    
    for (const rule of fieldRules) {
      let errorMessage = ''
      
      if (typeof rule === 'string') {
        // 直接使用内置规则
        errorMessage = validators[rule](value)
      } else if (typeof rule === 'function') {
        // 使用自定义验证函数
        errorMessage = rule(value)
      } else if (typeof rule === 'object') {
        // 使用带参数的规则
        const [ruleName, ...args] = Object.entries(rule)[0]
        if (validators[ruleName]) {
          errorMessage = validators[ruleName](...args)(value)
        }
      }
      
      if (errorMessage) {
        errors[field] = errorMessage
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 验证单个字段
 * @param {*} value - 字段值
 * @param {Array} rules - 验证规则
 * @returns {string} 错误信息，为空表示验证通过
 */
export const validateField = (value, rules) => {
  for (const rule of rules) {
    let errorMessage = ''
    
    if (typeof rule === 'string') {
      errorMessage = validators[rule](value)
    } else if (typeof rule === 'function') {
      errorMessage = rule(value)
    } else if (typeof rule === 'object') {
      const [ruleName, ...args] = Object.entries(rule)[0]
      if (validators[ruleName]) {
        errorMessage = validators[ruleName](...args)(value)
      }
    }
    
    if (errorMessage) {
      return errorMessage
    }
  }
  
  return ''
}

export default {
  validators,
  validateForm,
  validateField
}
