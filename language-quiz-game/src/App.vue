<template>
  <div id="app">
    <GameMenu 
      v-if="gameState.currentState === GAME_STATES.MENU"
      :total-score="gameState.totalScore"
      @start-level="handleStartLevel"
    />
    <GamePlay 
      v-else-if="gameState.currentState === GAME_STATES.PLAYING"
      :current-level="gameState.currentLevel"
      :current-question-index="gameState.currentQuestionIndex"
      :score="gameState.score"
      :selected-answer="gameState.selectedAnswer"
      :is-answered="gameState.isAnswered"
      :is-correct="gameState.isCorrect"
      @select-option="handleSelectOption"
      @next-question="handleNextQuestion"
      @exit="handleExit"
    />
    <LevelComplete 
      v-else-if="gameState.currentState === GAME_STATES.LEVEL_COMPLETE"
      :current-level="gameState.currentLevel"
      :score="gameState.score"
      :total-score="gameState.totalScore"
      :correct-answers="gameState.correctAnswers"
      :wrong-answers="gameState.wrongAnswers"
      :previous-total-score="previousTotalScore"
      @return-menu="handleReturnMenu"
      @next-level="handleStartLevel"
      @replay="handleStartLevel"
    />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';
import GameMenu from './components/GameMenu.vue';
import GamePlay from './components/GamePlay.vue';
import LevelComplete from './components/LevelComplete.vue';
import { 
  GAME_STATES, 
  createGameState, 
  startLevel, 
  submitAnswer, 
  nextQuestion, 
  returnToMenu 
} from './logic/gameLogic.js';

const STORAGE_KEY = 'language-quiz-game-progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { totalScore: 0 };
  } catch {
    return { totalScore: 0 };
  }
}

function saveProgress(totalScore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalScore }));
  } catch {
    console.error('保存游戏进度失败');
  }
}

export default {
  name: 'App',
  components: {
    GameMenu,
    GamePlay,
    LevelComplete
  },
  setup() {
    const savedProgress = loadProgress();
    const initialState = createGameState();
    initialState.totalScore = savedProgress.totalScore;
    
    const gameState = reactive(initialState);
    const previousTotalScore = ref(0);

    watch(
      () => gameState.totalScore,
      (newScore) => {
        saveProgress(newScore);
      }
    );

    const handleStartLevel = (levelId) => {
      previousTotalScore.value = gameState.totalScore;
      const newState = startLevel(gameState, levelId);
      Object.assign(gameState, newState);
    };

    const handleSelectOption = (index) => {
      const newState = submitAnswer(gameState, index);
      Object.assign(gameState, newState);
    };

    const handleNextQuestion = () => {
      const newState = nextQuestion(gameState);
      Object.assign(gameState, newState);
    };

    const handleExit = () => {
      const newState = returnToMenu(gameState);
      Object.assign(gameState, newState);
    };

    const handleReturnMenu = () => {
      const newState = returnToMenu(gameState);
      Object.assign(gameState, newState);
    };

    return {
      gameState,
      previousTotalScore,
      GAME_STATES,
      handleStartLevel,
      handleSelectOption,
      handleNextQuestion,
      handleExit,
      handleReturnMenu
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background: #f8f9fa;
}
</style>
