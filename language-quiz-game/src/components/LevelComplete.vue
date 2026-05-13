<template>
  <div class="level-complete">
    <div class="uk-section uk-section-primary uk-light">
      <div class="uk-container uk-text-center">
        <h1 class="uk-heading-medium">🎉 关卡完成！</h1>
        <p class="uk-text-lead">{{ currentLevel?.name }}</p>
      </div>
    </div>

    <div class="uk-section">
      <div class="uk-container uk-container-small">
        <div class="uk-card uk-card-default uk-card-large">
          <div class="uk-card-body uk-text-center">
            <div class="uk-margin-large-bottom">
              <div class="score-display">+{{ score }}</div>
              <p class="uk-text-muted">本关得分</p>
            </div>

            <div class="uk-grid uk-grid-small uk-child-width-1-2 uk-margin-large" uk-grid>
              <div>
                <div class="uk-card uk-card-body uk-card-success">
                  <span class="uk-text-large" uk-icon="icon: check; ratio: 2"></span>
                  <div class="uk-text-large uk-text-bold uk-margin-small-top">{{ correctAnswers }}</div>
                  <div class="uk-text-small">正确</div>
                </div>
              </div>
              <div>
                <div class="uk-card uk-card-body uk-card-danger">
                  <span class="uk-text-large" uk-icon="icon: close; ratio: 2"></span>
                  <div class="uk-text-large uk-text-bold uk-margin-small-top">{{ wrongAnswers }}</div>
                  <div class="uk-text-small">错误</div>
                </div>
              </div>
            </div>

            <div class="uk-alert uk-alert-primary" uk-alert>
              <p class="uk-text-large">
                总积分：<span class="uk-text-bold">{{ totalScore }}</span>
              </p>
            </div>

            <div v-if="unlockedNewLevel" class="uk-alert uk-alert-success uk-margin-top" uk-alert>
              <p>🎊 恭喜！解锁了新关卡！</p>
            </div>
          </div>

          <div class="uk-card-footer">
            <div class="uk-grid uk-grid-small" uk-grid>
              <div class="uk-width-1-2@s">
                <button 
                  class="uk-button uk-button-default uk-width-1-1"
                  @click="returnToMenu"
                >
                  <span class="uk-margin-small-right" uk-icon="home"></span>
                  返回菜单
                </button>
              </div>
              <div class="uk-width-1-2@s">
                <button 
                  v-if="hasNextLevel"
                  class="uk-button uk-button-primary uk-width-1-1"
                  @click="nextLevel"
                >
                  下一关
                  <span class="uk-margin-small-left" uk-icon="arrow-right"></span>
                </button>
                <button 
                  v-else
                  class="uk-button uk-button-secondary uk-width-1-1"
                  @click="replayLevel"
                >
                  <span class="uk-margin-small-right" uk-icon="refresh"></span>
                  再玩一次
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
import { getNextLevelId, isLevelUnlocked } from '../logic/gameLogic.js';

export default {
  name: 'LevelComplete',
  props: {
    currentLevel: Object,
    score: Number,
    totalScore: Number,
    correctAnswers: Number,
    wrongAnswers: Number,
    previousTotalScore: Number
  },
  emits: ['return-menu', 'next-level', 'replay'],
  setup(props, { emit }) {
    const hasNextLevel = computed(() => !!getNextLevelId(props.currentLevel?.id));
    const nextLevelId = computed(() => getNextLevelId(props.currentLevel?.id));
    const unlockedNewLevel = computed(() => 
      nextLevelId.value && 
      isLevelUnlocked(nextLevelId.value, props.totalScore) && 
      !isLevelUnlocked(nextLevelId.value, props.previousTotalScore)
    );

    const returnToMenu = () => {
      emit('return-menu');
    };

    const nextLevel = () => {
      emit('next-level', nextLevelId.value);
    };

    const replayLevel = () => {
      emit('replay', props.currentLevel?.id);
    };

    return {
      hasNextLevel,
      unlockedNewLevel,
      returnToMenu,
      nextLevel,
      replayLevel
    };
  }
};
</script>

<style scoped>
.score-display {
  font-size: 4rem;
  font-weight: bold;
  color: #1e87f0;
}
</style>
