<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const cart = useCartStore()
const toast = useToastStore()
const locale = useLocaleStore()
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const address = ref({
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: 'United States',
  postal_code: '',
})

const form = ref({
  shipping_address_id: null,
  billing_address_id: null,
  notes: '',
  payment_method: 'cod',
})

const estimatedTax = computed(() => cart.total * 0.08)
const estimatedShipping = computed(() => cart.total >= 100 ? 0 : 9.99)
const estimatedTotal = computed(() => cart.total + estimatedTax.value + estimatedShipping.value)

onMounted(async () => {
  if (!cart.items.length) await cart.fetchCart()
  loading.value = false
})

async function submitOrder() {
  error.value = ''

  if (!address.value.full_name || !address.value.address_line1 || !address.value.city || !address.value.country) {
    error.value = locale.t('checkout.error_address')
    return
  }

  submitting.value = true
  try {
    const payload = {
      shipping_address_id: 1,
      billing_address_id: 1,
      notes: form.value.notes,
      payment_method: form.value.payment_method,
    }

    const { data } = await api.post('/checkout', payload)
    await cart.clearLocal()
    toast.success(locale.t('toast.order_placed'))
    router.push(`/orders/${data.data.id}`)
  } catch (err) {
    error.value = err.response?.data?.message || locale.t('checkout.error_failed')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('checkout.title') }}</h1>
      <div class="divider-rose w-16 mt-3"></div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="cart.items.length === 0" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('checkout.empty') }}</p>
      <router-link to="/products" class="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full font-medium transition inline-block shadow-rose">{{ locale.t('checkout.shop') }}</router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Shipping Form -->
      <div class="lg:col-span-3 space-y-6">
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-rose-400">✦</span>
            {{ locale.t('checkout.shipping') }}
          </h2>
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input v-model="address.full_name" :placeholder="locale.t('checkout.full_name')" required
                     class="col-span-2 px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.phone" :placeholder="locale.t('checkout.phone')"
                     class="col-span-2 px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.address_line1" :placeholder="locale.t('checkout.address1')" required
                     class="col-span-2 px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.address_line2" :placeholder="locale.t('checkout.address2')"
                     class="col-span-2 px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.city" :placeholder="locale.t('checkout.city')" required
                     class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.state" :placeholder="locale.t('checkout.state')"
                     class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.postal_code" :placeholder="locale.t('checkout.postal')"
                     class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
              <input v-model="address.country" :placeholder="locale.t('checkout.country')" required
                     class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400">
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-rose-400">✦</span>
            {{ locale.t('checkout.payment') }}
          </h2>
          <select v-model="form.payment_method" class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
            <option value="cod" class="dark:bg-gray-800">{{ locale.t('checkout.cod') }}</option>
            <option value="bank_transfer" class="dark:bg-gray-800">{{ locale.t('checkout.bank') }}</option>
            <option value="card" class="dark:bg-gray-800">{{ locale.t('checkout.card') }}</option>
          </select>
        </div>

        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-rose-400">✦</span>
            {{ locale.t('checkout.notes') }}
          </h2>
          <textarea v-model="form.notes" rows="3" :placeholder="locale.t('checkout.notes_placeholder')"
                    class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400"></textarea>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 sticky top-24 shadow-rose">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span class="text-rose-400">✦</span>
            {{ locale.t('checkout.summary') }}
          </h2>

          <div class="space-y-2 text-sm">
            <div v-for="item in cart.items" :key="item.id" class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400 truncate mr-2">{{ item.product?.name }} × {{ item.quantity }}</span>
              <span class="font-medium text-gray-700 dark:text-gray-200">${{ item.subtotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="divider-rose mt-4 mb-4"></div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ locale.t('checkout.subtotal') }}</span>
              <span class="font-medium text-gray-700 dark:text-gray-200">${{ cart.total.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ locale.t('checkout.shipping') }}</span>
              <span class="font-medium text-gray-700 dark:text-gray-200">{{ estimatedShipping === 0 ? locale.t('checkout.free') : '$' + estimatedShipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ locale.t('checkout.tax') }}</span>
              <span class="font-medium text-gray-700 dark:text-gray-200">${{ estimatedTax.toFixed(2) }}</span>
            </div>
            <div class="divider-rose my-2"></div>
            <div class="flex justify-between text-base font-bold">
              <span class="text-gray-800 dark:text-white">{{ locale.t('checkout.total') }}</span>
              <span class="text-gray-800 dark:text-white">${{ estimatedTotal.toFixed(2) }}</span>
            </div>
          </div>

          <p v-if="error" class="text-rose-500 text-sm mt-3">{{ error }}</p>

          <button @click="submitOrder" :disabled="submitting"
                  class="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-full font-medium transition mt-4 disabled:opacity-50 shadow-rose">
            {{ submitting ? locale.t('checkout.processing') : locale.t('checkout.place') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
