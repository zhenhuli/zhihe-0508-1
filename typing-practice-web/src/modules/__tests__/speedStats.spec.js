import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { SpeedStats } from '../speedStats.js'

describe('SpeedStats', () => {
  let stats

  beforeEach(() => {
    stats = new SpeedStats()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('start', () => {
    it('should start the timer', () => {
      stats.start()
      expect(stats.isRunning).toBe(true)
    })

    it('should not start if already running', () => {
      stats.start()
      const firstStartTime = stats.startTime
      vi.advanceTimersByTime(1000)
      stats.start()
      expect(stats.startTime).toBe(firstStartTime)
    })
  })

  describe('stop', () => {
    it('should stop the timer', () => {
      stats.start()
      stats.stop()
      expect(stats.isRunning).toBe(false)
    })

    it('should do nothing if not running', () => {
      stats.stop()
      expect(stats.isRunning).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset all values', () => {
      stats.start()
      vi.advanceTimersByTime(5000)
      stats.reset()
      
      expect(stats.isRunning).toBe(false)
      expect(stats.startTime).toBe(null)
      expect(stats.elapsedTime).toBe(0)
    })
  })

  describe('getElapsedMilliseconds', () => {
    it('should return 0 when not started', () => {
      expect(stats.getElapsedMilliseconds()).toBe(0)
    })

    it('should return correct elapsed time while running', () => {
      stats.start()
      vi.advanceTimersByTime(5000)
      expect(stats.getElapsedMilliseconds()).toBe(5000)
    })

    it('should return correct elapsed time after stopping', () => {
      stats.start()
      vi.advanceTimersByTime(3000)
      stats.stop()
      vi.advanceTimersByTime(2000)
      expect(stats.getElapsedMilliseconds()).toBe(3000)
    })
  })

  describe('getElapsedSeconds', () => {
    it('should return correct seconds', () => {
      stats.start()
      vi.advanceTimersByTime(5500)
      expect(stats.getElapsedSeconds()).toBe(5)
    })
  })

  describe('getElapsedMinutes', () => {
    it('should return correct minutes', () => {
      stats.start()
      vi.advanceTimersByTime(90000)
      expect(stats.getElapsedMinutes()).toBe(1.5)
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      stats.start()
      vi.advanceTimersByTime(125000)
      expect(stats.formatTime()).toBe('02:05')
    })

    it('should format less than a minute', () => {
      stats.start()
      vi.advanceTimersByTime(35000)
      expect(stats.formatTime()).toBe('00:35')
    })

    it('should pad with zeros', () => {
      stats.start()
      vi.advanceTimersByTime(5000)
      expect(stats.formatTime()).toBe('00:05')
    })
  })

  describe('calculateWPM', () => {
    it('should return 0 when no time or characters', () => {
      expect(stats.calculateWPM(0)).toBe(0)
      stats.start()
      expect(stats.calculateWPM(100)).toBe(0)
    })

    it('should calculate WPM for English (5 chars per word)', () => {
      stats.start()
      vi.advanceTimersByTime(60000)
      expect(stats.calculateWPM(50, false)).toBe(10)
    })

    it('should calculate CPM for CJK languages', () => {
      stats.start()
      vi.advanceTimersByTime(60000)
      expect(stats.calculateWPM(60, true)).toBe(60)
    })
  })

  describe('calculateCPM', () => {
    it('should return 0 when no time or characters', () => {
      expect(stats.calculateCPM(0)).toBe(0)
      stats.start()
      expect(stats.calculateCPM(100)).toBe(0)
    })

    it('should calculate CPM correctly', () => {
      stats.start()
      vi.advanceTimersByTime(60000)
      expect(stats.calculateCPM(120)).toBe(120)
    })
  })

  describe('getStats', () => {
    it('should return all statistics', () => {
      stats.start()
      vi.advanceTimersByTime(60000)
      
      const result = stats.getStats(100, 95, false)
      
      expect(result.wpm).toBe(20)
      expect(result.cpm).toBe(100)
      expect(result.accuracy).toBe(95)
      expect(result.elapsedTime).toBe(60000)
      expect(result.formattedTime).toBe('01:00')
      expect(result.minutes).toBe(1)
    })

    it('should handle accuracy edge cases', () => {
      stats.start()
      vi.advanceTimersByTime(60000)
      
      const result = stats.getStats(0, 0, false)
      expect(result.accuracy).toBe(0)
    })
  })

  describe('resume timer', () => {
    it('should resume from where it left off', () => {
      stats.start()
      vi.advanceTimersByTime(3000)
      stats.stop()
      vi.advanceTimersByTime(2000)
      stats.start()
      vi.advanceTimersByTime(1000)
      
      expect(stats.getElapsedMilliseconds()).toBe(4000)
    })
  })
})
