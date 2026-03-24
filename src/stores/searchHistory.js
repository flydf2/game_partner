import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSearchHistoryStore = defineStore('searchHistory', () => {
  const searchHistory = ref([])
  const MAX_HISTORY = 10

  const sortedHistory = computed(() => {
    return [...searchHistory.value].sort((a, b) => b.timestamp - a.timestamp)
  })

  function addSearch(keyword) {
    if (!keyword || keyword.trim() === '') return

    const trimmedKeyword = keyword.trim()
    const existingIndex = searchHistory.value.findIndex(item => item.keyword === trimmedKeyword)

    if (existingIndex !== -1) {
      searchHistory.value.splice(existingIndex, 1)
    }

    searchHistory.value.push({
      keyword: trimmedKeyword,
      timestamp: Date.now()
    })

    if (searchHistory.value.length > MAX_HISTORY) {
      searchHistory.value.shift()
    }
  }

  function removeSearch(keyword) {
    const index = searchHistory.value.findIndex(item => item.keyword === keyword)
    if (index !== -1) {
      searchHistory.value.splice(index, 1)
    }
  }

  function clearHistory() {
    searchHistory.value = []
  }

  return {
    searchHistory,
    sortedHistory,
    addSearch,
    removeSearch,
    clearHistory
  }
})