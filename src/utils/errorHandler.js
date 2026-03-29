// 错误处理工具库

/**
 * 错误类型定义
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

/**
 * 错误码映射表
 */
export const ErrorCodeMap = {
  // 用户模块
  10001: '用户不存在',
  10002: '用户名或密码错误',
  10003: '用户名已存在',
  10004: '手机号已被注册',
  10005: '已经关注过该用户',
  10006: '未关注该用户',
  10007: '收藏不存在',
  10011: '不能关注自己',
  
  // 钱包模块
  10008: '余额不足',
  10009: '钱包不存在',
  10010: '金额格式错误',
  
  // 订单模块
  10101: '订单不存在',
  10102: '陪玩不存在',
  10103: '订单不可抢',
  10104: '您已经抢过此订单',
  10105: '抢单申请不存在',
  10106: '抢单申请不属于该订单',
  10107: '订单状态不允许支付',
  10108: '支付金额与订单金额不符',
  10109: '订单状态不允许确认服务',
  10110: '无权操作此订单',
  10111: '该订单状态无法取消',
  10112: '该订单状态无法接受',
  10113: '该订单状态无法拒绝',
  
  // 申诉模块
  10201: '申诉不存在',
  10202: '只能更新待处理状态的申诉',
  10203: '该申诉已处理完成',
  
  // 通知模块
  10301: '通知不存在',
  
  // 消息模块
  10401: '用户不存在',
  10402: '会话不存在'
}

/**
 * 错误处理函数
 * @param {Error} error - 错误对象
 * @returns {Object} 处理后的错误信息
 */
export const handleError = (error) => {
  console.error('Error:', error)
  
  // 处理网络错误
  if (!error.response) {
    return {
      type: ErrorTypes.NETWORK_ERROR,
      message: '网络连接失败，请检查网络设置',
      status: 0
    }
  }
  
  const { response } = error
  const { status, data } = response
  
  // 处理后端返回的错误码
  if (data.code) {
    const errorCode = data.code
    const errorMessage = ErrorCodeMap[errorCode] || data.msg || data.message
    
    // 根据错误码类型分类
    if (errorCode >= 10001 && errorCode <= 10011) {
      // 用户模块错误
      return {
        type: ErrorTypes.VALIDATION_ERROR,
        message: errorMessage,
        status,
        code: errorCode
      }
    } else if (errorCode >= 10101 && errorCode <= 10113) {
      // 订单模块错误
      return {
        type: ErrorTypes.API_ERROR,
        message: errorMessage,
        status,
        code: errorCode
      }
    } else if (errorCode >= 10201 && errorCode <= 10203) {
      // 申诉模块错误
      return {
        type: ErrorTypes.API_ERROR,
        message: errorMessage,
        status,
        code: errorCode
      }
    } else if (errorCode >= 10301 && errorCode <= 10301) {
      // 通知模块错误
      return {
        type: ErrorTypes.API_ERROR,
        message: errorMessage,
        status,
        code: errorCode
      }
    } else if (errorCode >= 10401 && errorCode <= 10402) {
      // 消息模块错误
      return {
        type: ErrorTypes.API_ERROR,
        message: errorMessage,
        status,
        code: errorCode
      }
    } else {
      // 未识别的错误码
      return {
        type: ErrorTypes.UNKNOWN_ERROR,
        message: errorMessage || '未知错误',
        status,
        code: errorCode
      }
    }
  }
  
  // 根据状态码处理不同类型的错误
  switch (status) {
    case 400:
      return {
        type: ErrorTypes.VALIDATION_ERROR,
        message: data.message || '请求参数错误',
        status,
        details: data.errors || {}
      }
    
    case 401:
      return {
        type: ErrorTypes.AUTH_ERROR,
        message: data.message || '未授权，请重新登录',
        status
      }
    
    case 403:
      return {
        type: ErrorTypes.AUTH_ERROR,
        message: data.message || '权限不足',
        status
      }
    
    case 404:
      return {
        type: ErrorTypes.API_ERROR,
        message: data.message || '请求的资源不存在',
        status
      }
    
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
      return {
        type: ErrorTypes.SERVER_ERROR,
        message: data.message || '服务器错误，请稍后重试',
        status
      }
    
    default:
      return {
        type: ErrorTypes.UNKNOWN_ERROR,
        message: data.message || '未知错误',
        status
      }
  }
}

/**
 * 显示错误提示
 * @param {Object} error - 错误对象
 * @param {Function} showMessage - 消息提示函数
 */
export const showError = (error, showMessage = console.error) => {
  const handledError = handleError(error)
  showMessage(handledError.message)
  return handledError
}

/**
 * 处理API请求错误
 * @param {Error} error - 错误对象
 * @param {Function} showMessage - 消息提示函数
 * @returns {Promise} 拒绝的Promise
 */
export const handleApiError = (error, showMessage = console.error) => {
  const handledError = showError(error, showMessage)
  
  // 处理认证错误，跳转到登录页
  if (handledError.type === ErrorTypes.AUTH_ERROR) {
    // 这里可以添加跳转到登录页的逻辑
    console.log('跳转到登录页')
  }
  
  return Promise.reject(handledError)
}

/**
 * 全局错误处理
 * @param {Error} error - 错误对象
 * @param {Vue} app - Vue实例
 */
export const globalErrorHandler = (error, app) => {
  console.error('Global Error:', error)
  
  // 处理Vue组件错误
  if (error.name === 'VueError') {
    console.error('Vue Component Error:', error)
  }
  
  // 处理其他类型的错误
  const handledError = handleError(error)
  
  // 这里可以添加全局错误提示逻辑
  if (app && app.config.globalProperties.$message) {
    app.config.globalProperties.$message.error(handledError.message)
  } else {
    console.error(handledError.message)
  }
}

export default {
  ErrorTypes,
  handleError,
  showError,
  handleApiError,
  globalErrorHandler
}
