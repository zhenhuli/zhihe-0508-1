import levelsData from '../data/levels.js';

export const levels = levelsData;

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  LEVEL_COMPLETE: 'level_complete',
  GAME_OVER: 'game_over'
};

export function getLevels() {
  return levelsData;
}

export function getLevelById(levelId) {
  return levelsData.find(level => level.id === levelId);
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkAnswer(question, selectedIndex) {
  return question.correct === selectedIndex;
}

export function calculateScore(question, isCorrect, timeBonus = 0) {
  const baseScore = isCorrect ? 20 : 0;
  const difficultyMultiplier = 1 + (question.difficulty || 0) * 0.2;
  return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
}

export function isLevelUnlocked(levelId, totalScore) {
  if (levelId === 1) return true;
  const requiredScore = (levelId - 1) * 50;
  return totalScore >= requiredScore;
}

export function getUnlockedLevels(totalScore) {
  return levelsData.filter(level => isLevelUnlocked(level.id, totalScore));
}

export function calculateLevelProgress(currentQuestionIndex, totalQuestions) {
  return Math.round((currentQuestionIndex / totalQuestions) * 100);
}

export function getNextLevelId(currentLevelId) {
  const nextLevel = levelsData.find(level => level.id === currentLevelId + 1);
  return nextLevel ? nextLevel.id : null;
}

export function createGameState() {
  return {
    currentState: GAME_STATES.MENU,
    currentLevel: null,
    currentQuestionIndex: 0,
    score: 0,
    totalScore: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null
  };
}

export function startLevel(gameState, levelId) {
  const level = getLevelById(levelId);
  if (!level) return gameState;

  return {
    ...gameState,
    currentState: GAME_STATES.PLAYING,
    currentLevel: level,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null
  };
}

export function submitAnswer(gameState, selectedIndex) {
  if (gameState.isAnswered || !gameState.currentLevel) return gameState;

  const currentQuestion = gameState.currentLevel.questions[gameState.currentQuestionIndex];
  const isCorrect = checkAnswer(currentQuestion, selectedIndex);
  const questionScore = calculateScore(currentQuestion, isCorrect);

  return {
    ...gameState,
    selectedAnswer: selectedIndex,
    isAnswered: true,
    isCorrect,
    score: gameState.score + questionScore,
    totalScore: gameState.totalScore + questionScore,
    correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
    wrongAnswers: gameState.wrongAnswers + (isCorrect ? 0 : 1)
  };
}

export function nextQuestion(gameState) {
  if (!gameState.currentLevel) return gameState;

  const nextIndex = gameState.currentQuestionIndex + 1;
  const totalQuestions = gameState.currentLevel.questions.length;

  if (nextIndex >= totalQuestions) {
    return {
      ...gameState,
      currentState: GAME_STATES.LEVEL_COMPLETE
    };
  }

  return {
    ...gameState,
    currentQuestionIndex: nextIndex,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null
  };
}

export function returnToMenu(gameState) {
  return {
    ...gameState,
    currentState: GAME_STATES.MENU,
    currentLevel: null,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: null
  };
}
