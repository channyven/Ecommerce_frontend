import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userData = computed(() => user.value)

  async function fetchUser() {
    if (!token.value) return
    try {
      const { data } = await api.get('/user')
      user.value = data.user
    } catch {
      logout()
    }
  }

  async function login(email, password) {
    loading.value = true
    try {
      const { data } = await api.post('/login', { email, password })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      loading.value = false
    }
  }

  async function register(name, email, password, passwordConfirmation) {
    loading.value = true
    try {
      const { data } = await api.post('/register', {
        name, email, password, password_confirmation: passwordConfirmation,
      })
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch { /* ignore */ }
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  // Fetch user on store init if token exists
  if (token.value) fetchUser()

  return { user, token, loading, isAuthenticated, userData, fetchUser, login, register, logout }
})
