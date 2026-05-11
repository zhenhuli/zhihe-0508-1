const STORAGE_KEYS = {
  HISTORY: 'typing-practice-history',
  LEADERBOARD: 'typing-practice-leaderboard',
  SETTINGS: 'typing-practice-settings'
}

export class Storage {
  static get(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Storage get error:', e)
      return null
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  }
}

export class PracticeHistory {
  static MAX_RECORDS = 100

  static getAll() {
    return Storage.get(STORAGE_KEYS.HISTORY) || []
  }

  static add(record) {
    const history = this.getAll()
    const newRecord = {
      ...record,
      id: `record-${Date.now()}`,
      timestamp: Date.now()
    }
    history.unshift(newRecord)
    
    if (history.length > this.MAX_RECORDS) {
      history.splice(this.MAX_RECORDS)
    }
    
    Storage.set(STORAGE_KEYS.HISTORY, history)
    return newRecord
  }

  static getByLanguage(lang) {
    return this.getAll().filter(record => record.language === lang)
  }

  static clear() {
    Storage.remove(STORAGE_KEYS.HISTORY)
  }

  static formatDate(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export class Leaderboard {
  static MAX_ENTRIES = 10

  static getAll() {
    return Storage.get(STORAGE_KEYS.LEADERBOARD) || { zh: [], en: [] }
  }

  static add(lang, entry) {
    const leaderboard = this.getAll()
    const langBoard = leaderboard[lang] || []
    
    const newEntry = {
      ...entry,
      id: `leader-${Date.now()}`,
      timestamp: Date.now()
    }
    
    langBoard.push(newEntry)
    langBoard.sort((a, b) => b.wpm - a.wpm)
    
    if (langBoard.length > this.MAX_ENTRIES) {
      langBoard.splice(this.MAX_ENTRIES)
    }
    
    leaderboard[lang] = langBoard
    Storage.set(STORAGE_KEYS.LEADERBOARD, leaderboard)
    
    const rank = langBoard.findIndex(e => e.id === newEntry.id) + 1
    return { entry: newEntry, rank }
  }

  static getByLanguage(lang) {
    const leaderboard = this.getAll()
    return leaderboard[lang] || []
  }

  static isTopTen(lang, wpm) {
    const langBoard = this.getByLanguage(lang)
    if (langBoard.length < this.MAX_ENTRIES) return true
    return wpm > langBoard[langBoard.length - 1].wpm
  }

  static clear() {
    Storage.remove(STORAGE_KEYS.LEADERBOARD)
  }
}
