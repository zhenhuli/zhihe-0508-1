import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { Storage, PracticeHistory, Leaderboard } from '../storage.js'

describe('Storage', () => {
  let mockStorage = {}

  beforeEach(() => {
    mockStorage = {}
    const localStorageMock = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete mockStorage[key]
      })
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('get', () => {
    it('should return parsed JSON when key exists', () => {
      mockStorage['test-key'] = JSON.stringify({ foo: 'bar' })
      const result = Storage.get('test-key')
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should return null when key does not exist', () => {
      const result = Storage.get('non-existent-key')
      expect(result).toBeNull()
    })

    it('should return null on JSON parse error', () => {
      mockStorage['bad-json'] = 'invalid json {'
      const result = Storage.get('bad-json')
      expect(result).toBeNull()
    })
  })

  describe('set', () => {
    it('should store stringified JSON', () => {
      Storage.set('my-key', { data: 123 })
      expect(mockStorage['my-key']).toBe(JSON.stringify({ data: 123 }))
    })

    it('should return true on success', () => {
      const result = Storage.set('key', {})
      expect(result).toBe(true)
    })

    it('should return false on error', () => {
      const localStorageMock = {
        setItem: vi.fn(() => {
          throw new Error('Quota exceeded')
        }),
        getItem: vi.fn(),
        removeItem: vi.fn()
      }
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      })
      
      const result = Storage.set('key', {})
      expect(result).toBe(false)
    })
  })

  describe('remove', () => {
    it('should remove item from storage', () => {
      mockStorage['key'] = 'value'
      Storage.remove('key')
      expect(mockStorage['key']).toBeUndefined()
    })

    it('should return true on success', () => {
      const result = Storage.remove('key')
      expect(result).toBe(true)
    })
  })
})

describe('PracticeHistory', () => {
  let mockStorage = {}

  beforeEach(() => {
    mockStorage = {}
    const localStorageMock = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete mockStorage[key]
      })
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-11T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getAll', () => {
    it('should return empty array when no records', () => {
      const result = PracticeHistory.getAll()
      expect(result).toEqual([])
    })

    it('should return stored records', () => {
      const records = [{ id: '1', wpm: 50 }]
      mockStorage['typing-practice-history'] = JSON.stringify(records)
      
      const result = PracticeHistory.getAll()
      expect(result).toEqual(records)
    })
  })

  describe('add', () => {
    it('should add new record to beginning', () => {
      const record1 = { wpm: 50, accuracy: 95 }
      
      PracticeHistory.add(record1)
      const result = PracticeHistory.getAll()
      
      expect(result.length).toBe(1)
      expect(result[0].wpm).toBe(50)
      expect(result[0].id).toBeDefined()
      expect(result[0].timestamp).toBeDefined()
    })

    it('should limit to MAX_RECORDS', () => {
      const originalMax = PracticeHistory.MAX_RECORDS
      PracticeHistory.MAX_RECORDS = 2
      
      PracticeHistory.add({ wpm: 1 })
      vi.advanceTimersByTime(1000)
      PracticeHistory.add({ wpm: 2 })
      vi.advanceTimersByTime(1000)
      PracticeHistory.add({ wpm: 3 })
      
      const result = PracticeHistory.getAll()
      expect(result.length).toBe(2)
      expect(result[0].wpm).toBe(3)
      expect(result[1].wpm).toBe(2)
      
      PracticeHistory.MAX_RECORDS = originalMax
    })
  })

  describe('getByLanguage', () => {
    it('should filter by language', () => {
      mockStorage['typing-practice-history'] = JSON.stringify([
        { id: '1', language: 'zh', wpm: 50 },
        { id: '2', language: 'en', wpm: 60 },
        { id: '3', language: 'zh', wpm: 70 }
      ])
      
      const zhRecords = PracticeHistory.getByLanguage('zh')
      expect(zhRecords.length).toBe(2)
      
      const enRecords = PracticeHistory.getByLanguage('en')
      expect(enRecords.length).toBe(1)
    })
  })

  describe('clear', () => {
    it('should clear all history', () => {
      mockStorage['typing-practice-history'] = JSON.stringify([{ id: '1' }])
      
      PracticeHistory.clear()
      expect(mockStorage['typing-practice-history']).toBeUndefined()
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const timestamp = new Date('2026-05-11T12:30:45').getTime()
      const formatted = PracticeHistory.formatDate(timestamp)
      
      expect(formatted).toMatch(/\d{4}\/\d{2}\/\d{2}/)
    })
  })
})

describe('Leaderboard', () => {
  let mockStorage = {}

  beforeEach(() => {
    mockStorage = {}
    const localStorageMock = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete mockStorage[key]
      })
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-11T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getAll', () => {
    it('should return empty leaderboards when no data', () => {
      const result = Leaderboard.getAll()
      expect(result).toEqual({ zh: [], en: [] })
    })
  })

  describe('add', () => {
    it('should add entry to language board', () => {
      const result = Leaderboard.add('zh', {
        wpm: 60,
        accuracy: 95,
        elapsedTime: 60000,
        articleId: 'zh-1',
        articleTitle: 'Test'
      })
      
      expect(result.rank).toBe(1)
      expect(result.entry.wpm).toBe(60)
      
      const leaderboard = Leaderboard.getAll()
      expect(leaderboard.zh.length).toBe(1)
    })

    it('should sort by WPM descending', () => {
      Leaderboard.add('zh', { wpm: 50, accuracy: 90 })
      vi.advanceTimersByTime(1000)
      Leaderboard.add('zh', { wpm: 80, accuracy: 95 })
      vi.advanceTimersByTime(1000)
      Leaderboard.add('zh', { wpm: 60, accuracy: 85 })
      
      const zhBoard = Leaderboard.getByLanguage('zh')
      expect(zhBoard[0].wpm).toBe(80)
      expect(zhBoard[1].wpm).toBe(60)
      expect(zhBoard[2].wpm).toBe(50)
    })

    it('should limit to MAX_ENTRIES', () => {
      const originalMax = Leaderboard.MAX_ENTRIES
      Leaderboard.MAX_ENTRIES = 3
      
      for (let i = 0; i < 5; i++) {
        Leaderboard.add('en', { wpm: 50 + i * 10, accuracy: 90 })
        vi.advanceTimersByTime(1000)
      }
      
      const enBoard = Leaderboard.getByLanguage('en')
      expect(enBoard.length).toBe(3)
      expect(enBoard[0].wpm).toBe(90)
      expect(enBoard[2].wpm).toBe(70)
      
      Leaderboard.MAX_ENTRIES = originalMax
    })
  })

  describe('getByLanguage', () => {
    it('should return language specific board', () => {
      Leaderboard.add('zh', { wpm: 50 })
      Leaderboard.add('en', { wpm: 60 })
      
      expect(Leaderboard.getByLanguage('zh').length).toBe(1)
      expect(Leaderboard.getByLanguage('en').length).toBe(1)
      expect(Leaderboard.getByLanguage('zh')[0].wpm).toBe(50)
    })
  })

  describe('isTopTen', () => {
    it('should return true if board has less than 10 entries', () => {
      const result = Leaderboard.isTopTen('zh', 50)
      expect(result).toBe(true)
    })

    it('should return false if WPM is too low', () => {
      for (let i = 0; i < 10; i++) {
        Leaderboard.add('en', { wpm: 60 + i, accuracy: 90 })
        vi.advanceTimersByTime(1000)
      }
      
      expect(Leaderboard.isTopTen('en', 50)).toBe(false)
      expect(Leaderboard.isTopTen('en', 80)).toBe(true)
    })
  })

  describe('clear', () => {
    it('should clear leaderboard', () => {
      Leaderboard.add('zh', { wpm: 50 })
      Leaderboard.clear()
      
      expect(mockStorage['typing-practice-leaderboard']).toBeUndefined()
    })
  })
})
