<template>
  <component
    :is="headerComponent"
    v-bind="headerProps"
    @menu="handleMenu"
    @notifications="handleNotifications"
    @search="handleSearch"
    @profile="handleProfile"
    @back="handleBack"
    @share="handleShare"
    @more="handleMore"
    @help="handleHelp"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ListPageHeader from './ListPageHeader.vue'
import DetailPageHeader from './DetailPageHeader.vue'

const route = useRoute()

const headerType = computed(() => route.meta.headerType || 'list')

const headerComponent = computed(() => {
  return headerType.value === 'list' ? ListPageHeader : DetailPageHeader
})

const headerProps = computed(() => {
  if (headerType.value === 'list') {
    const isHome = route.path === '/'
    const isDiscover = route.path === '/discover'
    
    if (isDiscover) {
      return {
        title: '发现大神',
        showMenu: true,
        showNotifications: true,
        showSearch: true,
        showAvatar: true,
        unreadCount: 0,
        avatarUrl: ''
      }
    }
    
    return {
      title: route.meta.title || '阳光陪玩',
      showMenu: true,
      showNotifications: true,
      showSearch: true,
      showAvatar: true,
      unreadCount: 0,
      avatarUrl: ''
    }
  } else {
    return {
      title: route.meta.title || '',
      showBack: true,
      showShare: false,
      showMore: false,
      showHelp: false
    }
  }
})

const emit = defineEmits(['menu', 'notifications', 'search', 'profile', 'back', 'share', 'more', 'help'])

const handleMenu = () => emit('menu')
const handleNotifications = () => emit('notifications')
const handleSearch = () => emit('search')
const handleProfile = () => emit('profile')
const handleBack = () => emit('back')
const handleShare = () => emit('share')
const handleMore = () => emit('more')
const handleHelp = () => emit('help')
</script>

<style scoped>
</style>
