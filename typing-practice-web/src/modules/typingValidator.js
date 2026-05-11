export class TypingValidator {
  constructor() {
    this.targetText = ''
    this.userInput = ''
    this.errors = []
    this.totalCharactersTyped = 0
    this.correctCharacters = 0
    this.errorPositions = new Set()
  }

  setTargetText(text) {
    this.targetText = text
    this.reset()
  }

  reset() {
    this.userInput = ''
    this.errors = []
    this.totalCharactersTyped = 0
    this.correctCharacters = 0
    this.errorPositions.clear()
  }

  updateInput(input) {
    this.userInput = input
    this.errors = []
    this.correctCharacters = 0
    this.errorPositions.clear()

    const inputLength = input.length
    this.totalCharactersTyped = inputLength

    for (let i = 0; i < inputLength; i++) {
      const targetChar = this.targetText[i]
      const inputChar = input[i]

      if (targetChar === undefined) {
        break
      }

      if (inputChar === targetChar) {
        this.correctCharacters++
      } else {
        this.errorPositions.add(i)
        this.errors.push({
          position: i,
          expected: targetChar,
          actual: inputChar
        })
      }
    }
  }

  getValidationResults() {
    return {
      targetText: this.targetText,
      userInput: this.userInput,
      errors: [...this.errors],
      totalTyped: this.totalCharactersTyped,
      correct: this.correctCharacters,
      incorrect: this.errors.length,
      accuracy: this.calculateAccuracy(),
      isComplete: this.isComplete(),
      errorPositions: new Set(this.errorPositions)
    }
  }

  calculateAccuracy() {
    if (this.totalCharactersTyped === 0) return 100
    return Math.round((this.correctCharacters / this.totalCharactersTyped) * 100)
  }

  isComplete() {
    const hasEnoughLength = this.userInput.length >= this.targetText.length
    const hasNoErrors = this.errorPositions.size === 0
    return hasEnoughLength && hasNoErrors
  }

  isLastCharacterCorrect() {
    if (this.userInput.length === 0) return true
    const lastIndex = this.userInput.length - 1
    return !this.errorPositions.has(lastIndex)
  }

  getProgress() {
    if (this.targetText.length === 0) return 0
    return Math.round((this.userInput.length / this.targetText.length) * 100)
  }

  getCharacterStatus(index) {
    if (index >= this.userInput.length) {
      return 'pending'
    }
    if (this.errorPositions.has(index)) {
      return 'error'
    }
    return 'correct'
  }

  generateHighlightedHTML() {
    let html = ''
    for (let i = 0; i < this.targetText.length; i++) {
      const char = this.targetText[i]
      const status = this.getCharacterStatus(i)
      let className = 'char'
      
      if (status === 'correct') {
        className += ' correct'
      } else if (status === 'error') {
        className += ' error'
        const userChar = this.userInput[i] || ''
        if (i < this.userInput.length) {
          html += `<span class="${className}" title="期望: '${char}', 实际: '${userChar}'">${this._escapeHtml(userChar)}</span>`
          continue
        }
      } else if (i === this.userInput.length) {
        className += ' current'
      }
      
      html += `<span class="${className}">${this._escapeHtml(char)}</span>`
    }
    return html
  }

  _escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

export const typingValidator = new TypingValidator()
