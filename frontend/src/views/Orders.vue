<script setup>
import { ref, onMounted } from 'vue'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const locale = useLocaleStore()
const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get('/orders')
    orders.value = data.data ?? []
  } catch { /* ignore */ }
  finally { loading.value = false }
})

function statusClass(status) {
  const map = {
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    processing: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  }
  return map[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('orders.title') }}</h1>
      <div class="divider-rose w-16 mt-3"></div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="orders.length === 0" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('orders.empty') }}</p>
      <router-link to="/products" class="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full font-medium transition inline-block shadow-rose">{{ locale.t('orders.shop') }}</router-link>
    </div>

    <div v-else class="space-y-4">
      <router-link v-for="order in orders" :key="order.id" :to="`/orders/${order.id}`"
                   class="block bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-5 hover:shadow-rose-lg transition">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800 dark:text-white">{{ order.order_number }}</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{{ new Date(order.created_at).toLocaleDateString(locale.locale === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border" :class="statusClass(order.status)">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
            <p class="font-bold text-gray-800 dark:text-white mt-1">${{ order.total.toFixed(2) }}</p>
          </div>
        </div>
        <div class="mt-3 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          {{ order.items?.length || 0 }} {{ locale.t('orders.items') }}
        </div>
      </router-link>
    </div>
  </div>
</template>
