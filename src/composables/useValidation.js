import { ref, computed } from 'vue'

export const useValidation = () => {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const validateRequired = (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  }

  const validateMinLength = (value, min) => {
    if (typeof value !== 'string') return false
    return value.trim().length >= min
  }

  const validateMaxLength = (value, max) => {
    if (typeof value !== 'string') return false
    return value.trim().length <= max
  }

  const validateRange = (value, min, max) => {
    const num = Number(value)
    return !isNaN(num) && num >= min && num <= max
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return {
    validateEmail,
    validatePhone,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateRange,
    validateUrl
  }
}

export const useFormErrors = () => {
  const errors = ref({})
  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  const setFieldError = (field, message) => {
    errors.value[field] = message
  }

  const clearFieldError = (field) => {
    delete errors.value[field]
  }

  const clearAllErrors = () => {
    errors.value = {}
  }

  const validateField = (field, value, rules) => {
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        setFieldError(field, result)
        return false
      }
    }
    clearFieldError(field)
    return true
  }

  const validateForm = (formData, validationRules) => {
    clearAllErrors()
    let isValid = true

    for (const [field, rules] of Object.entries(validationRules)) {
      const value = formData[field]
      if (!validateField(field, value, rules)) {
        isValid = false
      }
    }

    return isValid
  }

  return {
    errors,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateField,
    validateForm
  }
}

export const useErrorHandler = () => {
  const error = ref(null)
  const showError = ref(false)

  const handleError = (err) => {
    console.error('Error:', err)
    
    if (err.response) {
      error.value = err.response.data?.message || '服务器错误，请稍后重试'
    } else if (err.request) {
      error.value = '网络连接失败，请检查网络设置'
    } else {
      error.value = err.message || '发生未知错误'
    }
    
    showError.value = true
  }

  const clearError = () => {
    error.value = null
    showError.value = false
  }

  const withErrorHandling = async (fn) => {
    try {
      clearError()
      return await fn()
    } catch (err) {
      handleError(err)
      throw err
    }
  }

  return {
    error,
    showError,
    handleError,
    clearError,
    withErrorHandling
  }
}

export const validationRules = {
  required: (message = '此项为必填项') => {
    return (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0 || message
      }
      return value !== null && value !== undefined || message
    }
  },

  email: (message = '请输入有效的邮箱地址') => {
    return (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || message
    }
  },

  phone: (message = '请输入有效的手机号码') => {
    return (value) => {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(value) || message
    }
  },

  minLength: (min, message) => {
    return (value) => {
      if (typeof value !== 'string') return message || '无效的值'
      return value.trim().length >= min || (message || `最少需要${min}个字符`)
    }
  },

  maxLength: (max, message) => {
    return (value) => {
      if (typeof value !== 'string') return message || '无效的值'
      return value.trim().length <= max || (message || `最多只能${max}个字符`)
    }
  },

  range: (min, max, message) => {
    return (value) => {
      const num = Number(value)
      if (isNaN(num)) return message || '请输入有效的数字'
      return (num >= min && num <= max) || (message || `请输入${min}到${max}之间的数字`)
    }
  },

  pattern: (regex, message = '格式不正确') => {
    return (value) => {
      return regex.test(value) || message
    }
  }
}
