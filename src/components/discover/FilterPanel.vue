<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-headline font-bold text-on-surface">筛选条件</h3>
      <button
        v-if="hasActiveFilters"
        class="text-xs font-bold text-primary hover:text-primary-dim transition-colors"
        @click="handleClearAll"
      >
        清空全部
      </button>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <div class="text-xs font-bold text-zinc-500">在线状态</div>
        <div class="flex gap-2 flex-wrap">
          <FilterChip
            label="全部"
            :active="filters.online === null"
            @click="setFilter('online', null)"
          />
          <FilterChip
            label="在线"
            :active="filters.online === true"
            @click="setFilter('online', true)"
          />
          <FilterChip
            label="离线"
            :active="filters.online === false"
            @click="setFilter('online', false)"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-bold text-zinc-500">价格区间</div>
        <div class="flex gap-2 flex-wrap">
          <FilterChip
            label="全部"
            :active="filters.priceRange === null"
            @click="setFilter('priceRange', null)"
          />
          <FilterChip
            label="0-30元"
            :active="filters.priceRange === '0-30'"
            @click="setFilter('priceRange', '0-30')"
          />
          <FilterChip
            label="30-60元"
            :active="filters.priceRange === '30-60'"
            @click="setFilter('priceRange', '30-60')"
          />
          <FilterChip
            label="60-100元"
            :active="filters.priceRange === '60-100'"
            @click="setFilter('priceRange', '60-100')"
          />
          <FilterChip
            label="100元以上"
            :active="filters.priceRange === '100+'"
            @click="setFilter('priceRange', '100+')"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-bold text-zinc-500">段位</div>
        <div class="flex gap-2 flex-wrap">
          <FilterChip
            label="全部"
            :active="filters.rank === null"
            @click="setFilter('rank', null)"
          />
          <FilterChip
            label="青铜"
            :active="filters.rank === 'bronze'"
            @click="setFilter('rank', 'bronze')"
          />
          <FilterChip
            label="白银"
            :active="filters.rank === 'silver'"
            @click="setFilter('rank', 'silver')"
          />
          <FilterChip
            label="黄金"
            :active="filters.rank === 'gold'"
            @click="setFilter('rank', 'gold')"
          />
          <FilterChip
            label="铂金"
            :active="filters.rank === 'platinum'"
            @click="setFilter('rank', 'platinum')"
          />
          <FilterChip
            label="钻石"
            :active="filters.rank === 'diamond'"
            @click="setFilter('rank', 'diamond')"
          />
          <FilterChip
            label="大师"
            :active="filters.rank === 'master'"
            @click="setFilter('rank', 'master')"
          />
          <FilterChip
            label="王者"
            :active="filters.rank === 'challenger'"
            @click="setFilter('rank', 'challenger')"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-bold text-zinc-500">性别</div>
        <div class="flex gap-2 flex-wrap">
          <FilterChip
            label="全部"
            :active="filters.gender === null"
            @click="setFilter('gender', null)"
          />
          <FilterChip
            label="男"
            :active="filters.gender === 'male'"
            @click="setFilter('gender', 'male')"
          />
          <FilterChip
            label="女"
            :active="filters.gender === 'female'"
            @click="setFilter('gender', 'female')"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="text-xs font-bold text-zinc-500">游戏</div>
        <div class="flex gap-2 flex-wrap">
          <FilterChip
            label="全部"
            :active="filters.game === null"
            @click="setFilter('game', null)"
          />
          <FilterChip
            label="王者荣耀"
            :active="filters.game === 'honor_of_kings'"
            @click="setFilter('game', 'honor_of_kings')"
          />
          <FilterChip
            label="LOL"
            :active="filters.game === 'lol'"
            @click="setFilter('game', 'lol')"
          />
          <FilterChip
            label="Valorant"
            :active="filters.game === 'valorant'"
            @click="setFilter('game', 'valorant')"
          />
          <FilterChip
            label="原神"
            :active="filters.game === 'genshin'"
            @click="setFilter('game', 'genshin')"
          />
          <FilterChip
            label="绝地求生"
            :active="filters.game === 'pubg'"
            @click="setFilter('game', 'pubg')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFilterStore } from '../../stores/filter.js'
import { useToast } from '../../composables/useToast.js'
import FilterChip from './FilterChip.vue'

const filterStore = useFilterStore()
const { success } = useToast()

const filters = computed(() => filterStore.filters)
const hasActiveFilters = computed(() => filterStore.hasActiveFilters)

function setFilter(key, value) {
  filterStore.setFilter(key, value)
}

function handleClearAll() {
  filterStore.clearAllFilters()
  success('已清空所有筛选条件')
}
</script>