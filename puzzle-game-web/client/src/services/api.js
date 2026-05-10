const BASE_URL = '/api'

export async function getLeaderboard(difficulty = null, imageId = null) {
  const params = new URLSearchParams()
  if (difficulty) params.append('difficulty', difficulty)
  if (imageId) params.append('imageId', imageId)
  
  const queryString = params.toString()
  const url = queryString ? `${BASE_URL}/leaderboard?${queryString}` : `${BASE_URL}/leaderboard`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('获取排行榜失败')
  }
  return response.json()
}

export async function submitRecord(record) {
  const response = await fetch(`${BASE_URL}/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  })
  
  if (!response.ok) {
    throw new Error('提交记录失败')
  }
  return response.json()
}

export async function checkHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
