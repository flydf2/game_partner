<template>
  <div class="community-feed">
    <div class="page-header">
      <div class="back-button" @click="goBack">
        <img src="@/assets/icons/back.svg" alt="返回" />
      </div>
      <h1>{{ $route.meta.title }}</h1>
      <div class="header-right"></div>
    </div>
    
    <div class="community-content">
      <div class="section">
        <h2>社区动态</h2>
        <div class="feed-list">
          <!-- 动态列表将在这里渲染 -->
          <div class="feed-item" v-for="item in feedItems" :key="item.id">
            <div class="feed-header">
              <img :src="item.avatar" alt="用户头像" class="user-avatar" />
              <div class="user-info">
                <div class="username">{{ item.username }}</div>
                <div class="post-time">{{ item.time }}</div>
              </div>
            </div>
            <div class="feed-content">
              <p>{{ item.content }}</p>
              <img v-if="item.image" :src="item.image" alt="动态图片" class="feed-image" />
            </div>
            <div class="feed-actions">
              <div class="action-item">
                <img src="@/assets/icons/like.svg" alt="点赞" />
                <span>{{ item.likes }}</span>
              </div>
              <div class="action-item">
                <img src="@/assets/icons/comment.svg" alt="评论" />
                <span>{{ item.comments }}</span>
              </div>
              <div class="action-item">
                <img src="@/assets/icons/share.svg" alt="分享" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <BottomNavBar />
  </div>
</template>

<script>
import BottomNavBar from '../components/BottomNavBar.vue'

export default {
  name: 'CommunityFeed',
  components: {
    BottomNavBar
  },
  data() {
    return {
      feedItems: [
        {
          id: 1,
          avatar: 'https://via.placeholder.com/48',
          username: '游戏达人',
          time: '2小时前',
          content: '今天和队友一起排位，终于上了钻石！感谢队友的配合，接下来目标大师！',
          image: 'https://via.placeholder.com/600x400',
          likes: 128,
          comments: 32
        },
        {
          id: 2,
          avatar: 'https://via.placeholder.com/48',
          username: '电竞少女',
          time: '4小时前',
          content: '分享一下我的游戏 setup，键盘是 Cherry MX Red，鼠标是罗技 G502，显示器是 144Hz 的，打游戏超爽！',
          image: 'https://via.placeholder.com/600x400',
          likes: 96,
          comments: 24
        },
        {
          id: 3,
          avatar: 'https://via.placeholder.com/48',
          username: '游戏策划',
          time: '6小时前',
          content: '新版本更新啦！新增了两个英雄，平衡性调整，还有全新的排位机制，大家赶紧去体验吧！',
          likes: 256,
          comments: 64
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.community-feed {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 44px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.back-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 24px;
  height: 24px;
}

.page-header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-right {
  width: 44px;
}

.community-content {
  padding: 16px;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.feed-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.feed-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.feed-content {
  margin-bottom: 12px;
}

.feed-content p {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin: 0 0 12px 0;
}

.feed-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.feed-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.action-item img {
  width: 16px;
  height: 16px;
}
</style>