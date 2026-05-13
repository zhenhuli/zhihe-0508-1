<template>
  <div class="game-menu">
    <div class="uk-section uk-section-primary uk-light">
      <div class="uk-container uk-text-center">
        <h1 class="uk-heading-medium uk-margin-remove">多语言单词闯关</h1>
        <p class="uk-text-lead uk-margin-small-top">挑战单词关卡，积累积分！</p>
      </div>
    </div>

    <div class="uk-section">
      <div class="uk-container">
        <div class="uk-card uk-card-default uk-card-body uk-margin-bottom">
          <div class="uk-grid uk-grid-small uk-child-width-1-3 uk-text-center" uk-grid>
            <div>
              <div class="uk-text-large uk-text-bold uk-text-primary">{{ totalScore }}</div>
              <div class="uk-text-meta">总积分</div>
            </div>
            <div>
              <div class="uk-text-large uk-text-bold uk-text-success">{{ unlockedCount }}</div>
              <div class="uk-text-meta">已解锁关卡</div>
            </div>
            <div>
              <div class="uk-text-large uk-text-bold uk-text-warning">{{ totalLevels }}</div>
              <div class="uk-text-meta">总关卡</div>
            </div>
          </div>
        </div>

        <h3 class="uk-heading-bullet">选择关卡</h3>
        <div class="uk-grid uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
          <div v-for="level in levels" :key="level.id">
            <div 
              class="uk-card uk-card-default uk-card-hover"
              :class="{ 'uk-disabled': !isLevelUnlocked(level.id) }"
            >
              <div class="uk-card-header">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                  <div class="uk-width-auto">
                    <span 
                      class="uk-icon-button"
                      :class="getLevelIconClass(level.id)"
                      uk-icon="icon: bolt; ratio: 1.5"
                    ></span>
                  </div>
                  <div class="uk-width-expand">
                    <h3 class="uk-card-title uk-margin-remove-bottom">
                      关卡 {{ level.id }}
                    </h3>
                    <p class="uk-text-meta uk-margin-remove-top">
                      {{ getDifficultyText(level.difficulty) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="uk-card-body">
                <h4 class="uk-margin-remove">{{ level.name }}</h4>
                <p class="uk-text-small uk-text-muted uk-margin-small">
                  {{ level.questions.length }} 道题目
                </p>
                <div v-if="!isLevelUnlocked(level.id)" class="uk-text-warning">
                  <span uk-icon="icon: lock"></span>
                  需要 {{ (level.id - 1) * 50 }} 积分解锁
                </div>
              </div>
              <div class="uk-card-footer">
                <button 
                  class="uk-button uk-width-1-1"
                  :class="isLevelUnlocked(level.id) ? 'uk-button-primary' : 'uk-button-default'"
                  :disabled="!isLevelUnlocked(level.id)"
                  @click="selectLevel(level.id)"
                >
                  {{ isLevelUnlocked(level.id) ? '开始挑战' : '未解锁' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { levels, isLevelUnlocked } from '../logic/gameLogic.js';

export default {
  name: 'GameMenu',
  props: {
    totalScore: {
      type: Number,
      default: 0
    }
  },
  emits: ['start-level'],
  setup(props, { emit }) {
    const unlockedCount = computed(() => 
      levels.filter(level => isLevelUnlocked(level.id, props.totalScore)).length
    );
    const totalLevels = levels.length;

    const getLevelIconClass = (levelId) => {
      if (!isLevelUnlocked(levelId, props.totalScore)) {
        return 'uk-button-secondary';
      }
      return 'uk-button-primary';
    };

    const getDifficultyText = (difficulty) => {
      const texts = ['', '简单', '中等', '困难', '专家'];
      return texts[difficulty] || '未知';
    };

    const selectLevel = (levelId) => {
      if (isLevelUnlocked(levelId, props.totalScore)) {
        emit('start-level', levelId);
      }
    };

    return {
      levels,
      unlockedCount,
      totalLevels,
      isLevelUnlocked: (id) => isLevelUnlocked(id, props.totalScore),
      getLevelIconClass,
      getDifficultyText,
      selectLevel
    };
  }
};
</script>

<style scoped>
.game-menu {
  min-height: 100vh;
}

.uk-disabled {
  opacity: 0.6;
}
</style>
