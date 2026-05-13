<template>
  <div class="app">
    <header class="header">
      <h1>🎬 我的观影清单</h1>
      <div class="stats">
        <span>想看: {{ movieStore.wantToWatchCount }}</span>
        <span>已看: {{ movieStore.watchedCount }}</span>
        <span>总计: {{ movieStore.movies.length }}</span>
      </div>
    </header>

    <div class="controls">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索影片名称..."
          @input="handleSearch"
        />
      </div>

      <div class="filter-group">
        <select v-model="filterType" @change="handleFilterChange">
          <option value="all">全部状态</option>
          <option value="want">想看</option>
          <option value="watched">已看</option>
          <option disabled>--- 按类型 ---</option>
          <option v-for="genre in movieStore.genres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
      </div>

      <button class="add-btn" @click="showAddModal = true">+ 添加影片</button>
    </div>

    <div class="movie-list">
      <div v-if="movieStore.filteredMovies.length === 0" class="empty-state">
        <p>暂无影片，点击上方按钮添加吧！</p>
      </div>
      <div v-else class="movie-grid">
        <div v-for="movie in movieStore.filteredMovies" :key="movie.id" class="movie-card">
          <div v-if="movie.cover" class="movie-cover">
            <img :src="movie.cover" :alt="movie.title" />
          </div>
          <div v-else class="movie-cover-placeholder">
            <span class="cover-icon">🎬</span>
          </div>
          <div class="movie-header">
            <h3>{{ movie.title }}</h3>
            <button class="delete-btn" @click="confirmDelete(movie)">×</button>
          </div>
          <div class="movie-info">
            <span class="genre-tag">{{ movie.genre }}</span>
            <span class="year">{{ movie.year }}</span>
          </div>
          <div class="cover-upload-inline">
            <label class="upload-btn-small">
              <span>更换封面</span>
              <input
                type="file"
                accept="image/*"
                @change="handleInlineCoverUpload($event, movie.id)"
              />
            </label>
          </div>
          <div class="movie-actions">
            <div class="status-buttons">
              <button
                :class="['status-btn', { active: movie.status === 'want' }]"
                @click="updateStatus(movie.id, 'want')"
              >
                想看
              </button>
              <button
                :class="['status-btn', { active: movie.status === 'watched' }]"
                @click="updateStatus(movie.id, 'watched')"
              >
                已看
              </button>
            </div>
            <div v-if="movie.status === 'watched'" class="rating">
              <span>评分：</span>
              <div class="stars">
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="['star', { filled: star <= movie.rating }]"
                  @click="updateRating(movie.id, star)"
                >★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h2>添加新影片</h2>
        <form @submit.prevent="addMovie">
          <div class="form-group">
            <label>封面图片</label>
            <div class="cover-upload-section">
              <div v-if="newMovie.cover" class="cover-preview">
                <img :src="newMovie.cover" alt="封面预览" />
                <button type="button" class="remove-cover-btn" @click="removeNewMovieCover">
                  移除
                </button>
              </div>
              <label v-else class="cover-upload-btn">
                <span class="upload-icon">📷</span>
                <span>点击上传封面</span>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleCoverUpload"
                />
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>影片名称</label>
            <input v-model="newMovie.title" type="text" required placeholder="输入影片名称" />
          </div>
          <div class="form-group">
            <label>类型</label>
            <select v-model="newMovie.genre" required>
              <option value="">请选择类型</option>
              <option v-for="genre in movieStore.genres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>年份</label>
            <input v-model="newMovie.year" type="number" required placeholder="输入年份" />
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="newMovie.status">
              <option value="want">想看</option>
              <option value="watched">已看</option>
            </select>
          </div>
          <div v-if="newMovie.status === 'watched'" class="form-group">
            <label>评分</label>
            <div class="stars-input">
              <span
                v-for="star in 5"
                :key="star"
                :class="['star', { filled: star <= newMovie.rating }]"
                @click="newMovie.rating = star"
              >★</span>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showAddModal = false">取消</button>
            <button type="submit" class="submit-btn">添加</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from './stores/movieStore'

const movieStore = useMovieStore()

const searchQuery = ref('')
const filterType = ref('all')
const showAddModal = ref(false)

const newMovie = ref({
  title: '',
  genre: '',
  year: '',
  status: 'want',
  rating: 0,
  cover: ''
})

onMounted(() => {
  movieStore.loadFromStorage()
})

const handleSearch = () => {
  movieStore.setSearchQuery(searchQuery.value)
}

const handleFilterChange = () => {
  movieStore.setFilterType(filterType.value)
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newMovie.value.cover = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleInlineCoverUpload = (event, movieId) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      movieStore.updateMovieCover(movieId, e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const removeNewMovieCover = () => {
  newMovie.value.cover = ''
}

const addMovie = () => {
  movieStore.addMovie({
    title: newMovie.value.title,
    genre: newMovie.value.genre,
    year: newMovie.value.year,
    status: newMovie.value.status,
    rating: newMovie.value.rating,
    cover: newMovie.value.cover
  })
  resetNewMovieForm()
  showAddModal.value = false
}

const resetNewMovieForm = () => {
  newMovie.value = {
    title: '',
    genre: '',
    year: '',
    status: 'want',
    rating: 0,
    cover: ''
  }
}

const updateStatus = (id, status) => {
  movieStore.updateMovieStatus(id, status)
}

const updateRating = (id, rating) => {
  movieStore.updateMovieRating(id, rating)
}

const confirmDelete = (movie) => {
  if (!movie || !movie.id) {
    console.error('无效的影片对象:', movie)
    return
  }
  
  const result = window.confirm(`确定要删除「${movie.title}」吗？`)
  console.log('确认结果:', result, '类型:', typeof result)
  
  if (result === true) {
    console.log('执行删除, id:', movie.id)
    movieStore.deleteMovie(movie.id)
  } else {
    console.log('取消删除')
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 1.1rem;
}

.controls {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.search-bar input {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  width: 300px;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-group select {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.add-btn {
  padding: 12px 30px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.movie-list {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.movie-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-cover {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f0f0f0;
}

.movie-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-cover-placeholder {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

.cover-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 20px 10px;
}

.movie-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}

.delete-btn:hover {
  color: #ff6b6b;
}

.movie-info {
  display: flex;
  gap: 10px;
  padding: 0 20px 15px;
}

.genre-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.year {
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.cover-upload-inline {
  padding: 0 20px 10px;
}

.upload-btn-small {
  display: inline-block;
  cursor: pointer;
  color: #667eea;
  font-size: 0.85rem;
}

.upload-btn-small:hover {
  text-decoration: underline;
}

.upload-btn-small input {
  display: none;
}

.movie-actions {
  border-top: 1px solid #eee;
  padding: 15px 20px 20px;
}

.status-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.status-btn {
  flex: 1;
  padding: 8px 15px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.status-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating span {
  color: #666;
  font-size: 0.9rem;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  font-size: 1.2rem;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin: 0 0 25px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #667eea;
}

.cover-upload-section {
  width: 100%;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.85rem;
}

.remove-cover-btn:hover {
  background: rgba(0, 0, 0, 0.9);
}

.cover-upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.cover-upload-btn:hover {
  border-color: #667eea;
  background: #f8f7ff;
}

.cover-upload-btn input {
  display: none;
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.cover-upload-btn span:last-child {
  color: #666;
  font-size: 0.9rem;
}

.stars-input {
  display: flex;
  gap: 8px;
  padding: 5px 0;
}

.stars-input .star {
  font-size: 1.8rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
</style>
