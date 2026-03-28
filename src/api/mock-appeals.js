// 申诉相关的模拟数据
export const mockAppeals = [
  {
    id: 1,
    type: '账号封禁',
    content: '我没有使用任何作弊软件，账号被误封了，请解封',
    status: '处理中',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    type: '订单纠纷',
    content: '订单已经完成，但是对方没有支付费用',
    status: '已处理',
    createdAt: '2024-01-10 14:20:00',
    updatedAt: '2024-01-11 09:15:00',
    reply: '已经联系对方，费用将在24小时内到账'
  },
  {
    id: 3,
    type: '其他问题',
    content: '应用频繁崩溃，无法正常使用',
    status: '已处理',
    createdAt: '2024-01-05 08:45:00',
    updatedAt: '2024-01-05 16:30:00',
    reply: '请更新到最新版本，问题已修复'
  }
]

// 获取申诉列表
export function getAppeals() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockAppeals,
        message: '获取申诉列表成功'
      })
    }, 500)
  })
}

// 提交申诉
export function submitAppeal(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAppeal = {
        id: mockAppeals.length + 1,
        type: data.type,
        content: data.content,
        status: '处理中',
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }
      mockAppeals.unshift(newAppeal)
      resolve({
        code: 200,
        data: newAppeal,
        message: '提交申诉成功'
      })
    }, 500)
  })
}

// 获取申诉详情
export function getAppealDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appeal = mockAppeals.find(item => item.id === parseInt(id))
      if (appeal) {
        resolve({
          code: 200,
          data: appeal,
          message: '获取申诉详情成功'
        })
      } else {
        resolve({
          code: 404,
          data: null,
          message: '申诉不存在'
        })
      }
    }, 500)
  })
}

// 创建申诉（别名，兼容其他地方的调用）
export const mockCreateAppeal = submitAppeal

// 获取申诉详情（别名，兼容其他地方的调用）
export const mockGetAppealDetail = getAppealDetail

// 获取申诉列表（别名，兼容其他地方的调用）
export const mockGetAppeals = getAppeals