export class SpeedStats {
  constructor() {
    this.startTime = null
    this.endTime = null
    this.isRunning = false
    this.elapsedTime = 0
    this.timerInterval = null
  }

  start() {
    if (this.isRunning) return
    this.startTime = Date.now() - this.elapsedTime
    this.isRunning = true
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime
    }, 100)
  }

  stop() {
    if (!this.isRunning) return
    this.isRunning = false
    this.endTime = Date.now()
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }

  reset() {
    this.stop()
    this.startTime = null
    this.endTime = null
    this.elapsedTime = 0
  }

  getElapsedMilliseconds() {
    if (this.isRunning && this.startTime) {
      return Date.now() - this.startTime
    }
    return this.elapsedTime
  }

  getElapsedSeconds() {
    return Math.floor(this.getElapsedMilliseconds() / 1000)
  }

  getElapsedMinutes() {
    return this.getElapsedSeconds() / 60
  }

  formatTime() {
    const totalSeconds = this.getElapsedSeconds()
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  calculateWPM(charactersTyped, isCJK = false) {
    const minutes = this.getElapsedMinutes()
    if (minutes === 0 || charactersTyped === 0) return 0

    if (isCJK) {
      return Math.round(charactersTyped / minutes)
    } else {
      return Math.round((charactersTyped / 5) / minutes)
    }
  }

  calculateCPM(charactersTyped) {
    const minutes = this.getElapsedMinutes()
    if (minutes === 0 || charactersTyped === 0) return 0
    return Math.round(charactersTyped / minutes)
  }

  getStats(charactersTyped, correctCharacters, isCJK = false) {
    return {
      wpm: this.calculateWPM(charactersTyped, isCJK),
      cpm: this.calculateCPM(charactersTyped),
      accuracy: Math.round((correctCharacters / Math.max(charactersTyped, 1)) * 100),
      elapsedTime: this.getElapsedMilliseconds(),
      formattedTime: this.formatTime(),
      minutes: this.getElapsedMinutes()
    }
  }
}

export const speedStats = new SpeedStats()
