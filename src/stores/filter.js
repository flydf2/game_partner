import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  const filters = ref({
    online: null,
    priceRange: null,
    rank: null,
    gender: null,
    game: null
  })

  const activeFiltersCount = computed(() => {
    return Object.values(filters.value).filter(value => value !== null).length
  })

  const hasActiveFilters = computed(() => {
    return activeFiltersCount.value > 0
  })

  function setFilter(key, value) {
    filters.value[key] = value
  }

  function clearFilter(key) {
    filters.value[key] = null
  }

  function clearAllFilters() {
    filters.value = {
      online: null,
      priceRange: null,
      rank: null,
      gender: null,
      game: null
    }
  }

  function getFilterQuery() {
    const query = {}
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== null) {
        query[key] = value
      }
    })
    return query
  }

  return {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
    getFilterQuery
  }
})