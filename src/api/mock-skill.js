export function mockGetSkills(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟更多技能数据
      const mockSkills = [
        {
          id: 1,
          game: 'LOL',
          skill: '钻石段位',
          level: 'advanced',
          levelText: '高级',
          certificationStatus: '已认证',
          serviceCount: 45,
          rating: 4.8
        },
        {
          id: 2,
          game: 'CS:GO',
          skill: '大师陪玩',
          level: 'expert',
          levelText: '专家',
          certificationStatus: '已认证',
          serviceCount: 32,
          rating: 4.9
        },
        {
          id: 3,
          game: 'PUBG',
          skill: '吃鸡大神',
          level: 'intermediate',
          levelText: '中级',
          certificationStatus: '待认证',
          serviceCount: 15,
          rating: 4.5
        },
        {
          id: 4,
          game: 'DOTA2',
          skill: '传奇段位',
          level: 'advanced',
          levelText: '高级',
          certificationStatus: '已认证',
          serviceCount: 28,
          rating: 4.7
        },
        {
          id: 5,
          game: 'VALORANT',
          skill: '钻石选手',
          level: 'intermediate',
          levelText: '中级',
          certificationStatus: '待认证',
          serviceCount: 12,
          rating: 4.6
        },
        {
          id: 6,
          game: 'LOL',
          skill: '大师陪玩',
          level: 'expert',
          levelText: '专家',
          certificationStatus: '已认证',
          serviceCount: 56,
          rating: 4.9
        },
        {
          id: 7,
          game: 'CS:GO',
          skill: '全球精英',
          level: 'expert',
          levelText: '专家',
          certificationStatus: '已认证',
          serviceCount: 41,
          rating: 4.8
        },
        {
          id: 8,
          game: 'PUBG',
          skill: '超级王牌',
          level: 'advanced',
          levelText: '高级',
          certificationStatus: '待认证',
          serviceCount: 22,
          rating: 4.7
        }
      ]
      
      // 计算分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = mockSkills.slice(startIndex, endIndex)
      
      resolve({
        code: 0,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockSkills.length / pageSize),
            totalCount: mockSkills.length
          }
        },
        msg: '获取成功'
      })
    }, 300)
  })
}

export function mockAddSkill(skillData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '添加技能成功',
        data: {
          id: Date.now(),
          ...skillData,
          certificationStatus: '待认证',
          serviceCount: 0,
          rating: 5.0
        }
      })
    }, 500)
  })
}

export function mockUpdateSkill(skillId, skillData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '更新技能成功',
        data: {
          id: skillId,
          ...skillData
        }
      })
    }, 500)
  })
}

export function mockDeleteSkill(skillId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '删除技能成功'
      })
    }, 300)
  })
}
