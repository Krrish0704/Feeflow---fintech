const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    let message = 'API request failed'
    if (Array.isArray(data.detail)) {
      message = data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
    } else if (typeof data.detail === 'string') {
      message = data.detail
    } else if (data.message) {
      message = data.message
    }
    throw new Error(message)
  }

  return data
}