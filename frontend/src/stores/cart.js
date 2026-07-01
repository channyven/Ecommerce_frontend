import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/client'
import { useAuthStore } from './auth'
import { useToastStore } from './toast'
import { useLocaleStore } from './locale'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const auth = useAuthStore()
  const toast = useToastStore()
  const locale = useLocaleStore()

  const total = computed(() => items.value.reduce((sum, i) => sum + i.subtotal, 0))
  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  async function fetchCart() {
    if (!auth.isAuthenticated) return
    loading.value = true
    try {
      const { data } = await api.get('/cart')
      items.value = data.data.items ?? []
    } catch {
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function addItem(productId, quantity = 1) {
    if (!auth.isAuthenticated) return { success: false, message: 'Please login first' }
    loading.value = true
    try {
      const { data } = await api.post('/cart', { product_id: productId, quantity })
      items.value = data.data.items ?? []
      toast.success(locale.t('toast.added_cart'))
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || locale.t('toast.added_cart')
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function updateItem(cartItemId, quantity, productId) {
    loading.value = true
    try {
      const { data } = await api.put(`/cart/${cartItemId}`, { product_id: productId, quantity })
      items.value = data.data.items ?? []
      toast.success(locale.t('toast.cart_updated'))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || locale.t('toast.cart_updated')
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function removeItem(cartItemId) {
    loading.value = true
    try {
      const { data } = await api.delete(`/cart/${cartItemId}`)
      items.value = data.data.items ?? []
      toast.success(locale.t('toast.removed_cart'))
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || locale.t('toast.removed_cart')
      toast.error(msg)
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function clearLocal() {
    items.value = []
  }

  return { items, loading, total, count, fetchCart, addItem, updateItem, removeItem, clearLocal }
})
