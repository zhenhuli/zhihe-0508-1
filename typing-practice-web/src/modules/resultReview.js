import { PracticeHistory } from './storage.js'

export class ResultReview {
  constructor() {
    this.currentResult = null
  }

  setResult(result) {
    this.currentResult = result
  }

  getResult() {
    return this.currentResult
  }

  saveToHistory(language, articleId, articleTitle, stats, errors) {
    const record = {
      language,
      articleId,
      articleTitle,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      elapsedTime: stats.elapsedTime,
      formattedTime: stats.formattedTime,
      errors: errors,
      totalErrors: errors.length,
      totalCharacters: stats.correct + errors.length
    }
    
    return PracticeHistory.add(record)
  }

  getHistoryHTML(records = null) {
    const history = records || PracticeHistory.getAll()
    
    if (history.length === 0) {
      return '<div class="no-data">暂无练习记录</div>'
    }
    
    let html = '<div class="history-items">'
    
    history.slice(0, 50).forEach(record => {
      const hasErrors = record.totalErrors > 0
      
      html += `
        <div class="history-item">
          <div class="history-main">
            <div class="history-article">
              <span class="history-lang">${this._getLangLabel(record.language)}</span>
              <span class="history-title">${record.articleTitle}</span>
            </div>
            <div class="history-stats">
              <span class="history-wpm">${record.wpm} WPM</span>
              <span class="history-accuracy">${record.accuracy}%</span>
              <span class="history-time">${record.formattedTime}</span>
              <span class="history-date">${PracticeHistory.formatDate(record.timestamp)}</span>
            </div>
          </div>
          ${hasErrors ? this._getErrorsHTML(record.errors, record.totalErrors) : ''}
        </div>
      `
    })
    
    html += '</div>'
    return html
  }

  getErrorReviewHTML(errors) {
    if (!errors || errors.length === 0) {
      return '<div class="no-errors">🎉 太棒了！这次练习没有错误！</div>'
    }
    
    const groupedErrors = this._groupErrors(errors)
    
    let html = '<div class="error-stats">'
    html += `<p>共有 <strong>${errors.length}</strong> 处错误</p>`
    
    if (Object.keys(groupedErrors).length > 0) {
      html += '<h4>高频错误字符：</h4>'
      html += '<div class="error-chars">'
      
      const sortedErrors = Object.entries(groupedErrors)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
      
      sortedErrors.forEach(([char, data]) => {
        html += `
          <div class="error-char-item">
            <span class="error-char">${this._escapeHtml(char)}</span>
            <span class="error-expected">→ ${this._escapeHtml(data.expected)}</span>
            <span class="error-count">×${data.count}</span>
          </div>
        `
      })
      
      html += '</div>'
    }
    
    html += '<h4>详细错误位置：</h4>'
    html += '<div class="error-detail-list">'
    
    errors.forEach((error, _index) => {
      html += `
        <div class="error-detail">
          <span class="error-pos">位置 ${error.position + 1}:</span>
          <span class="error-expected-detail">期望: "${this._escapeHtml(error.expected)}"</span>
          <span class="error-arrow">→</span>
          <span class="error-actual-detail">实际: "${this._escapeHtml(error.actual)}"</span>
        </div>
      `
    })
    
    html += '</div></div>'
    return html
  }

  _groupErrors(errors) {
    const grouped = {}
    
    errors.forEach(error => {
      const key = `${error.actual}|${error.expected}`
      if (!grouped[key]) {
        grouped[key] = {
          actual: error.actual,
          expected: error.expected,
          count: 0
        }
      }
      grouped[key].count++
    })
    
    return grouped
  }

  _getErrorsHTML(errors, totalErrors) {
    const preview = errors.slice(0, 3)
    let html = `<div class="history-errors">`
    html += `<p class="error-count">错误数: ${totalErrors}</p>`
    html += '<div class="error-preview">'
    
    preview.forEach(error => {
      html += `
        <span class="error-preview-item">
          "${this._escapeHtml(error.expected)}" → "${this._escapeHtml(error.actual)}"
        </span>
      `
    })
    
    if (totalErrors > 3) {
      html += `<span class="more-errors">... 还有 ${totalErrors - 3} 处</span>`
    }
    
    html += '</div></div>'
    return html
  }

  _getLangLabel(lang) {
    return lang === 'zh' ? '中文' : 'EN'
  }

  _escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  clearHistory() {
    PracticeHistory.clear()
  }
}

export const resultReview = new ResultReview()
