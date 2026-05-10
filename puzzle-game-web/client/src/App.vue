<template>
  <div class="app">
    <div class="app-container">
      <header class="header">
        <div class="header-left">
          <span class="logo">🧩</span>
          <span class="title">拼图小游戏</span>
        </div>
        <button class="leaderboard-btn" @click="showLeaderboard = true">
          <span>🏆</span>
          <span>排行榜</span>
        </button>
      </header>
      <main class="main">
        <router-view />
      </main>
    </div>
    <LeaderboardModal
      :visible="showLeaderboard"
      @close="showLeaderboard = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LeaderboardModal from './components/LeaderboardModal.vue'

const showLeaderboard = ref(false)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 480px;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  font-size: 24px;
}

.title {
  font-size: 17px;
  font-weight: 600;
}

.leaderboard-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.leaderboard-btn:hover {
  background: rgba(255,255,255,0.3);
}

.leaderboard-btn span:first-child {
  font-size: 14px;
}

.main {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}
</style>
