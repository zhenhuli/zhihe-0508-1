import { describe, it, expect, beforeEach } from 'vitest'
import { ArticleStore } from '../articleStore.js'
import { articles } from '../../data/articles.js'

describe('ArticleStore', () => {
  let store

  beforeEach(() => {
    store = new ArticleStore()
  })

  describe('setLanguage', () => {
    it('should set valid language', () => {
      expect(store.setLanguage('en')).toBe(true)
      expect(store.getLanguage()).toBe('en')
    })

    it('should return false for invalid language', () => {
      expect(store.setLanguage('fr')).toBe(false)
      expect(store.getLanguage()).toBe('zh')
    })

    it('should clear current article when language changes', () => {
      store.selectArticle('zh-1')
      store.setLanguage('en')
      expect(store.getCurrentArticle()).toBeNull()
    })
  })

  describe('getLanguage', () => {
    it('should return default language as zh', () => {
      expect(store.getLanguage()).toBe('zh')
    })
  })

  describe('getAvailableArticles', () => {
    it('should return Chinese articles for zh language', () => {
      store.setLanguage('zh')
      const result = store.getAvailableArticles()
      expect(result).toEqual(articles.zh)
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return English articles for en language', () => {
      store.setLanguage('en')
      const result = store.getAvailableArticles()
      expect(result).toEqual(articles.en)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('selectArticle', () => {
    it('should select valid Chinese article', () => {
      expect(store.selectArticle('zh-1')).toBe(true)
      const article = store.getCurrentArticle()
      expect(article).not.toBeNull()
      expect(article.id).toBe('zh-1')
    })

    it('should select valid English article after language change', () => {
      store.setLanguage('en')
      expect(store.selectArticle('en-1')).toBe(true)
      const article = store.getCurrentArticle()
      expect(article).not.toBeNull()
      expect(article.id).toBe('en-1')
    })

    it('should return false for non-existent article', () => {
      expect(store.selectArticle('non-existent')).toBe(false)
    })

    it('should not select article from different language', () => {
      store.setLanguage('zh')
      expect(store.selectArticle('en-1')).toBe(false)
      expect(store.getCurrentArticle()).toBeNull()
    })
  })

  describe('selectRandomArticle', () => {
    it('should select a random article', () => {
      expect(store.selectRandomArticle()).toBe(true)
      const article = store.getCurrentArticle()
      expect(article).not.toBeNull()
      expect(articles.zh.some(a => a.id === article.id)).toBe(true)
    })
  })

  describe('getCurrentArticle', () => {
    it('should return null initially', () => {
      expect(store.getCurrentArticle()).toBeNull()
    })

    it('should return selected article', () => {
      store.selectArticle('zh-1')
      const article = store.getCurrentArticle()
      expect(article).toEqual(articles.zh[0])
    })
  })

  describe('getCurrentText', () => {
    it('should return empty string when no article selected', () => {
      expect(store.getCurrentText()).toBe('')
    })

    it('should return article text when selected', () => {
      store.selectArticle('zh-1')
      const text = store.getCurrentText()
      expect(text).toBe(articles.zh[0].text)
      expect(text.length).toBeGreaterThan(0)
    })
  })
})
