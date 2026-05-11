import { Leaderboard } from './storage.js'

export class LeaderboardManager {
  constructor() {
    this.currentLanguage = 'zh'
  }

  setLanguage(lang) {
    this.currentLanguage = lang
  }

  getLanguage() {
    return this.currentLanguage
  }

  submitScore(wpm, accuracy, elapsedTime, articleId, articleTitle) {
    if (wpm <= 0) return null
    
    const entry = {
      wpm,
      accuracy,
      elapsedTime,
      articleId,
      articleTitle
    }
    
    const result = Leaderboard.add(this.currentLanguage, entry)
    
    if (result && result.rank <= Leaderboard.MAX_ENTRIES) {
      return result
    }
    
    return null
  }

  getLeaderboard() {
    return Leaderboard.getByLanguage(this.currentLanguage)
  }

  getLeaderboardHTML() {
    const entries = this.getLeaderboard()
    
    if (entries.length === 0) {
      return '<div class="no-data">暂无排行记录</div>'
    }
    
    let html = '<table class="leaderboard-table">'
    html += '<thead><tr><th>排名</th><th>速度 (WPM)</th><th>准确率</th><th>文章</th><th>时间</th></tr></thead>'
    html += '<tbody>'
    
    entries.forEach((entry, index) => {
      const rankClass = this._getRankClass(index + 1)
      const medal = this._getMedal(index + 1)
      
      html += `
        <tr class="${rankClass}">
          <td class="rank">${medal} ${index + 1}</td>
          <td class="wpm">${entry.wpm}</td>
          <td class="accuracy">${entry.accuracy}%</td>
          <td class="article">${entry.articleTitle}</td>
          <td class="time">${this._formatTime(entry.elapsedTime)}</td>
        </tr>
      `
    })
    
    html += '</tbody></table>'
    return html
  }

  _getRankClass(rank) {
    if (rank === 1) return 'rank-1'
    if (rank === 2) return 'rank-2'
    if (rank === 3) return 'rank-3'
    return ''
  }

  _getMedal(rank) {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  _formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  checkAndShowNewRank(wpm, accuracy, elapsedTime, articleId, articleTitle) {
    const result = this.submitScore(wpm, accuracy, elapsedTime, articleId, articleTitle)
    
    if (result) {
      return {
        isNewRank: true,
        rank: result.rank,
        message: `🎉 恭喜！你的成绩进入排行榜第 ${result.rank} 名！`
      }
    }
    
    return { isNewRank: false }
  }
}

export const leaderboardManager = new LeaderboardManager()
