export const articles = {
  zh: [
    {
      id: 'zh-1',
      title: '静夜思 - 李白',
      text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
    },
    {
      id: 'zh-2',
      title: '春晓 - 孟浩然',
      text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
    },
    {
      id: 'zh-3',
      title: '登鹳雀楼 - 王之涣',
      text: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
    },
    {
      id: 'zh-4',
      title: '望庐山瀑布 - 李白',
      text: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。'
    },
    {
      id: 'zh-5',
      title: '现代生活',
      text: '现代社会的快节奏生活让我们不得不提高工作效率。科技的发展改变了人们的交流方式，智能手机和互联网让信息传播变得前所未有的便捷。学习新技能已经成为每个人保持竞争力的必要条件。'
    }
  ],
  en: [
    {
      id: 'en-1',
      title: 'The Quick Brown Fox',
      text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!'
    },
    {
      id: 'en-2',
      title: 'Programming Quote',
      text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Refactoring is an essential part of software development.'
    },
    {
      id: 'en-3',
      title: 'Practice Makes Perfect',
      text: 'Practice makes perfect. The more you type, the faster and more accurate you will become. Keep practicing every day to improve your typing skills significantly.'
    },
    {
      id: 'en-4',
      title: 'Technology and Life',
      text: 'Technology has revolutionized the way we live and work. Computers and the internet have transformed communication, education, and business operations worldwide. Embracing digital literacy is crucial for success in the modern era.'
    },
    {
      id: 'en-5',
      title: 'Learning Journey',
      text: 'Learning is a continuous journey. Every expert was once a beginner. The key to success is persistence, curiosity, and the willingness to learn from mistakes. Never stop exploring and growing.'
    }
  ]
}

export function getArticlesByLanguage(lang) {
  return articles[lang] || []
}

export function getArticleById(lang, id) {
  const articlesList = articles[lang]
  return articlesList?.find(article => article.id === id) || null
}

export function getRandomArticle(lang) {
  const articlesList = articles[lang]
  if (!articlesList || articlesList.length === 0) return null
  const randomIndex = Math.floor(Math.random() * articlesList.length)
  return articlesList[randomIndex]
}
