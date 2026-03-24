<template>
  <div class="relative w-full">
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchKeyword"
        type="text"
        placeholder="搜索陪玩、游戏、段位..."
        class="w-full h-10 sm:h-12 bg-surface-container-high rounded-full px-4 sm:px-5 pr-10 sm:pr-12 text-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown.enter="handleSearch"
        @input="handleInput"
      />
      <button
        class="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 text-zinc-400 hover:text-primary transition-colors"
        @click="handleSearch"
      >
        <span class="material-symbols-outlined text-base sm:text-xl">search</span>
      </button>
    </div>

    <div
      v-if="showSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0)"
      class="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden z-50"
    >
      <div v-if="searchSuggestions.length > 0" class="p-2">
        <div class="text-xs font-bold text-zinc-400 px-2 sm:px-3 py-2">搜索建议</div>
        <div
          v-for="(suggestion, index) in searchSuggestions"
          :key="`suggestion-${index}`"
          class="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-left text-sm hover:bg-surface-container-low rounded-xl transition-colors flex items-center gap-2 sm:gap-3 cursor-pointer"
          @mousedown="selectSuggestion(suggestion)"
        >
          <span class="material-symbols-outlined text-zinc-400 text-base sm:text-lg">search</span>
          <span>{{ suggestion }}</span>
        </div>
      </div>

      <div v-if="searchHistory.length > 0 && searchSuggestions.length === 0" class="p-2">
        <div class="flex items-center justify-between px-2 sm:px-3 py-2">
          <div class="text-xs font-bold text-zinc-400">搜索历史</div>
          <button
            class="text-xs text-primary hover:text-primary-dim transition-colors"
            @mousedown="clearHistory"
          >
            清空
          </button>
        </div>
        <div
          v-for="(item, index) in searchHistory"
          :key="`history-${index}`"
          class="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-left text-sm hover:bg-surface-container-low rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
          @mousedown="selectHistory(item.keyword)"
        >
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="material-symbols-outlined text-zinc-400 text-base sm:text-lg">history</span>
            <span>{{ item.keyword }}</span>
          </div>
          <span
            class="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-error transition-all cursor-pointer"
            @mousedown.stop="removeHistory(item.keyword)"
          >
            <span class="material-symbols-outlined text-base sm:text-lg">close</span>
          </span>
        </div>
      </div>
    </div>

    <div v-if="hasError" class="mt-1 text-xs text-error font-medium">
      {{ getFieldError('keyword') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useSearchHistoryStore } from '../../stores/searchHistory.js'
import { getSearchSuggestions } from '../../api/index.js'
import { useFormValidation, validationRules } from '../../composables/useFormValidation.js'

const emit = defineEmits(['search'])

const searchInput = ref(null)
const searchKeyword = ref('')
const showSuggestions = ref(false)
const searchSuggestions = ref([])
const searchHistoryStore = useSearchHistoryStore()

const { validateField, clearFieldError, hasFieldError, getFieldError } = useFormValidation()

const searchRules = [
  validationRules.minLength(1, '请输入搜索关键词'),
  validationRules.maxLength(50, '搜索关键词最多50个字符')
]

const searchHistory = computed(() => searchHistoryStore.sortedHistory)

const hasError = computed(() => hasFieldError('keyword'))

let debounceTimer = null

function handleInput() {
  clearTimeout(debounceTimer)
  
  if (searchKeyword.value.trim() === '') {
    searchSuggestions.value = []
    clearFieldError('keyword')
    return
  }

  validateField('keyword', searchRules, searchKeyword.value.trim())

  debounceTimer = setTimeout(async () => {
    try {
      const suggestions = await getSearchSuggestions(searchKeyword.value.trim())
      searchSuggestions.value = suggestions
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      searchSuggestions.value = []
    }
  }, 300)
}

function handleSearch() {
  const keyword = searchKeyword.value.trim()
  
  if (!keyword) {
    validateField('keyword', searchRules, keyword)
    return
  }

  if (hasError.value) {
    return
  }

  searchHistoryStore.addSearch(keyword)
  emit('search', keyword)
  showSuggestions.value = false
  searchSuggestions.value = []
  clearFieldError('keyword')
}

function selectSuggestion(suggestion) {
  searchKeyword.value = suggestion
  handleSearch()
}

function selectHistory(keyword) {
  searchKeyword.value = keyword
  handleSearch()
}

function removeHistory(keyword) {
  searchHistoryStore.removeSearch(keyword)
}

function clearHistory() {
  searchHistoryStore.clearHistory()
}

function handleBlur() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

function focus() {
  searchInput.value?.focus()
}

defineExpose({
  focus
})
</script>