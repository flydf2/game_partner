<template>
  <div
    class="col-span-2 bg-surface-container-lowest rounded-[2rem] p-5 shadow-sm flex items-center gap-5 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
    @click="handleClick"
  >
    <div class="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0 relative">
      <img
        :src="playmate.avatar"
        :alt="playmate.nickname"
        class="w-full h-full object-cover"
      />
      <div
        v-if="playmate.isOnline"
        class="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"
      />
    </div>

    <div class="flex-grow space-y-2">
      <div class="flex justify-between items-start">
        <div class="flex flex-col">
          <span class="font-bold text-lg">{{ playmate.nickname }}</span>
          <span class="text-[10px] text-zinc-500 font-medium">{{ playmate.description }}</span>
        </div>
        <span class="text-primary text-lg font-black">¥{{ playmate.price }}/hr</span>
      </div>

      <div class="flex gap-2">
        <span
          v-for="(tag, index) in playmate.tags"
          :key="`tag-${index}`"
          class="px-3 py-1 bg-surface-container-low text-on-surface text-[10px] font-bold rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-125 transition-transform" />
  </div>
</template>

<script setup>
const props = defineProps({
  playmate: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      nickname: '',
      avatar: '',
      price: 0,
      tags: [],
      description: '',
      isOnline: false
    })
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.playmate.id)
}
</script>