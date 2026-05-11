import { getArticlesByLanguage, getArticleById, getRandomArticle } from '../data/articles.js'

export class ArticleStore {
  constructor() {
    this.currentLanguage = 'zh'
    this.currentArticle = null
  }

  setLanguage(lang) {
    if (['zh', 'en'].includes(lang)) {
      this.currentLanguage = lang
      this.currentArticle = null
      return true
    }
    return false
  }

  getLanguage() {
    return this.currentLanguage
  }

  getAvailableArticles() {
    return getArticlesByLanguage(this.currentLanguage)
  }

  selectArticle(articleId) {
    const article = getArticleById(this.currentLanguage, articleId)
    if (article) {
      this.currentArticle = article
      return true
    }
    return false
  }

  selectRandomArticle() {
    const article = getRandomArticle(this.currentLanguage)
    if (article) {
      this.currentArticle = article
      return true
    }
    return false
  }

  getCurrentArticle() {
    return this.currentArticle
  }

  getCurrentText() {
    return this.currentArticle?.text || ''
  }
}

export const articleStore = new ArticleStore()
