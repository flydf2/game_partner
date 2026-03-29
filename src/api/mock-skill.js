export function mockGetSkills(params = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
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
          }
        ]
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
