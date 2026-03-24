// 数据缓存工具库

/**
 * 缓存配置
 */
const CACHE_CONFIG = {
  // 默认缓存过期时间（毫秒）
  DEFAULT_EXPIRY: 5 * 60 * 1000, // 5分钟
  // 缓存键前缀
  KEY_PREFIX: 'game_partner_cache_'
}

/**
 * 缓存存储
 */
class CacheStorage {
  constructor() {
    this.storage = localStorage
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   * @param {number} expiry - 过期时间（毫秒）
   */
  set(key, value, expiry = CACHE_CONFIG.DEFAULT_EXPIRY) {
    const item = {
      value,
      expiry: Date.now() + expiry,
      timestamp: Date.now()
    }
    this.storage.setItem(`${CACHE_CONFIG.KEY_PREFIX}${key}`, JSON.stringify(item))
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {*} 缓存值，如果不存在或已过期则返回null
   */
  get(key) {
    const itemStr = this.storage.getItem(`${CACHE_CONFIG.KEY_PREFIX}${key}`)
    if (!itemStr) return null

    try {
      const item = JSON.parse(itemStr)
      if (Date.now() > item.expiry) {
        this.remove(key)
        return null
      }
      return item.value
    } catch (error) {
      console.error('Cache parse error:', error)
      this.remove(key)
      return null
    }
  }

  /**
   * 移除缓存
   * @param {string} key - 缓存键
   */
  remove(key) {
    this.storage.removeItem(`${CACHE_CONFIG.KEY_PREFIX}${key}`)
  }

  /**
   * 清空所有缓存
   */
  clear() {
    const keys = Object.keys(this.storage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_CONFIG.KEY_PREFIX)) {
        this.storage.removeItem(key)
      }
    })
  }

  /**
   * 检查缓存是否存在且未过期
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在且未过期
   */
  has(key) {
    return this.get(key) !== null
  }
}

// 创建缓存实例
const cacheStorage = new CacheStorage()

/**
 * 带缓存的API请求函数
 * @param {string} key - 缓存键
 * @param {Function} fetcher - 数据获取函数
 * @param {number} expiry - 过期时间（毫秒）
 * @returns {Promise} 数据Promise
 */
export const cachedFetch = async (key, fetcher, expiry = CACHE_CONFIG.DEFAULT_EXPIRY) => {
  // 尝试从缓存获取
  const cachedData = cacheStorage.get(key)
  if (cachedData) {
    return cachedData
  }

  // 缓存不存在，调用fetcher获取数据
  const data = await fetcher()
  
  // 缓存数据
  cacheStorage.set(key, data, expiry)
  
  return data
}

/**
 * 清除指定缓存
 * @param {string} key - 缓存键
 */
export const clearCache = (key) => {
  if (key) {
    cacheStorage.remove(key)
  } else {
    cacheStorage.clear()
  }
}

/**
 * 生成缓存键
 * @param {string} prefix - 缓存键前缀
 * @param {object} params - 参数对象
 * @returns {string} 生成的缓存键
 */
export const generateKey = (prefix, params = {}) => {
  const paramsStr = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return `${prefix}${paramsStr ? `_${paramsStr}` : ''}`
}

/**
 * 缓存工具
 */
export const cache = {
  set: (key, value, expiry) => cacheStorage.set(key, value, expiry),
  get: (key) => cacheStorage.get(key),
  remove: (key) => cacheStorage.remove(key),
  clear: () => cacheStorage.clear(),
  has: (key) => cacheStorage.has(key),
  cachedFetch,
  generateKey
}

export default cache
