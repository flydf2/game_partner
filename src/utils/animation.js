// 动画工具库

/**
 * 动画配置
 */
const ANIMATION_CONFIG = {
  // 默认动画持续时间（毫秒）
  DEFAULT_DURATION: 300,
  // 默认动画缓动函数
  DEFAULT_EASING: 'ease'
}

/**
 * 缓动函数
 */
export const easing = {
  // 线性
  linear: 'linear',
  // 缓入
  easeIn: 'ease-in',
  // 缓出
  easeOut: 'ease-out',
  // 缓入缓出
  easeInOut: 'ease-in-out',
  // 弹性
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // 弹跳
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // 平滑
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
}

/**
 * 执行CSS动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} styles - 动画目标样式
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const animate = (element, styles, options = {}) => {
  return new Promise((resolve) => {
    const duration = options.duration || ANIMATION_CONFIG.DEFAULT_DURATION
    const easingFunc = options.easing || ANIMATION_CONFIG.DEFAULT_EASING
    const delay = options.delay || 0

    // 保存原始样式
    const originalStyles = {}
    Object.keys(styles).forEach(prop => {
      originalStyles[prop] = element.style[prop]
    })

    // 设置过渡效果
    element.style.transition = `all ${duration}ms ${easingFunc} ${delay}ms`

    // 应用目标样式
    setTimeout(() => {
      Object.keys(styles).forEach(prop => {
        element.style[prop] = styles[prop]
      })

      // 动画完成后清理
      setTimeout(() => {
        element.style.transition = ''
        resolve()
      }, duration + delay)
    }, 10)
  })
}

/**
 * 淡入动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const fadeIn = (element, options = {}) => {
  element.style.opacity = '0'
  element.style.display = 'block'
  return animate(element, { opacity: '1' }, options)
}

/**
 * 淡出动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const fadeOut = (element, options = {}) => {
  return animate(element, { opacity: '0' }, options).then(() => {
    element.style.display = 'none'
  })
}

/**
 * 滑入动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} direction - 方向：top, bottom, left, right
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const slideIn = (element, direction = 'top', options = {}) => {
  const distance = options.distance || '20px'
  const initialStyles = {
    opacity: '0',
    display: 'block'
  }

  switch (direction) {
    case 'top':
      initialStyles.transform = `translateY(-${distance})`
      break
    case 'bottom':
      initialStyles.transform = `translateY(${distance})`
      break
    case 'left':
      initialStyles.transform = `translateX(-${distance})`
      break
    case 'right':
      initialStyles.transform = `translateX(${distance})`
      break
  }

  // 应用初始样式
  Object.keys(initialStyles).forEach(prop => {
    element.style[prop] = initialStyles[prop]
  })

  // 执行动画
  return animate(element, {
    opacity: '1',
    transform: 'translate(0, 0)'
  }, options)
}

/**
 * 滑出动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} direction - 方向：top, bottom, left, right
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const slideOut = (element, direction = 'top', options = {}) => {
  const distance = options.distance || '20px'
  const targetStyles = {
    opacity: '0'
  }

  switch (direction) {
    case 'top':
      targetStyles.transform = `translateY(-${distance})`
      break
    case 'bottom':
      targetStyles.transform = `translateY(${distance})`
      break
    case 'left':
      targetStyles.transform = `translateX(-${distance})`
      break
    case 'right':
      targetStyles.transform = `translateX(${distance})`
      break
  }

  return animate(element, targetStyles, options).then(() => {
    element.style.display = 'none'
  })
}

/**
 * 缩放动画
 * @param {HTMLElement} element - 目标元素
 * @param {number} from - 起始缩放值
 * @param {number} to - 结束缩放值
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const scale = (element, from = 0.8, to = 1, options = {}) => {
  element.style.transform = `scale(${from})`
  element.style.opacity = '0'
  element.style.display = 'block'

  return animate(element, {
    transform: `scale(${to})`,
    opacity: '1'
  }, options)
}

/**
 * 心跳动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const heartbeat = (element, options = {}) => {
  const duration = options.duration || 1000

  return animate(element, {
    transform: 'scale(1.1)'
  }, { ...options, duration: duration / 2 }).then(() => {
    return animate(element, {
      transform: 'scale(1)'
    }, { ...options, duration: duration / 2 })
  })
}

/**
 * 脉冲动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const pulse = (element, options = {}) => {
  const duration = options.duration || 1000

  return animate(element, {
    transform: 'scale(1.05)'
  }, { ...options, duration: duration / 2 }).then(() => {
    return animate(element, {
      transform: 'scale(1)'
    }, { ...options, duration: duration / 2 })
  })
}

/**
 * 摇摆动画
 * @param {HTMLElement} element - 目标元素
 * @param {Object} options - 动画选项
 * @returns {Promise} 动画完成Promise
 */
export const shake = (element, options = {}) => {
  const duration = options.duration || 500
  const distance = options.distance || '10px'

  return animate(element, {
    transform: `translateX(${distance})`
  }, { ...options, duration: duration / 3 }).then(() => {
    return animate(element, {
      transform: `translateX(-${distance})`
    }, { ...options, duration: duration / 3 })
  }).then(() => {
    return animate(element, {
      transform: `translateX(${distance})`
    }, { ...options, duration: duration / 3 })
  }).then(() => {
    return animate(element, {
      transform: 'translateX(0)'
    }, { ...options, duration: duration / 3 })
  })
}

/**
 * 动画工具
 */
export const animation = {
  animate,
  fadeIn,
  fadeOut,
  slideIn,
  slideOut,
  scale,
  heartbeat,
  pulse,
  shake,
  easing
}

export default animation
