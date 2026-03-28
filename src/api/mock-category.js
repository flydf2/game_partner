export const mockGameCategories = [
  { id: 'moba', label: 'MOBA' },
  { id: 'shooting', label: '射击' },
  { id: 'competitive', label: '竞技' },
  { id: 'entertainment', label: '娱乐' },
  { id: 'online', label: '网游' },
  { id: 'console', label: '主机' }
]

export const mockGames = [
  { id: 1, name: '英雄联盟', category: 'moba', image: 'https://via.placeholder.com/150/6c5a00/ffffff?text=英雄联盟' },
  { id: 2, name: '王者荣耀', category: 'moba', image: 'https://via.placeholder.com/150/6c5a00/ffffff?text=王者荣耀' },
  { id: 3, name: '和平精英', category: 'shooting', image: 'https://via.placeholder.com/150/8c4a00/ffffff?text=和平精英' },
  { id: 4, name: 'Dota 2', category: 'moba', image: 'https://via.placeholder.com/150/6c5a00/ffffff?text=Dota+2' },
  { id: 5, name: '原神', category: 'entertainment', image: 'https://via.placeholder.com/150/805100/ffffff?text=原神' },
  { id: 6, name: '永劫无间', category: 'competitive', image: 'https://via.placeholder.com/150/704700/ffffff?text=永劫无间' },
  { id: 7, name: '决战平安京', category: 'moba', image: 'https://via.placeholder.com/150/6c5a00/ffffff?text=平安京' },
  { id: 8, name: '第五人格', category: 'entertainment', image: 'https://via.placeholder.com/150/805100/ffffff?text=第五人格' },
  { id: 9, name: '英雄联盟手游', category: 'moba', image: 'https://via.placeholder.com/150/6c5a00/ffffff?text=英雄联盟手游' }
]

export function mockGetCategories() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          categories: mockGameCategories
        }
      })
    }, 200)
  })
}

export function mockGetGamesByCategory(categoryId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const games = mockGames.filter(game => game.category === categoryId)
      resolve({
        success: true,
        data: games
      })
    }, 200)
  })
}

export function mockGetGames() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockGames
      })
    }, 200)
  })
}
