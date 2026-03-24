export const validators = {
  required: (value, message = '此项为必填项') => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return true
  },

  email: (value, message = '请输入有效的邮箱地址') => {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return message
    }
    return true
  },

  phone: (value, message = '请输入有效的手机号码') => {
    if (!value) return true
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      return message
    }
    return true
  },

  password: (value, message = '密码长度至少为6位') => {
    if (!value) return true
    if (value.length < 6) {
      return message
    }
    return true
  },

  strongPassword: (value, message = '密码必须包含字母和数字') => {
    if (!value) return true
    const hasLetter = /[a-zA-Z]/.test(value)
    const hasNumber = /\d/.test(value)
    if (!hasLetter || !hasNumber) {
      return message
    }
    return true
  },

  minLength: (min, message) => (value) => {
    if (!value) return true
    if (value.length < min) {
      return message || `长度不能少于${min}个字符`
    }
    return true
  },

  maxLength: (max, message) => (value) => {
    if (!value) return true
    if (value.length > max) {
      return message || `长度不能超过${max}个字符`
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

  number: (value, message = '请输入有效的数字') => {
    if (!value) return true
    if (isNaN(Number(value))) {
      return message
    }
    return true
  },

  positiveNumber: (value, message = '请输入正数') => {
    if (!value) return true
    const num = Number(value)
    if (isNaN(num) || num <= 0) {
      return message
    }
    return true
  },

  url: (value, message = '请输入有效的URL') => {
    if (!value) return true
    try {
      new URL(value)
      return true
    } catch {
      return message
    }
  },

  date: (value, message = '请输入有效的日期') => {
    if (!value) return true
    if (isNaN(Date.parse(value))) {
      return message
    }
    return true
  },

  equalTo: (field, message = '两次输入不一致') => (value, formData) => {
    if (!value) return true
    if (value !== formData[field]) {
      return message
    }
    return true
  },

  range: (min, max, message) => (value) => {
    if (!value) return true
    const num = Number(value)
    if (isNaN(num) || num < min || num > max) {
      return message || `请输入${min}到${max}之间的数字`
    }
    return true
  }
}

export function validateForm(formData, rules) {
  const errors = {}
  let isValid = true

  for (const field in rules) {
    const fieldRules = rules[field]
    const value = formData[field]

    for (const rule of fieldRules) {
      const result = rule(value, formData)
      if (result !== true) {
        errors[field] = result
        isValid = false
        break
      }
    }
  }

  return {
    isValid,
    errors
  }
}

export function validateField(value, rules) {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) {
      return result
    }
  }
  return true
}

export function clearFieldErrors(errors, field) {
  const newErrors = { ...errors }
  delete newErrors[field]
  return newErrors
}

export function clearAllErrors() {
  return {}
}

export const formRules = {
  login: {
    username: [
      validators.required('请输入用户名'),
      validators.minLength(3, '用户名长度至少为3位'),
      validators.maxLength(20, '用户名长度不能超过20位')
    ],
    password: [
      validators.required('请输入密码'),
      validators.password()
    ]
  },

  register: {
    username: [
      validators.required('请输入用户名'),
      validators.minLength(3, '用户名长度至少为3位'),
      validators.maxLength(20, '用户名长度不能超过20位')
    ],
    phone: [
      validators.required('请输入手机号'),
      validators.phone()
    ],
    password: [
      validators.required('请输入密码'),
      validators.minLength(6, '密码长度至少为6位'),
      validators.strongPassword()
    ],
    confirmPassword: [
      validators.required('请确认密码'),
      validators.equalTo('password', '两次输入的密码不一致')
    ]
  },

  profile: {
    nickname: [
      validators.required('请输入昵称'),
      validators.minLength(2, '昵称长度至少为2位'),
      validators.maxLength(20, '昵称长度不能超过20位')
    ],
    bio: [
      validators.maxLength(200, '个人简介不能超过200个字符')
    ]
  },

  order: {
    serviceTime: [
      validators.required('请选择服务时间')
    ],
    amount: [
      validators.required('请输入金额'),
      validators.positiveNumber('请输入有效的金额')
    ]
  },

  review: {
    rating: [
      validators.required('请选择评分')
    ],
    content: [
      validators.required('请输入评价内容'),
      validators.minLength(10, '评价内容至少为10个字符'),
      validators.maxLength(500, '评价内容不能超过500个字符')
    ]
  }
}