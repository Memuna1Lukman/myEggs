const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const isForm = options.body instanceof URLSearchParams || options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || 'Something went wrong. Please try again.')
  }
  return response.status === 204 ? null : response.json()
}

export const authApi = {
  register: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  login: (phone, password) => apiFetch('/auth/login', {
    method: 'POST',
    body: new URLSearchParams({ username: phone, password }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/me'),
}
