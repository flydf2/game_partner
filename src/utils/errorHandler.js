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
