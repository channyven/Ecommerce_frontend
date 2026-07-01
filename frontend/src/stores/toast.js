import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 0

  function addToast(message, type = 'success', duration = 3500) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function success(message, duration) {
    return addToast(message, 'success', duration)
  }

  function error(message, duration) {
    return addToast(message, 'error', duration)
  }

  function info(message, duration) {
    return addToast(message, 'info', duration)
  }

  return { toasts, addToast, removeToast, success, error, info }
})
