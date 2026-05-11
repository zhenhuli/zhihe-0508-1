import { describe, it, expect, beforeEach } from 'vitest'
import { TypingValidator } from '../typingValidator.js'

describe('TypingValidator', () => {
  let validator

  beforeEach(() => {
    validator = new TypingValidator()
  })

  describe('setTargetText', () => {
    it('should set target text and reset state', () => {
      validator.setTargetText('hello world')
      expect(validator.targetText).toBe('hello world')
      expect(validator.userInput).toBe('')
      expect(validator.errors).toEqual([])
    })
  })

  describe('reset', () => {
    it('should reset all state', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      validator.reset()
      
      expect(validator.userInput).toBe('')
      expect(validator.errors).toEqual([])
      expect(validator.totalCharactersTyped).toBe(0)
      expect(validator.correctCharacters).toBe(0)
      expect(validator.errorPositions.size).toBe(0)
    })
  })

  describe('updateInput', () => {
    it('should track correct input', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      
      expect(validator.userInput).toBe('hel')
      expect(validator.totalCharactersTyped).toBe(3)
      expect(validator.correctCharacters).toBe(3)
      expect(validator.errorPositions.size).toBe(0)
    })

    it('should detect errors', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      
      expect(validator.correctCharacters).toBe(3)
      expect(validator.errors.length).toBe(1)
      expect(validator.errorPositions.has(3)).toBe(true)
    })

    it('should handle multiple errors', () => {
      validator.setTargetText('hello')
      validator.updateInput('hxllx')
      
      expect(validator.errors.length).toBe(2)
      expect(validator.errorPositions.has(1)).toBe(true)
      expect(validator.errorPositions.has(4)).toBe(true)
    })

    it('should handle input longer than target', () => {
      validator.setTargetText('hi')
      validator.updateInput('hello')
      
      expect(validator.correctCharacters).toBe(1)
      expect(validator.totalCharactersTyped).toBe(5)
    })
  })

  describe('calculateAccuracy', () => {
    it('should return 100% for empty input', () => {
      validator.setTargetText('hello')
      expect(validator.calculateAccuracy()).toBe(100)
    })

    it('should calculate accuracy correctly', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      expect(validator.calculateAccuracy()).toBe(100)
    })

    it('should calculate accuracy with errors', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      expect(validator.calculateAccuracy()).toBe(75)
    })
  })

  describe('isComplete', () => {
    it('should return false when input is too short', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      expect(validator.isComplete()).toBe(false)
    })

    it('should return false when input is same length but has errors', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo_')
      expect(validator.isComplete()).toBe(false)
    })

    it('should return true when input is complete and correct', () => {
      validator.setTargetText('hello')
      validator.updateInput('hello')
      expect(validator.isComplete()).toBe(true)
    })
  })

  describe('isLastCharacterCorrect', () => {
    it('should return true for empty input', () => {
      validator.setTargetText('hello')
      expect(validator.isLastCharacterCorrect()).toBe(true)
    })

    it('should return true if last character is correct', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      expect(validator.isLastCharacterCorrect()).toBe(true)
    })

    it('should return false if last character is wrong', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      expect(validator.isLastCharacterCorrect()).toBe(false)
    })
  })

  describe('getProgress', () => {
    it('should return 0% for empty target or input', () => {
      validator.setTargetText('')
      expect(validator.getProgress()).toBe(0)
      
      validator.setTargetText('hello')
      expect(validator.getProgress()).toBe(0)
    })

    it('should calculate progress correctly', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      expect(validator.getProgress()).toBe(60)
    })

    it('should handle 100% progress', () => {
      validator.setTargetText('hello')
      validator.updateInput('hello')
      expect(validator.getProgress()).toBe(100)
    })
  })

  describe('getValidationResults', () => {
    it('should return all validation data', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      
      const results = validator.getValidationResults()
      
      expect(results.targetText).toBe('hello')
      expect(results.userInput).toBe('helo')
      expect(results.totalTyped).toBe(4)
      expect(results.correct).toBe(3)
      expect(results.incorrect).toBe(1)
      expect(results.accuracy).toBe(75)
      expect(results.isComplete).toBe(false)
    })
  })

  describe('generateHighlightedHTML', () => {
    it('should generate correct HTML for pending characters', () => {
      validator.setTargetText('hello')
      const html = validator.generateHighlightedHTML()
      
      expect(html).toContain('char current')
      expect(html).toContain('char')
    })

    it('should highlight correct characters', () => {
      validator.setTargetText('hello')
      validator.updateInput('hel')
      const html = validator.generateHighlightedHTML()
      
      expect(html).toContain('char correct')
    })

    it('should highlight incorrect characters', () => {
      validator.setTargetText('hello')
      validator.updateInput('helo')
      const html = validator.generateHighlightedHTML()
      
      expect(html).toContain('char error')
    })

    it('should escape HTML special characters', () => {
      validator.setTargetText('<script>')
      validator.updateInput('<bad>')
      const html = validator.generateHighlightedHTML()
      
      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;')
    })
  })
})
