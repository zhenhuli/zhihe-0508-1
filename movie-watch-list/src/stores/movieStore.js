import { defineStore } from 'pinia'

const STORAGE_KEY = 'movie-watch-list'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
    searchQuery: '',
    filterType: 'all',
    genres: ['动作', '喜剧', '爱情', '科幻', '恐怖', '悬疑', '动画', '纪录片']
  }),

  getters: {
    filteredMovies: (state) => {
      let result = state.movies

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(movie => 
          movie.title.toLowerCase().includes(query)
        )
      }

      if (state.filterType !== 'all') {
        if (state.filterType === 'want') {
          result = result.filter(movie => movie.status === 'want')
        } else if (state.filterType === 'watched') {
          result = result.filter(movie => movie.status === 'watched')
        } else {
          result = result.filter(movie => movie.genre === state.filterType)
        }
      }

      return result
    },

    wantToWatchCount: (state) => state.movies.filter(m => m.status === 'want').length,
    watchedCount: (state) => state.movies.filter(m => m.status === 'watched').length
  },

  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          this.movies = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load movies from storage', e)
        }
      }
    },

    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.movies))
      } catch (error) {
        console.error('保存到本地存储失败:', error)
        if (error.name === 'QuotaExceededError') {
          throw new Error('存储空间不足，请删除一些带有封面图片的影片后重试。')
        }
        throw error
      }
    },

    addMovie(movieData) {
      const movie = {
        id: Date.now(),
        title: movieData.title,
        genre: movieData.genre,
        year: movieData.year,
        status: movieData.status || 'want',
        rating: movieData.rating || 0,
        cover: movieData.cover || '',
        createdAt: new Date().toISOString()
      }
      this.movies.unshift(movie)
      this.saveToStorage()
      return movie
    },

    updateMovieStatus(id, status) {
      const movie = this.movies.find(m => m.id === id)
      if (movie) {
        movie.status = status
        this.saveToStorage()
      }
    },

    updateMovieRating(id, rating) {
      const movie = this.movies.find(m => m.id === id)
      if (movie) {
        movie.rating = rating
        this.saveToStorage()
      }
    },

    updateMovieCover(id, cover) {
      const movie = this.movies.find(m => m.id === id)
      if (movie) {
        movie.cover = cover
        this.saveToStorage()
      }
    },

    deleteMovie(id) {
      console.log('store.deleteMovie 被调用, id:', id)
      const index = this.movies.findIndex(m => m.id === id)
      console.log('找到的索引:', index)
      if (index > -1) {
        const deleted = this.movies.splice(index, 1)
        console.log('已删除:', deleted)
        this.saveToStorage()
        console.log('删除后的列表:', this.movies)
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setFilterType(type) {
      this.filterType = type
    }
  }
})
