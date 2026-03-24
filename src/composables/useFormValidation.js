import { ref, computed } from 'vue'

export function useFormValidation() {
  const errors = ref({})
  const touched = ref({})

  function validateField(field, rules, value) {
    const fieldErrors = []

    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        fieldErrors.push(result)
      }
    }

    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors
      return false
    } else {
      delete errors.value[field]
      return true
    }
  }

  function validateForm(schema, data) {
    const isValid = true
    const newErrors = {}

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      const fieldErrors = []

      for (const rule of rules) {
        const result = rule(value)
        if (result !== true) {
          fieldErrors.push(result)
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors
      }
    }

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  function clearErrors() {
    errors.value = {}
    touched.value = {}
  }

  function clearFieldError(field) {
    delete errors.value[field]
  }

  function markTouched(field) {
    touched.value[field] = true
  }

  function isFieldTouched(field) {
    return touched.value[field] || false
  }

  function hasFieldError(field) {
    return errors.value[field] && errors.value[field].length > 0
  }

  function getFieldError(field) {
    return errors.value[field]?.[0] || ''
  }

  const hasErrors = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  return {
    errors,
    touched,
    hasErrors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    markTouched,
    isFieldTouched,
    hasFieldError,
    getFieldError
  }
}

export const validationRules = {
  required: (message = '此项为必填项') => (value) => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return true
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `最少需要${min}个字符`
    }
    return true
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `最多${max}个字符`
    }
    return true
  },

  email: (message = '请输入有效的邮箱地址') => (value) => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return message
    }
    return true
  },

  phone: (message = '请输入有效的手机号码') => (value) => {
    if (!value) return true
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      return message
    }
    return true
  },

  pattern: (regex, message) => (value) => {
    if (!value) return true
    if (!regex.test(value)) {
      return message
    }
    return true
  },

  min: (min, message) => (value) => {
    if (value !== null && value !== undefined && value < min) {
      return message || `最小值为${min}`
    }
    return true
  },

  max: (max, message) => (value) => {
    if (value !== null && value !== undefined && value > max) {
      return message || `最大值为${max}`
    }
    return true
  }
}
