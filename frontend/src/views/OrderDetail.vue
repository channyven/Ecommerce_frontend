<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const locale = useLocaleStore()
const order = ref(null)
const loading = ref(true)

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

onMounted(async () => {
  try {
    const { data } = await api.get(`/orders/${route.params.id}`)
    order.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <router-link to="/orders" class="text-sm text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 mb-4 inline-flex items-center gap-1 transition">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      {{ locale.t('orders.back') }}
    </router-link>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="!order" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-500">{{ locale.t('orders.not_found') }}</p>
    </div>

    <template v-else>
      <div class="flex items-center justify-between mb-6">
        <div>
          <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('orders.items_label') }} {{ order.order_number }}</h1>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">{{ new Date(order.created_at).toLocaleDateString(locale.locale === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border" :class="statusClass(order.status)">{{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span class="text-rose-400">✦</span>
              {{ locale.t('orders.items_label') }}
            </h2>
            <table class="w-full text-sm">
              <thead><tr class="text-left text-gray-400 dark:text-gray-500 border-b border-rose-100 dark:border-rose-900/30"><th class="pb-3 font-medium">{{ locale.t('orders.product') }}</th><th class="pb-3 font-medium text-right">{{ locale.t('orders.price') }}</th><th class="pb-3 font-medium text-center">{{ locale.t('orders.qty') }}</th><th class="pb-3 font-medium text-right">{{ locale.t('orders.total') }}</th></tr></thead>
              <tbody class="divide-y divide-rose-50 dark:divide-rose-900/20">
                <tr v-for="item in order.items" :key="item.product_name">
                  <td class="py-3 text-gray-700 dark:text-gray-200">{{ item.product_name }}</td>
                  <td class="py-3 text-right text-gray-500 dark:text-gray-400">${{ item.unit_price.toFixed(2) }}</td>
                  <td class="py-3 text-center text-gray-500 dark:text-gray-400">{{ item.quantity }}</td>
                  <td class="py-3 text-right font-medium text-gray-800 dark:text-white">${{ item.subtotal.toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr><td colspan="3" class="pt-3 text-right text-gray-400 dark:text-gray-500">{{ locale.t('orders.subtotal') }}</td><td class="pt-3 text-right text-gray-800 dark:text-white">${{ order.subtotal.toFixed(2) }}</td></tr>
                <tr v-if="order.shipping_amount > 0"><td colspan="3" class="text-right text-gray-400 dark:text-gray-500">{{ locale.t('orders.shipping') }}</td><td class="text-right text-gray-800 dark:text-white">${{ order.shipping_amount.toFixed(2) }}</td></tr>
                <tr v-if="order.tax_amount > 0"><td colspan="3" class="text-right text-gray-400 dark:text-gray-500">{{ locale.t('orders.tax') }}</td><td class="text-right text-gray-800 dark:text-white">${{ order.tax_amount.toFixed(2) }}</td></tr>
                <tr v-if="order.discount_amount > 0"><td colspan="3" class="text-right text-green-600 dark:text-green-400">{{ locale.t('orders.discount') }}</td><td class="text-right text-green-600 dark:text-green-400">-${{ order.discount_amount.toFixed(2) }}</td></tr>
                <tr class="border-t border-rose-100 dark:border-rose-900/30"><td colspan="3" class="pt-2 text-right font-semibold text-gray-800 dark:text-white">{{ locale.t('orders.total') }}</td><td class="pt-2 text-right font-bold text-gray-800 dark:text-white">${{ order.total.toFixed(2) }}</td></tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-rose-400">✦</span>
              {{ locale.t('orders.details') }}
            </h2>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between"><span class="text-gray-400 dark:text-gray-500">{{ locale.t('orders.payment') }}</span><span class="font-medium text-gray-700 dark:text-gray-200 capitalize">{{ order.payment_status }}</span></div>
              <div class="flex justify-between"><span class="text-gray-400 dark:text-gray-500">{{ locale.t('orders.method') }}</span><span class="font-medium text-gray-700 dark:text-gray-200">{{ order.payment_method || 'N/A' }}</span></div>
            </dl>
          </div>

          <div v-if="order.shipping_address" class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
            <h2 class="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-rose-400">✦</span>
              {{ locale.t('orders.shipping_address') }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.shipping_address.full_name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.shipping_address.address_line1 }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{ order.shipping_address.postal_code }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.shipping_address.country }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
