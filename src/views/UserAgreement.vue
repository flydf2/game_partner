<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  router.back()
}

const handleAgree = () => {
  // 处理用户同意协议的逻辑
  console.log('用户同意协议')
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface pb-32">
    <header class="w-full top-0 sticky z-50 bg-surface">
      <div class="flex items-center justify-between px-5 h-16 w-full max-w-md mx-auto">
        <div class="flex items-center gap-4">
          <button @click="handleBack" class="active:scale-95 duration-200 text-primary">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="font-headline font-bold text-lg text-primary">用户服务协议</h1>
        </div>
        <div class="w-10"></div>
      </div>
      <div class="bg-neutral-200/50 h-[1px] w-full"></div>
    </header>

    <main class="max-w-2xl mx-auto px-5 pt-24 pb-32 space-y-6">
      <div class="mb-10">
        <span class="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label text-[10px] font-semibold mb-4">版本更新：2023年10月24日</span>
        <h2 class="font-headline text-3xl font-extrabold tracking-tight text-on-background leading-tight">
          欢迎来到 SunnyPlay <br/>
          <span class="text-primary">服务与隐私政策</span>
        </h2>
        <p class="mt-4 text-on-surface-variant text-sm">请在开始您的游戏陪伴之旅前，仔细阅读以下条款。我们致力于为您提供一个安全、充满活力的社交空间。</p>
      </div>

      <section class="legal-content">
        <div class="relative pl-6 mb-12">
          <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-container rounded-full"></div>
          <h2 class="font-headline text-xl font-bold text-on-background">
            <span class="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-[12px] text-on-primary-container">01</span>
            服务内容
          </h2>
          <p class="text-sm">SunnyPlay Gaming 是一个连接玩家与专业游戏陪练者的社交平台。我们提供包括但不限于游戏技巧指导、组队陪玩、语音互动及相关社交增值服务。</p>
          <p class="text-sm">作为平台方，我们努力确保服务的持续性与稳定性，但可能因系统维护、不可抗力或第三方服务故障导致暂时中断。</p>
        </div>

        <div class="relative pl-6 mb-12">
          <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-surface-container-highest rounded-full"></div>
          <h2 class="font-headline text-xl font-bold text-on-background">
            <span class="w-6 h-6 rounded-lg bg-surface-container-high flex items-center justify-center text-[12px] text-on-surface">02</span>
            用户行为规范
          </h2>
          <div class="space-y-4">
            <div class="p-4 bg-surface-container-lowest rounded-xl">
              <h3 class="font-bold text-sm mb-2 text-on-surface">实名认证</h3>
              <p class="text-xs text-on-surface-variant m-0">所有用户须提供真实、准确的身份信息进行注册。严禁通过虚假信息欺骗平台或其他用户。</p>
            </div>
            <div class="p-4 bg-surface-container-lowest rounded-xl">
              <h3 class="font-bold text-sm mb-2 text-on-surface">互动准则</h3>
              <p class="text-xs text-on-surface-variant m-0">严禁在平台内发布任何色情、暴力、诈骗或违反法律法规的言论。我们提倡文明交流，尊重每一位陪玩师与用户。</p>
            </div>
            <div class="p-4 bg-surface-container-lowest rounded-xl">
              <h3 class="font-bold text-sm mb-2 text-on-surface">交易安全</h3>
              <p class="text-xs text-on-surface-variant m-0">所有交易须通过 SunnyPlay 平台系统完成。私下交易可能面临欺诈风险，且不受平台保护。</p>
            </div>
          </div>
        </div>

        <div class="relative pl-6 mb-12">
          <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-tertiary-container rounded-full"></div>
          <h2 class="font-headline text-xl font-bold text-on-background">
            <span class="w-6 h-6 rounded-lg bg-tertiary-container flex items-center justify-center text-[12px] text-on-tertiary-container">03</span>
            隐私保护
          </h2>
          <p class="text-sm">我们高度重视您的隐私。您的联系方式、地理位置及交易记录仅用于优化服务体验及安全核查，绝不向任何未经授权的第三方披露。</p>
          <p class="text-sm italic text-xs">详细信息请参阅《SunnyPlay 隐私权保护政策》。</p>
        </div>

        <div class="relative pl-6 mb-12">
          <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-error-container/30 rounded-full"></div>
          <h2 class="font-headline text-xl font-bold text-on-background">
            <span class="w-6 h-6 rounded-lg bg-error-container flex items-center justify-center text-[12px] text-on-error">04</span>
            免责声明
          </h2>
          <p class="text-sm">用户因违反平台规定进行的站外交易、私下约见等行为产生的纠纷与法律责任，由用户本人承担，SunnyPlay 不承担任何赔偿责任。</p>
          <p class="text-sm">因互联网环境导致的黑客攻击、病毒入侵或政府限制，造成的服务中断或个人信息泄露，本平台在已采取法定安保措施的前提下免责。</p>
        </div>
      </section>

      <div class="mt-16 pt-8 border-t border-outline-variant/10 text-center">
        <p class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">© 2023 SunnyPlay Gaming Interactive</p>
        <p class="text-[10px] text-on-surface-variant mt-2 italic">阳光、竞技、社交，尽在 SunnyPlay</p>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 w-full px-6 py-6 flex flex-col gap-3 items-center bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-[0_-8px_30px_rgb(0,0,0,0.06)] max-w-md mx-auto">
      <button @click="handleAgree" class="w-full h-14 bg-primary-container text-on-primary-container font-headline font-bold rounded-full active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20">
        我已经阅读并同意
      </button>
      <p class="text-[10px] text-on-surface-variant">点击上方按钮即表示您接受上述所有条款</p>
    </div>
  </div>
</template>

<style scoped>
.legal-content p {
  margin-bottom: 1rem;
  line-height: 1.7;
  color: #5a5c5c;
}

.legal-content h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>