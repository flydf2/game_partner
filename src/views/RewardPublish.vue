<template>
  <div class="reward-publish">
    <div class="container">
      <h1>发布悬赏</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>游戏段位</label>
          <select v-model="formData.rank" required>
            <option value="">请选择段位</option>
            <option value="bronze">青铜</option>
            <option value="silver">白银</option>
            <option value="gold">黄金</option>
            <option value="platinum">铂金</option>
            <option value="diamond">钻石</option>
            <option value="master">大师</option>
            <option value="grandmaster">宗师</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>开始时间</label>
          <input type="datetime-local" v-model="formData.startTime" required>
        </div>
        
        <div class="form-group">
          <label>时长（小时）</label>
          <input type="number" v-model.number="formData.duration" min="1" max="24" required>
        </div>
        
        <div class="form-group">
          <label>截止时间</label>
          <input type="datetime-local" v-model="formData.timeLeft" required>
        </div>
        
        <div class="form-group">
          <label>位置信息</label>
          <input type="text" v-model="formData.location" placeholder="请输入位置信息" required>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary">发布</button>
          <button type="button" class="btn-secondary" @click="goBack">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  rank: '',
  startTime: '',
  duration: 1,
  timeLeft: '',
  location: ''
})

const handleSubmit = () => {
  console.log('发布悬赏:', formData.value)
  // 这里可以添加提交逻辑
  router.push('/reward')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.reward-publish {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus, select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>