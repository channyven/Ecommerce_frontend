<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const locale = useLocaleStore()

onMounted(() => { if (auth.isAuthenticated) cart.fetchCart() })

async function updateQty(item, qty) {
  if (qty < 1) return
  await cart.updateItem(item.id, qty, item.product_id)
}

async function removeItem(item) {
  await cart.removeItem(item.id)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('cart.title') }}</h1>
      <div class="divider-rose w-16 mt-3"></div>
    </div>

    <LoadingSpinner v-if="cart.loading" />

    <div v-else-if="!auth.isAuthenticated" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('cart.login_needed') }}</p>
      <router-link to="/login" class="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full font-medium transition inline-block shadow-rose">{{ locale.t('cart.login_btn') }}</router-link>
    </div>

    <div v-else-if="cart.items.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 text-rose-200 dark:text-rose-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
      </svg>
      <p class="text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('cart.empty') }}</p>
      <router-link to="/products" class="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full font-medium transition inline-block shadow-rose">{{ locale.t('cart.shop') }}</router-link>
    </div>

    <div v-else class="space-y-6">
      <!-- Cart Items -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-rose divide-y divide-rose-50 dark:divide-rose-900/20">
        <div v-for="item in cart.items" :key="item.id" class="p-4 flex items-center gap-4">
          <div class="w-20 h-20 bg-rose-50/50 dark:bg-gray-800 rounded-xl overflow-hidden border border-rose-100 dark:border-rose-900/30 flex-shrink-0">
            <img v-if="item.product?.image" :src="item.product.image" :alt="item.product.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-800"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          </div>
          <div class="flex-1 min-w-0">
            <router-link :to="`/products/${item.product?.slug}`" class="font-medium text-gray-700 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 text-sm transition">{{ item.product?.name || 'Product' }}</router-link>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">${{ item.product?.price.toFixed(2) }} {{ locale.t('cart.each') }}</p>
          </div>
          <div class="flex items-center border border-rose-200 dark:border-rose-800/50 rounded-full overflow-hidden">
            <button @click="updateQty(item, item.quantity - 1)" class="px-2.5 py-1.5 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm">−</button>
            <span class="px-3 py-1.5 text-sm font-medium border-x border-rose-200 dark:border-rose-800/50 min-w-[2rem] text-center text-gray-700 dark:text-white dark:bg-gray-800">{{ item.quantity }}</span>
            <button @click="updateQty(item, item.quantity + 1)" class="px-2.5 py-1.5 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm">+</button>
          </div>
          <p class="font-medium text-gray-800 dark:text-white w-24 text-right">${{ item.subtotal.toFixed(2) }}</p>
          <button @click="removeItem(item)" class="text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-500 dark:text-gray-400">{{ locale.t('cart.subtotal') }}</span>
          <span class="font-semibold text-gray-800 dark:text-white">${{ cart.total.toFixed(2) }}</span>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('cart.shipping_note') }}</p>
        <router-link to="/checkout" class="block w-full bg-rose-400 hover:bg-rose-500 text-white text-center py-3 rounded-full font-medium transition shadow-rose">
          {{ locale.t('cart.checkout') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
