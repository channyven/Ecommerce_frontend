import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'
import { useAuthStore } from './auth'
import { useToastStore } from './toast'
import { useLocaleStore } from './locale'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const toast = useToastStore()
  const locale = useLocaleStore()

  async function fetchWishlist() {
    if (!auth.isAuthenticated) return
    loading.value = true
    try {
      const { data } = await api.get('/wishlist')
      items.value = data.data ?? []
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function addItem(productId) {
    if (!auth.isAuthenticated) return { success: false, message: 'Please login first' }
    loading.value = true
    try {
      const { data } = await api.post('/wishlist', { product_id: productId })
      await fetchWishlist()
      toast.success(locale.t('toast.added_wishlist'))
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || locale.t('toast.added_wishlist')
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function removeItem(productId) {
    loading.value = true
    try {
      await api.delete(`/wishlist/${productId}`)
      items.value = items.value.filter((i) => i.product_id !== productId)
      toast.success(locale.t('toast.removed_wishlist'))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || locale.t('toast.removed_wishlist')
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  function isInWishlist(productId) {
    return items.value.some((i) => i.product_id === productId)
  }

  return { items, loading, fetchWishlist, addItem, removeItem, isInWishlist }
})
