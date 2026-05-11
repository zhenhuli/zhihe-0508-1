import { articleStore } from './modules/articleStore.js'
import { typingValidator } from './modules/typingValidator.js'
import { speedStats } from './modules/speedStats.js'
import { resultReview } from './modules/resultReview.js'
import { leaderboardManager } from './modules/leaderboard.js'

class TypingApp {
  constructor() {
    this.isStarted = false
    this.isCompleted = false
    this.updateInterval = null
    this.isComposing = false
    
    this.initElements()
    this.initEventListeners()
    this.loadArticles()
  }

  initElements() {
    this.languageSelect = document.getElementById('language-select')
    this.articleSelect = document.getElementById('article-select')
    this.startBtn = document.getElementById('start-btn')
    this.resetBtn = document.getElementById('reset-btn')
    this.viewHistoryBtn = document.getElementById('view-history-btn')
    
    this.timeEl = document.getElementById('time')
    this.wpmEl = document.getElementById('wpm')
    this.accuracyEl = document.getElementById('accuracy')
    this.progressEl = document.getElementById('progress')
    
    this.textDisplay = document.getElementById('text-display')
    this.inputArea = document.getElementById('input-area')
    
    this.resultSection = document.getElementById('result-section')
    this.finalWpmEl = document.getElementById('final-wpm')
    this.finalAccuracyEl = document.getElementById('final-accuracy')
    this.finalTimeEl = document.getElementById('final-time')
    this.finalErrorsEl = document.getElementById('final-errors')
    this.errorReview = document.getElementById('error-review')
    this.errorList = document.getElementById('error-list')
    this.retryBtn = document.getElementById('retry-btn')
    this.closeResultBtn = document.getElementById('close-result-btn')
    
    this.historySection = document.getElementById('history-section')
    this.historyList = document.getElementById('history-list')
    this.clearHistoryBtn = document.getElementById('clear-history-btn')
    this.closeHistoryBtn = document.getElementById('close-history-btn')
    
    this.leaderboardSection = document.getElementById('leaderboard-section')
    this.leaderboardList = document.getElementById('leaderboard-list')
    this.leaderboardTabs = document.querySelectorAll('.tab-btn')
  }

  initEventListeners() {
    this.languageSelect.addEventListener('change', () => this.onLanguageChange())
    this.articleSelect.addEventListener('change', () => this.onArticleChange())
    
    this.startBtn.addEventListener('click', () => this.startPractice())
    this.resetBtn.addEventListener('click', () => this.resetPractice())
    
    this.inputArea.addEventListener('input', (e) => this.onInput(e))
    this.inputArea.addEventListener('keydown', (e) => this.onKeyDown(e))
    this.inputArea.addEventListener('compositionstart', () => this.onCompositionStart())
    this.inputArea.addEventListener('compositionend', (e) => this.onCompositionEnd(e))
    
    this.retryBtn.addEventListener('click', () => this.retryPractice())
    this.closeResultBtn.addEventListener('click', () => this.closeResult())
    
    this.viewHistoryBtn.addEventListener('click', () => this.showHistory())
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory())
    this.closeHistoryBtn.addEventListener('click', () => this.closeHistory())
    
    this.leaderboardTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchLeaderboardTab(tab))
    })
  }

  onLanguageChange() {
    const lang = this.languageSelect.value
    articleStore.setLanguage(lang)
    leaderboardManager.setLanguage(lang)
    this.loadArticles()
    this.resetPractice()
  }

  onArticleChange() {
    const articleId = this.articleSelect.value
    if (articleId) {
      articleStore.selectArticle(articleId)
      this.updateTextDisplay()
      this.resetPractice()
    }
  }

  loadArticles() {
    const articles = articleStore.getAvailableArticles()
    
    this.articleSelect.innerHTML = ''
    articles.forEach((article, index) => {
      const option = document.createElement('option')
      option.value = article.id
      option.textContent = article.title
      if (index === 0) {
        articleStore.selectArticle(article.id)
      }
      this.articleSelect.appendChild(option)
    })
    
    this.updateTextDisplay()
  }

  updateTextDisplay() {
    const article = articleStore.getCurrentArticle()
    if (article) {
      typingValidator.setTargetText(article.text)
      this.textDisplay.innerHTML = typingValidator.generateHighlightedHTML()
    }
  }

  startPractice() {
    if (!articleStore.getCurrentArticle()) {
      alert('请先选择一篇文章')
      return
    }
    
    this.isStarted = true
    this.isCompleted = false
    
    typingValidator.reset()
    speedStats.reset()
    
    this.inputArea.value = ''
    this.inputArea.disabled = false
    this.inputArea.focus()
    
    this.startBtn.textContent = '练习中...'
    this.startBtn.disabled = true
    
    speedStats.start()
    this.startUpdateInterval()
    
    this.updateTextDisplay()
    this.updateStats()
  }

  resetPractice() {
    this.isStarted = false
    this.isCompleted = false
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    speedStats.reset()
    typingValidator.reset()
    
    this.inputArea.value = ''
    this.inputArea.disabled = true
    
    this.startBtn.textContent = '开始练习'
    this.startBtn.disabled = false
    
    this.updateTextDisplay()
    this.resetStatsDisplay()
    
    this.closeResult()
    this.closeHistory()
  }

  retryPractice() {
    this.closeResult()
    this.startPractice()
  }

  onInput(e) {
    if (!this.isStarted || this.isCompleted || this.isComposing) return
    
    const input = e.target.value
    typingValidator.updateInput(input)
    
    this.textDisplay.innerHTML = typingValidator.generateHighlightedHTML()
    this.updateStats()
    
    const results = typingValidator.getValidationResults()
    if (results.isComplete) {
      this.finishPractice()
    }
  }

  onCompositionStart() {
    this.isComposing = true
  }

  onCompositionEnd(e) {
    this.isComposing = false
    
    if (!this.isStarted || this.isCompleted) return
    
    const input = e.target.value
    typingValidator.updateInput(input)
    
    this.textDisplay.innerHTML = typingValidator.generateHighlightedHTML()
    this.updateStats()
    
    const results = typingValidator.getValidationResults()
    if (results.isComplete) {
      this.finishPractice()
    }
  }

  onKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  startUpdateInterval() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.updateInterval = setInterval(() => {
      this.updateStats()
    }, 100)
  }

  updateStats() {
    if (!this.isStarted) return
    
    const results = typingValidator.getValidationResults()
    const isCJK = articleStore.getLanguage() === 'zh'
    const stats = speedStats.getStats(results.totalTyped, results.correct, isCJK)
    
    this.timeEl.textContent = stats.formattedTime
    this.wpmEl.textContent = stats.wpm
    this.accuracyEl.textContent = `${stats.accuracy}%`
    this.progressEl.textContent = `${typingValidator.getProgress()}%`
  }

  resetStatsDisplay() {
    this.timeEl.textContent = '00:00'
    this.wpmEl.textContent = '0'
    this.accuracyEl.textContent = '100%'
    this.progressEl.textContent = '0%'
  }

  finishPractice() {
    this.isCompleted = true
    speedStats.stop()
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    const results = typingValidator.getValidationResults()
    const isCJK = articleStore.getLanguage() === 'zh'
    const stats = speedStats.getStats(results.totalTyped, results.correct, isCJK)
    const article = articleStore.getCurrentArticle()
    
    resultReview.saveToHistory(
      articleStore.getLanguage(),
      article.id,
      article.title,
      { ...stats, correct: results.correct },
      results.errors
    )
    
    const rankResult = leaderboardManager.checkAndShowNewRank(
      stats.wpm,
      stats.accuracy,
      stats.elapsedTime,
      article.id,
      article.title
    )
    
    this.showResult(stats, results.errors, rankResult)
    
    this.startBtn.textContent = '开始练习'
    this.startBtn.disabled = false
    this.inputArea.disabled = true
  }

  showResult(stats, errors, rankResult) {
    this.finalWpmEl.textContent = stats.wpm
    this.finalAccuracyEl.textContent = `${stats.accuracy}%`
    this.finalTimeEl.textContent = stats.formattedTime
    this.finalErrorsEl.textContent = errors.length
    
    if (errors.length > 0) {
      this.errorReview.classList.remove('hidden')
      this.errorList.innerHTML = resultReview.getErrorReviewHTML(errors)
    } else {
      this.errorReview.classList.add('hidden')
    }
    
    this.resultSection.classList.remove('hidden')
    
    if (rankResult.isNewRank) {
      const rankMsg = document.createElement('div')
      rankMsg.className = 'rank-announcement'
      rankMsg.textContent = rankResult.message
      this.resultSection.querySelector('h2').after(rankMsg)
      setTimeout(() => rankMsg.remove(), 5000)
    }
  }

  closeResult() {
    this.resultSection.classList.add('hidden')
  }

  showHistory() {
    this.historyList.innerHTML = resultReview.getHistoryHTML()
    this.historySection.classList.remove('hidden')
  }

  clearHistory() {
    if (confirm('确定要清空所有练习记录吗？此操作不可撤销。')) {
      resultReview.clearHistory()
      this.historyList.innerHTML = resultReview.getHistoryHTML()
    }
  }

  closeHistory() {
    this.historySection.classList.add('hidden')
  }

  switchLeaderboardTab(tab) {
    const lang = tab.dataset.lang
    leaderboardManager.setLanguage(lang)
    
    this.leaderboardTabs.forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    
    this.leaderboardList.innerHTML = leaderboardManager.getLeaderboardHTML()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TypingApp()
})
