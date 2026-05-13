import { books } from './data.js'

const masonryGrid = document.getElementById('masonry-grid')
const bookshelf = document.getElementById('bookshelf')
const reader = document.getElementById('reader')
const backBtn = document.getElementById('back-btn')
const settingsBtn = document.getElementById('settings-btn')
const settingsPanel = document.getElementById('settings-panel')
const chapterContainer = document.getElementById('chapter-container')
const bookTitle = document.getElementById('book-title')
const currentChapterEl = document.getElementById('current-chapter')
const totalChaptersEl = document.getElementById('total-chapters')
const fontDecreaseBtn = document.getElementById('font-decrease')
const fontIncreaseBtn = document.getElementById('font-increase')
const fontSizeDisplay = document.getElementById('font-size-display')
const bgColorOptions = document.querySelectorAll('.bg-option')

let currentBook = null
let currentChapterIndex = 0
let fontSize = 16
let bgColor = '#f5f5dc'

function init() {
  renderBooks()
  loadSettings()
  bindEvents()
}

function getBookProgress(book) {
  const savedProgress = getReadingProgress(book.id)
  if (savedProgress === null) return { current: 0, total: book.chapters.length, percentage: 0 }
  return {
    current: savedProgress + 1,
    total: book.chapters.length,
    percentage: Math.round(((savedProgress + 1) / book.chapters.length) * 100)
  }
}

function renderBooks() {
  masonryGrid.innerHTML = ''
  books.forEach(book => {
    const progress = getBookProgress(book)
    const card = document.createElement('div')
    card.className = 'book-card'
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" class="book-cover">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
        <div class="progress-text">${progress.current}/${progress.total}章 (${progress.percentage}%)</div>
      </div>
    `
    card.addEventListener('click', () => openBook(book))
    masonryGrid.appendChild(card)
  })
}

function openBook(book) {
  currentBook = book
  const savedProgress = getReadingProgress(book.id)
  currentChapterIndex = savedProgress !== null ? savedProgress : 0
  
  bookTitle.textContent = book.title
  totalChaptersEl.textContent = book.chapters.length
  
  renderChapter()
  
  bookshelf.classList.add('hidden')
  reader.classList.remove('hidden')
}

function closeBook() {
  if (currentBook) {
    saveReadingProgress(currentBook.id, currentChapterIndex)
  }
  
  reader.classList.add('hidden')
  bookshelf.classList.remove('hidden')
  settingsPanel.classList.add('hidden')
  currentBook = null
  renderBooks()
}

function renderChapter(animation = '') {
  const chapter = currentBook.chapters[currentChapterIndex]
  const paragraphs = chapter.content.split('\n\n').map(p => `<p>${p}</p>`).join('')
  
  chapterContainer.innerHTML = `
    <h3>${chapter.title}</h3>
    ${paragraphs}
  `
  chapterContainer.style.fontSize = `${fontSize}px`
  reader.style.backgroundColor = bgColor
  
  if (animation === 'left') {
    chapterContainer.classList.add('swipe-left')
    setTimeout(() => chapterContainer.classList.remove('swipe-left'), 300)
  } else if (animation === 'right') {
    chapterContainer.classList.add('swipe-right')
    setTimeout(() => chapterContainer.classList.remove('swipe-right'), 300)
  }
  
  currentChapterEl.textContent = currentChapterIndex + 1
  
  if (currentBook) {
    saveReadingProgress(currentBook.id, currentChapterIndex)
  }
}

function nextChapter() {
  if (currentChapterIndex < currentBook.chapters.length - 1) {
    currentChapterIndex++
    renderChapter('left')
  }
}

function prevChapter() {
  if (currentChapterIndex > 0) {
    currentChapterIndex--
    renderChapter('right')
  }
}

function toggleSettings() {
  settingsPanel.classList.toggle('hidden')
}

function decreaseFontSize() {
  if (fontSize > 12) {
    fontSize -= 2
    updateFontSize()
  }
}

function increaseFontSize() {
  if (fontSize < 28) {
    fontSize += 2
    updateFontSize()
  }
}

function updateFontSize() {
  fontSizeDisplay.textContent = fontSize
  chapterContainer.style.fontSize = `${fontSize}px`
  saveSettings()
}

function setBgColor(color) {
  bgColor = color
  reader.style.backgroundColor = bgColor
  bgColorOptions.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === color)
  })
  saveSettings()
}

function saveSettings() {
  localStorage.setItem('novelReaderSettings', JSON.stringify({
    fontSize,
    bgColor
  }))
}

function loadSettings() {
  const saved = localStorage.getItem('novelReaderSettings')
  if (saved) {
    const settings = JSON.parse(saved)
    fontSize = settings.fontSize || 16
    bgColor = settings.bgColor || '#f5f5dc'
    fontSizeDisplay.textContent = fontSize
    setBgColor(bgColor)
  }
}

function saveReadingProgress(bookId, chapterIndex) {
  const progress = JSON.parse(localStorage.getItem('novelReaderProgress') || '{}')
  progress[bookId] = chapterIndex
  localStorage.setItem('novelReaderProgress', JSON.stringify(progress))
}

function getReadingProgress(bookId) {
  const progress = JSON.parse(localStorage.getItem('novelReaderProgress') || '{}')
  return progress[bookId] !== undefined ? progress[bookId] : null
}

function bindEvents() {
  backBtn.addEventListener('click', closeBook)
  settingsBtn.addEventListener('click', toggleSettings)
  
  fontDecreaseBtn.addEventListener('click', decreaseFontSize)
  fontIncreaseBtn.addEventListener('click', increaseFontSize)
  
  bgColorOptions.forEach(btn => {
    btn.addEventListener('click', () => setBgColor(btn.dataset.color))
  })
  
  let touchStartX = 0
  let touchEndX = 0
  
  reader.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
  }, { passive: true })
  
  reader.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  }, { passive: true })
  
  reader.addEventListener('click', (e) => {
    if (e.target.closest('.settings-panel') || 
        e.target.closest('.reader-header') ||
        e.target.closest('.page-indicator')) {
      return
    }
    
    const screenWidth = window.innerWidth
    const clickX = e.clientX
    
    if (clickX < screenWidth / 3) {
      prevChapter()
    } else if (clickX > screenWidth * 2 / 3) {
      nextChapter()
    }
  })
}

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchEndX - touchStartX
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      prevChapter()
    } else {
      nextChapter()
    }
  }
}

init()
