import { API_BASE_URL } from './config.js'

// 拦截器配置
const interceptors = {
  request: [],
  response: []
}

// 认证请求拦截器
addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一处理后端响应格式
addResponseInterceptor(async ({ response, data }) => {
  // 后端返回格式: { code: 0, data: {...}, msg: "获取成功" }
  if (data.code === 0) {
    // 成功响应，返回标准化格式
    return {
      success: true,
      data: data.data,
      message: data.msg
    }
  } else if (data.success) {
    // 另一种成功响应格式: { success: true, data: {...} }
    return data
  } else {
    // 错误响应
    throw new Error(data.msg || data.message || `API error: code ${data.code}`)
  }
})

// 存储正在进行的请求
const pendingRequests = new Map()

// 生成请求ID
function generateRequestId(url, options) {
  const method = options.method || 'GET'
  const params = options.params ? JSON.stringify(options.params) : ''
  const body = options.body ? JSON.stringify(options.body) : ''
  return `${method}:${url}:${params}:${body}`
}

// 添加请求拦截器
export function addRequestInterceptor(interceptor) {
  interceptors.request.push(interceptor)
}

// 添加响应拦截器
export function addResponseInterceptor(interceptor) {
  interceptors.response.push(interceptor)
}

// 取消请求
export function cancelRequest(requestId) {
  if (pendingRequests.has(requestId)) {
    const abortController = pendingRequests.get(requestId)
    abortController.abort()
    pendingRequests.delete(requestId)
  }
}

// 取消所有请求
export function cancelAllRequests() {
  for (const [requestId, abortController] of pendingRequests.entries()) {
    abortController.abort()
  }
  pendingRequests.clear()
}

async function request(url, options = {}) {
  const abortController = new AbortController()
  const requestId = generateRequestId(url, options)
  
  pendingRequests.set(requestId, abortController)
  
  let config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: abortController.signal,
    ...options
  }

  // 执行请求拦截器
  for (const interceptor of interceptors.request) {
    config = await interceptor(config) || config
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    pendingRequests.delete(requestId)
    
    let responseData
    try {
      responseData = await response.json()
    } catch (error) {
      responseData = {}
    }

    // 执行响应拦截器
    for (const interceptor of interceptors.response) {
      const result = await interceptor({ response, data: responseData })
      if (result !== undefined) {
        return result
      }
    }

    if (!response.ok) {
      const error = new Error(responseData.message || `HTTP error! status: ${response.status}`)
      error.response = response
      error.data = responseData
      throw error
    }
    
    return responseData
  } catch (error) {
    pendingRequests.delete(requestId)
    console.error('API request failed:', error)
    throw error
  }
}

export async function get(url, options = {}) {
  return request(url, {
    method: 'GET',
    ...options
  })
}

export async function post(url, data, options = {}) {
  // 如果是FormData，不需要JSON.stringify
  const isFormData = data instanceof FormData
  return request(url, {
    method: 'POST',
    body: isFormData ? data : JSON.stringify(data),
    // 如果是FormData，不设置Content-Type，让浏览器自动设置
    headers: isFormData ? { ...options.headers } : {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
}

export async function put(url, data, options = {}) {
  // 如果是FormData，不需要JSON.stringify
  const isFormData = data instanceof FormData
  return request(url, {
    method: 'PUT',
    body: isFormData ? data : JSON.stringify(data),
    // 如果是FormData，不设置Content-Type，让浏览器自动设置
    headers: isFormData ? { ...options.headers } : {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
}

export async function del(url, options = {}) {
  return request(url, {
    method: 'DELETE',
    ...options
  })
}

export default {
  get,
  post,
  put,
  delete: del,
  addRequestInterceptor,
  addResponseInterceptor
}