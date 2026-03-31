<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import { appealApi, handleApiError } from '../api/index.js'
import { useModal } from '../composables/useModal.js'

const router = useRouter()
const route = useRoute()
const { error: showError, info: showInfo } = useModal()

const appealId = computed(() => route.params.id)

const appeal = ref(null)
const loading = ref(false)
const error = ref(null)

const statusTextMap = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已处理',
  rejected: '已拒绝'
}

const statusClassMap = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

const priorityTextMap = {
  high: '紧急',
  normal: '普通',
  low: '低'
}

const priorityClassMap = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const typeTextMap = {
  order: '订单问题',
  payment: '支付问题',
  service: '服务问题',
  other: '其他问题'
}

const typeIconMap = {
  order: 'receipt_long',
  payment: 'payments',
  service: 'support_agent',
  other: 'help'
}

const getStatusText = (status) => statusTextMap[status] || status
const getStatusClass = (status) => statusClassMap[status] || ''
const getPriorityText = (priority) => priorityTextMap[priority] || priority
const getPriorityClass = (priority) => priorityClassMap[priority] || ''
const getTypeText = (type) => typeTextMap[type] || type
const getTypeIcon = (type) => typeIconMap[type] || 'help'

const formatDateTime = (time) => {
  if (!time || time === '0001-01-01T00:00:00Z') return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const parseImages = (imagesStr) => {
  if (!imagesStr) return []
  return imagesStr.split(',').filter(img => img.trim())
}

const loadAppealDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await appealApi.getAppealDetail(appealId.value)
    if (response.code === 0 || response.success) {
      const data = response.data
      appeal.value = {
        ...data,
        statusText: getStatusText(data.status),
        statusClass: getStatusClass(data.status),
        priorityText: getPriorityText(data.priority),
        priorityClass: getPriorityClass(data.priority),
        typeText: getTypeText(data.type),
        typeIcon: getTypeIcon(data.type),
        images: parseImages(data.images),
        formattedCreatedAt: formatDateTime(data.createdAt),
        formattedUpdatedAt: formatDateTime(data.updatedAt),
        formattedHandledAt: formatDateTime(data.handledAt)
      }
    } else {
      throw new Error(response.message || response.msg || '获取申诉详情失败')
    }
  } catch (err) {
    error.value = err.message || '获取申诉详情失败'
    console.error('获取申诉详情失败:', err)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleMenu = () => {
  router.push('/profile')
}

const handleNotifications = () => {
  router.push('/notifications')
}

const handleSearch = () => {
  router.push('/search')
}

const handleProfile = () => {
  router.push('/profile')
}

const handleContact = () => {
  if (appeal.value?.contactInfo) {
    showInfo(`联系电话: ${appeal.value.contactInfo}`)
  }
}

const handleImagePreview = (images, index) => {
  showInfo(`图片预览: ${index + 1} / ${images.length}`)
}

onMounted(() => {
  loadAppealDetail()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface pb-32">
    <AppHeader
      title="申诉详情"
      is-primary-page
      @back="handleBack"
      @menu="handleMenu"
      @notifications="handleNotifications"
      @search="handleSearch"
      @profile="handleProfile"
    />

    <main class="page-content pt-24 pb-32 px-5 space-y-6">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <span class="material-symbols-outlined text-4xl text-outline mb-4">error_outline</span>
        <p class="text-sm text-on-surface-variant mb-4">{{ error }}</p>
        <button
          @click="loadAppealDetail"
          class="px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
        >
          重试
        </button>
      </div>

      <template v-else-if="appeal">
        <div class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl bg-primary-container/50 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">
                {{ appeal.typeIcon }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h2 class="text-lg font-bold text-on-surface mb-1">{{ appeal.title }}</h2>
                  <div class="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>{{ appeal.typeText }}</span>
                    <span>•</span>
                    <span>订单 #{{ appeal.orderId }}</span>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span :class="['px-3 py-1 rounded-full text-xs font-bold', appeal.statusClass]">
                    {{ appeal.statusText }}
                  </span>
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', appeal.priorityClass]">
                    {{ appeal.priorityText }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="bg-surface-container-high/50 rounded-xl p-4">
              <div class="text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">edit_note</span>
                申诉内容
              </div>
              <p class="text-sm text-on-surface leading-relaxed">{{ appeal.content }}</p>
            </div>

            <div v-if="appeal.images.length > 0">
              <div class="text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">image</span>
                附件图片 ({{ appeal.images.length }})
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(img, imgIndex) in appeal.images"
                  :key="imgIndex"
                  @click="handleImagePreview(appeal.images, imgIndex)"
                  class="aspect-square rounded-xl overflow-hidden bg-surface-container-high cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    :src="img.trim()"
                    :alt="`附件 ${imgIndex + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div class="border-t border-outline/10 pt-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div class="text-xs text-on-surface-variant mb-1">提交时间</div>
                  <div class="text-on-surface">{{ appeal.formattedCreatedAt }}</div>
                </div>
                <div>
                  <div class="text-xs text-on-surface-variant mb-1">更新时间</div>
                  <div class="text-on-surface">{{ appeal.formattedUpdatedAt }}</div>
                </div>
                <div v-if="appeal.contactInfo">
                  <div class="text-xs text-on-surface-variant mb-1">联系方式</div>
                  <div class="text-on-surface flex items-center gap-1">
                    {{ appeal.contactInfo }}
                    <button @click="handleContact" class="text-primary">
                      <span class="material-symbols-outlined text-base">phone</span>
                    </button>
                  </div>
                </div>
                <div v-if="appeal.handledAt && appeal.handledAt !== '-'">
                  <div class="text-xs text-on-surface-variant mb-1">处理时间</div>
                  <div class="text-on-surface">{{ appeal.formattedHandledAt }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="appeal.response" class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-success" style="font-variation-settings: 'FILL' 1;">
              check_circle
            </span>
            <h3 class="font-bold text-on-surface">处理回复</h3>
          </div>
          <div class="bg-surface-container-high/50 rounded-xl p-4">
            <p class="text-sm text-on-surface leading-relaxed">{{ appeal.response }}</p>
          </div>
          <div v-if="appeal.handledBy" class="mt-4 text-xs text-on-surface-variant">
            处理人: {{ appeal.handledBy }}
          </div>
        </div>

        <div v-else class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-amber-500" style="font-variation-settings: 'FILL' 1;">
              pending
            </span>
            <h3 class="font-bold text-on-surface">处理中</h3>
          </div>
          <p class="text-sm text-on-surface-variant">
            您的申诉正在处理中，请耐心等待。客服人员会尽快为您处理。
          </p>
        </div>

        <div class="bg-surface-container-lowest rounded-3xl p-5 shadow-sm">
          <h3 class="font-bold text-on-surface mb-4">常见问题</h3>
          <div class="space-y-3">
            <div class="bg-surface-container-high/50 rounded-xl p-4 cursor-pointer hover:bg-surface-container-high transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-sm text-on-surface">申诉处理需要多长时间？</span>
                <span class="material-symbols-outlined text-on-surface-variant text-xl">expand_more</span>
              </div>
            </div>
            <div class="bg-surface-container-high/50 rounded-xl p-4 cursor-pointer hover:bg-surface-container-high transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-sm text-on-surface">如何联系客服？</span>
                <span class="material-symbols-outlined text-on-surface-variant text-xl">expand_more</span>
              </div>
            </div>
            <div class="bg-surface-container-high/50 rounded-xl p-4 cursor-pointer hover:bg-surface-container-high transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-sm text-on-surface">申诉被驳回怎么办？</span>
                <span class="material-symbols-outlined text-on-surface-variant text-xl">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
