<script setup>
import { onMounted } from 'vue'
import { useWishlistStore } from '../stores/wishlist'
import { useLocaleStore } from '../stores/locale'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const wishlist = useWishlistStore()
const locale = useLocaleStore()

onMounted(() => wishlist.fetchWishlist())

async function remove(productId) {
  await wishlist.removeItem(productId)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('wishlist.title') }}</h1>
      <div class="divider-rose w-16 mt-3"></div>
    </div>

    <LoadingSpinner v-if="wishlist.loading" />

    <div v-else-if="wishlist.items.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 text-rose-200 dark:text-rose-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
      <p class="text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('wishlist.empty') }}</p>
      <router-link to="/products" class="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full font-medium transition inline-block shadow-rose">{{ locale.t('wishlist.browse') }}</router-link>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="item in wishlist.items" :key="item.id" class="group bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 overflow-hidden hover:shadow-rose-lg transition">
        <router-link :to="`/products/${item.product?.slug}`" class="block">
          <div class="aspect-square bg-rose-50/50 dark:bg-gray-800">
            <img v-if="item.product?.image" :src="item.product.image" :alt="item.product.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-900/40"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          </div>
        </router-link>
        <div class="p-3">
          <router-link :to="`/products/${item.product?.slug}`" class="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 line-clamp-1 transition">{{ item.product?.name }}</router-link>
          <p class="text-sm font-bold text-gray-800 dark:text-white mt-1">${{ item.product?.price.toFixed(2) }}</p>
          <div class="flex gap-2 mt-2">
            <router-link :to="`/products/${item.product?.slug}`" class="flex-1 text-center bg-rose-400 hover:bg-rose-500 text-white text-xs py-2 rounded-full font-medium transition shadow-rose">{{ locale.t('wishlist.view') }}</router-link>
            <button @click="remove(item.product_id)" class="text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 transition p-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
