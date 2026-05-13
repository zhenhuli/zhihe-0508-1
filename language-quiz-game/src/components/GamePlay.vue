<template>
  <div class="game-play">
    <div class="uk-section uk-section-primary uk-light">
      <div class="uk-container">
        <div class="uk-flex uk-flex-between uk-flex-middle">
          <div>
            <h2 class="uk-margin-remove">{{ currentLevel?.name }}</h2>
            <p class="uk-text-meta uk-margin-remove-top">题目 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
          </div>
          <div class="uk-text-right">
            <div class="uk-text-large uk-text-bold">+{{ score }}</div>
            <div class="uk-text-small">本关得分</div>
          </div>
        </div>
        <div class="uk-margin-top">
          <progress 
            class="uk-progress uk-progress-success" 
            :value="progress" 
            max="100"
          ></progress>
        </div>
      </div>
    </div>

    <div class="uk-section">
      <div class="uk-container uk-container-small">
        <div class="uk-card uk-card-default uk-card-large">
          <div class="uk-card-body uk-text-center">
            <div class="uk-margin-large-bottom">
              <span class="uk-text-lead">这个单词的意思是？</span>
            </div>
            
            <div class="uk-margin-large-bottom">
              <span class="word-display">{{ currentQuestion?.word }}</span>
            </div>

            <div class="uk-grid uk-grid-small uk-child-width-1-2" uk-grid>
              <div v-for="(option, index) in currentQuestion?.options" :key="index">
                <button
                  class="uk-button uk-button-large uk-width-1-1 option-button"
                  :class="getOptionClass(index)"
                  :disabled="isAnswered"
                  @click="selectOption(index)"
                >
                  <span v-if="isAnswered && index === currentQuestion?.correct" class="uk-margin-small-right" uk-icon="check"></span>
                  <span v-if="isAnswered && selectedAnswer === index && !isCorrect" class="uk-margin-small-right" uk-icon="close"></span>
                  {{ option }}
                </button>
              </div>
            </div>

            <div v-if="isAnswered" class="uk-margin-large-top">
              <div :class="['uk-alert', isCorrect ? 'uk-alert-success' : 'uk-alert-danger']" uk-alert>
                <p class="uk-text-large">
                  {{ isCorrect ? '🎉 回答正确！' : '😢 回答错误！' }}
                  <span v-if="!isCorrect">正确答案是：{{ currentQuestion?.meaning }}</span>
                </p>
              </div>
            </div>
          </div>

          <div v-if="isAnswered" class="uk-card-footer uk-text-center">
            <button 
              class="uk-button uk-button-primary uk-button-large"
              @click="goNext"
            >
              {{ isLastQuestion ? '查看结果' : '下一题' }}
              <span class="uk-margin-small-left" uk-icon="arrow-right"></span>
            </button>
          </div>
        </div>

        <div class="uk-text-center uk-margin-top">
          <button 
            class="uk-button uk-button-text uk-text-muted"
            @click="exitGame"
          >
            <span class="uk-margin-small-right" uk-icon="arrow-left"></span>
            退出关卡
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { calculateLevelProgress } from '../logic/gameLogic.js';

export default {
  name: 'GamePlay',
  props: {
    currentLevel: Object,
    currentQuestionIndex: Number,
    score: Number,
    selectedAnswer: Number,
    isAnswered: Boolean,
    isCorrect: Boolean
  },
  emits: ['select-option', 'next-question', 'exit'],
  setup(props, { emit }) {
    const currentQuestion = computed(() => 
      props.currentLevel?.questions[props.currentQuestionIndex]
    );
    const totalQuestions = computed(() => 
      props.currentLevel?.questions.length || 0
    );
    const progress = computed(() => 
      calculateLevelProgress(props.currentQuestionIndex, totalQuestions.value)
    );
    const isLastQuestion = computed(() => 
      props.currentQuestionIndex >= totalQuestions.value - 1
    );

    const getOptionClass = (index) => {
      if (!props.isAnswered) {
        return 'uk-button-default';
      }
      if (index === props.currentLevel.questions[props.currentQuestionIndex].correct) {
        return 'uk-button-success';
      }
      if (props.selectedAnswer === index && !props.isCorrect) {
        return 'uk-button-danger';
      }
      return 'uk-button-default';
    };

    const selectOption = (index) => {
      if (!props.isAnswered) {
        emit('select-option', index);
      }
    };

    const goNext = () => {
      emit('next-question');
    };

    const exitGame = () => {
      emit('exit');
    };

    return {
      currentQuestion,
      totalQuestions,
      progress,
      isLastQuestion,
      getOptionClass,
      selectOption,
      goNext,
      exitGame
    };
  }
};
</script>

<style scoped>
.word-display {
  font-size: 3.5rem;
  font-weight: bold;
  color: #1e87f0;
  letter-spacing: 2px;
}

.option-button {
  margin-bottom: 15px;
  font-size: 1.1rem;
}
</style>
