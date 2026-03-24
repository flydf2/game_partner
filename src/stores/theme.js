import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const theme = ref('light')

  const STORAGE_KEY = 'theme_preference'

  const initTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    isDark.value = newTheme === 'dark'
    
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }

  watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
  })

  return {
    isDark,
    theme,
    initTheme,
    setTheme,
    toggleTheme,
    resetTheme
  }
})