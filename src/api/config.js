const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

async function request(endpoint, options = {}) {
  const url = `${apiConfig.baseURL}${endpoint}`
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...options.headers
    }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout)

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export { request, API_BASE_URL }