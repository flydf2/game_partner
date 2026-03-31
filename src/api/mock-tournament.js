export const mockTournaments = [
  {
    id: 1,
    title: '王者荣耀春季联赛',
    description: '王者荣耀春季联赛是官方举办的大型电竞赛事，汇聚了全服最顶尖的选手。赛事分为海选赛、淘汰赛和决赛三个阶段，最终决出冠军。冠军将获得丰厚奖金和限定皮肤。',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJCdVR4SWlVmZS2MfQxv4neWDHVSFi46iFu7fIlPuVcLUzoMaMncSZHdLUkeV6uno5pL3MvmUa7m5q3jQFEiIa1tlYhxIxW43ul0iN37eeYHJZEAZD_Nonsn3SrL3j3htSrp0l3GDtWDA4dsGL-GTGfRJU5k7W99I3RnHFfw_bieodydRDntxEspPO8D_yu3K5n-8DSp_x_AKb77wFMUJe9DzUntWS-mfd2UsJzyUft_2rZPiJ1jRBVJQqDMGpVHTdG6aRdOaK2tU',
    game: '王者荣耀',
    status: 'upcoming',
    registerTime: '2026-04-01 至 2026-04-05',
    matchTime: '2026-04-10 至 2026-04-15',
    prize: '¥10,000',
    participants: 128,
    rules: [
      '采用BO3淘汰赛制',
      '参赛者需达到指定段位要求',
      '禁止使用任何作弊手段',
      '最终解释权归主办方所有'
    ]
  },
  {
    id: 2,
    title: '英雄联盟全球总决赛预选赛',
    description: '英雄联盟全球总决赛预选赛是国内最高水平的电竞赛事之一，汇聚了各路高手。赛事分为小组赛、淘汰赛和决赛三个阶段。',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHdJE8Ql8TnJGS2MfQxv4neWDHVSFi46iFu7fIlPuVcLUzoMaMncSZHdLUkeV6uno5pL3MvmUa7m5q3jQFEiIa1tlYhxIxW43ul0iN37eeYHJZEAZD_Nonsn3SrL3j3htSrp0l3GDtWDA4dsGL-GTGfRJU5k7W99I3RnHFfw_bieodydRDntxEspPO8D_yu3K5n-8DSp_x_AKb77wFMUJe9DzUntWS-mfd2UsJzyUft_2rZPiJ1jRBVJQqDMGpVHTdG6aRdOaK2tU',
    game: '英雄联盟',
    status: 'ongoing',
    registerTime: '2026-03-01 至 2026-03-10',
    matchTime: '2026-03-15 至 2026-03-25',
    prize: '¥50,000',
    participants: 256,
    rules: [
      '采用BO5淘汰赛制',
      '必须使用正式服账号参赛',
      '禁止使用任何第三方软件',
      '保持良好的游戏态度'
    ]
  },
  {
    id: 3,
    title: '绝地求生杯首届邀请赛',
    description: '绝地求生杯首届邀请赛，邀请了全服最顶尖的选手参与。赛事采用积分制，最终根据总积分排名。',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuEIfKf9Rm9UoJHS3NfRyx5ofXEOJWIh46jGu8jIoPwVcMUz1obSndTZHmMklI6vunp6pL4NvnUb8n6q4kRGjJhJa2tlYhxIxW43ul0iN37eeYHJZEAZD_Nonsn3SrL3j3htSrp0l3GDtWDA4dsGL-GTGfRJU5k7W99I3RnHFfw_bieodydRDntxEspPO8D_yu3K5n-8DSp_x_AKb77wFMUJe9DzUntWS-mfd2UsJzyUft_2rZPiJ1jRBVJQqDMGpVHTdG6aRdOaK2tU',
    game: '绝地求生',
    status: 'completed',
    registerTime: '2026-02-01 至 2026-02-10',
    matchTime: '2026-02-15 至 2026-02-20',
    prize: '¥30,000',
    participants: 64,
    rules: [
      '采用多轮积分制',
      '每轮比赛独立计分',
      '禁止开挂作弊',
      '最终解释权归主办方所有'
    ]
  }
]

export const mockTeams = {
  1: [
    { id: 1, name: 'WX战队', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', members: 5, rank: '冠军' },
    { id: 2, name: 'QG战队', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', members: 5, rank: '亚军' },
    { id: 3, name: 'AG战队', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', members: 5 },
    { id: 4, name: 'RNG战队', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', members: 5 }
  ],
  2: [
    { id: 1, name: 'EDG战队', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', members: 5, rank: '冠军' },
    { id: 2, name: 'RNG战队', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', members: 5, rank: '亚军' },
    { id: 3, name: 'WE战队', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', members: 5 },
    { id: 4, name: 'BLG战队', avatar: 'https://randomuser.me/api/portraits/men/8.jpg', members: 5 }
  ],
  3: [
    { id: 1, name: '4AM战队', avatar: 'https://randomuser.me/api/portraits/men/9.jpg', members: 4, rank: '冠军' },
    { id: 2, name: 'IFTY战队', avatar: 'https://randomuser.me/api/portraits/men/10.jpg', members: 4, rank: '亚军' }
  ]
}

export const mockMatches = {
  1: [
    {
      id: 1,
      time: '04-10 14:00',
      team1: 'WX战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      team2: 'QG战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      score1: 2,
      score2: 1,
      status: 'completed'
    },
    {
      id: 2,
      time: '04-10 16:00',
      team1: 'AG战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      team2: 'RNG战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      score1: null,
      score2: null,
      status: 'upcoming'
    }
  ],
  2: [
    {
      id: 1,
      time: '03-15 10:00',
      team1: 'EDG战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      team2: 'RNG战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      score1: 3,
      score2: 2,
      status: 'completed'
    },
    {
      id: 2,
      time: '03-15 14:00',
      team1: 'WE战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      team2: 'BLG战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      score1: 1,
      score2: 3,
      status: 'completed'
    },
    {
      id: 3,
      time: '03-20 14:00',
      team1: 'EDG战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      team2: 'BLG战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      score1: null,
      score2: null,
      status: 'ongoing'
    }
  ],
  3: [
    {
      id: 1,
      time: '02-15 10:00',
      team1: '4AM战队',
      team1Avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      team2: 'IFTY战队',
      team2Avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      score1: 2,
      score2: 0,
      status: 'completed'
    }
  ]
}

const mockTournamentService = {
  getTournamentDetail: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tournament = mockTournaments.find(t => t.id === Number(id))
        if (tournament) {
          resolve(tournament)
        } else {
          reject(new Error('赛事不存在'))
        }
      }, 500)
    })
  },

  getTournamentTeams: (tournamentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTeams[tournamentId] || [])
      }, 300)
    })
  },

  getTournamentMatches: (tournamentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMatches[tournamentId] || [])
      }, 300)
    })
  },

  joinTournament: (tournamentId, teamInfo) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (teamInfo && teamInfo.teamName) {
          resolve({ success: true, message: '报名成功' })
        } else {
          reject(new Error('请填写完整的报名信息'))
        }
      }, 1000)
    })
  },

  getTournamentList: (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...mockTournaments]
        if (params && params.status) {
          list = list.filter(t => t.status === params.status)
        }
        resolve({
          list,
          total: list.length
        })
      }, 300)
    })
  }
}

export default mockTournamentService