<template>
  <div class="min-h-screen bg-background text-on-background font-body pb-24">
    <!-- TopAppBar -->
    <nav class="bg-surface w-full top-0 sticky z-50">
      <div class="flex items-center justify-between px-5 h-16 w-full max-w-md mx-auto">
        <div class="flex items-center gap-3">
          <button @click="handleBack" class="text-primary active:scale-95 duration-200">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="font-headline font-bold text-lg text-primary">我的技能</h1>
        </div>
        <button @click="handleAddSkill" class="text-primary text-sm font-semibold active:scale-95 duration-200">
          添加技能
        </button>
      </div>
      <div class="bg-neutral-200/50 h-[1px] w-full"></div>
    </nav>

    <main class="max-w-2xl mx-auto space-y-4">
      <!-- 技能分类 -->
      <section class="bg-surface-container-lowest rounded-3xl p-5">
        <h2 class="text-sm font-bold text-on-surface mb-4">技能分类</h2>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category.id"
            class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            :class="activeCategory === category.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
      </section>

      <!-- 技能列表 -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold text-on-surface px-1">已添加技能</h2>
        
        <div v-if="loading" class="bg-surface-container-lowest rounded-3xl p-8 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-on-surface-variant">加载中...</p>
          </div>
        </div>

        <div v-else-if="error" class="bg-surface-container-lowest rounded-3xl p-6">
          <div class="flex flex-col items-center gap-3">
            <span class="material-symbols-outlined text-error text-3xl">error_outline</span>
            <p class="text-sm text-error">{{ error }}</p>
            <button 
              class="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
              @click="loadSkills"
            >
              重试
            </button>
          </div>
        </div>

        <div v-else-if="skills.length === 0" class="bg-surface-container-lowest rounded-3xl p-8 text-center">
          <div class="w-20 h-20 mx-auto bg-surface-container flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-outline text-4xl">sports_esports</span>
          </div>
          <p class="text-sm text-on-surface-variant">暂无技能</p>
          <button 
            class="mt-4 px-6 py-3 bg-primary text-on-primary rounded-full text-sm font-bold active:scale-95 transition-all"
            @click="handleAddSkill"
          >
            添加第一个技能
          </button>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="skill in filteredSkills"
            :key="skill.id"
            class="bg-surface-container-lowest rounded-3xl p-5 transition-all duration-300 hover:shadow-md"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-sm mb-1">{{ skill.game }}</h3>
                <p class="text-xs text-on-surface-variant mb-2">{{ skill.skill }}</p>
                <div class="flex items-center gap-2">
                  <span :class="getSkillLevelClass(skill.level)" class="text-xs font-bold px-2 py-0.5 rounded-full">
                    {{ skill.levelText }}
                  </span>
                  <span class="text-xs text-on-surface-variant">认证状态: {{ skill.certificationStatus }}</span>
                </div>
              </div>
              <button @click="handleEditSkill(skill.id)" class="text-primary active:scale-95 duration-200">
                <span class="material-symbols-outlined">edit</span>
              </button>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <div class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">服务次数</span>
                <span class="text-xs font-bold">{{ skill.serviceCount }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-xs text-on-surface-variant">评分</span>
                <span class="text-xs font-bold">{{ skill.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 添加技能对话框 -->
    <div v-if="showAddSkillDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
      <div class="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm animate-in fade-in-90 slide-in-from-bottom-5">
        <h3 class="text-lg font-bold text-on-surface font-headline mb-4">添加技能</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">游戏</label>
            <select 
              v-model="newSkill.game"
              class="w-full px-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">选择游戏</option>
              <option value="LOL">英雄联盟</option>
              <option value="CS:GO">反恐精英:全球攻势</option>
              <option value="DOTA2">刀塔2</option>
              <option value="PUBG">绝地求生</option>
              <option value="VALORANT">无畏契约</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">技能</label>
            <input 
              v-model="newSkill.skill"
              type="text"
              class="w-full px-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="例如：钻石段位、大师陪玩"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-on-surface mb-2">技能等级</label>
            <select 
              v-model="newSkill.level"
              class="w-full px-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">选择等级</option>
              <option value="beginner">新手</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
              <option value="expert">专家</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button 
            class="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-bold text-sm transition-all active:scale-95 hover:bg-surface-container-low"
            @click="showAddSkillDialog = false"
          >
            取消
          </button>
          <button 
            class="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold text-sm transition-all active:scale-95 hover:bg-primary-dim"
            @click="handleSubmitSkill"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref('all')
const loading = ref(false)
const error = ref('')
const showAddSkillDialog = ref(false)

const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'LOL', name: '英雄联盟' },
  { id: 'CS:GO', name: 'CS:GO' },
  { id: 'DOTA2', name: 'DOTA2' },
  { id: 'PUBG', name: '绝地求生' },
  { id: 'VALORANT', name: '无畏契约' }
])

const skills = ref([])
const newSkill = ref({
  game: '',
  skill: '',
  level: ''
})

const filteredSkills = computed(() => {
  if (activeCategory.value === 'all') {
    return skills.value
  }
  return skills.value.filter(skill => skill.game === activeCategory.value)
})

const getSkillLevelClass = (level) => {
  switch (level) {
    case 'beginner':
      return 'bg-blue-100 text-blue-600'
    case 'intermediate':
      return 'bg-green-100 text-green-600'
    case 'advanced':
      return 'bg-purple-100 text-purple-600'
    case 'expert':
      return 'bg-orange-100 text-orange-600'
    default:
      return 'bg-surface-container text-on-surface-variant'
  }
}

const loadSkills = async () => {
  loading.value = true
  error.value = ''
  try {
    // 模拟数据
    skills.value = [
      {
        id: 1,
        game: 'LOL',
        skill: '钻石段位',
        level: 'advanced',
        levelText: '高级',
        certificationStatus: '已认证',
        serviceCount: 45,
        rating: 4.8
      },
      {
        id: 2,
        game: 'CS:GO',
        skill: '大师陪玩',
        level: 'expert',
        levelText: '专家',
        certificationStatus: '已认证',
        serviceCount: 32,
        rating: 4.9
      },
      {
        id: 3,
        game: 'PUBG',
        skill: '吃鸡大神',
        level: 'intermediate',
        levelText: '中级',
        certificationStatus: '待认证',
        serviceCount: 15,
        rating: 4.5
      }
    ]
  } catch (err) {
    error.value = '获取技能列表失败'
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.back()
}

const handleAddSkill = () => {
  showAddSkillDialog.value = true
}

const handleEditSkill = (skillId) => {
  console.log('编辑技能:', skillId)
  // 这里可以打开编辑对话框
}

const handleSubmitSkill = async () => {
  if (!newSkill.value.game || !newSkill.value.skill || !newSkill.value.level) {
    alert('请填写完整技能信息')
    return
  }
  
  try {
    // 模拟添加技能
    const skillLevelMap = {
      beginner: '新手',
      intermediate: '中级',
      advanced: '高级',
      expert: '专家'
    }
    
    skills.value.push({
      id: skills.value.length + 1,
      game: newSkill.value.game,
      skill: newSkill.value.skill,
      level: newSkill.value.level,
      levelText: skillLevelMap[newSkill.value.level],
      certificationStatus: '待认证',
      serviceCount: 0,
      rating: 0
    })
    
    showAddSkillDialog.value = false
    newSkill.value = {
      game: '',
      skill: '',
      level: ''
    }
  } catch (err) {
    error.value = '添加技能失败'
  }
}

onMounted(() => {
  loadSkills()
})
</script>

<style scoped>
/* 页面滚动动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeIn 0.5s ease-out forwards;
}

section:nth-child(1) { animation-delay: 0.1s; }
section:nth-child(2) { animation-delay: 0.2s; }

/* 触摸反馈优化 */
button, a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>