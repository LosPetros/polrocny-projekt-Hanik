import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Actions
  
  // Fetch current user from session
  async function fetchMe() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include' // Important: send cookies with request
      })
      
      const data = await response.json()
      user.value = data.user
      
      return data.user
    } catch (err) {
      console.error('Fetch user error:', err)
      user.value = null
      error.value = 'Failed to fetch user'
    } finally {
      loading.value = false
    }
  }

  // Register new user
  async function register(name, email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Login user
  async function login(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important: receive and send cookies
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout user
  async function logout() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        user.value = null
      }
    } catch (err) {
      console.error('Logout error:', err)
      error.value = 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Actions
    fetchMe,
    register,
    login,
    logout,
    clearError
  }
})
