<script setup>
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useLocaleStore } from '../stores/locale'

const props = defineProps({
  product: { type: Object, required: true },
})

const wishlist = useWishlistStore()
const auth = useAuthStore()
const router = useRouter()
const locale = useLocaleStore()

async function toggleWishlist() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  if (wishlist.isInWishlist(props.product.id)) {
    await wishlist.removeItem(props.product.id)
  } else {
    await wishlist.addItem(props.product.id)
  }
}

const inWish = () => wishlist.isInWishlist(props.product.id)
</script>

<template>
  <div class="group bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 overflow-hidden hover:shadow-rose-lg transition-all duration-300">
    <router-link :to="`/products/${product.slug}`" class="block">
      <div class="aspect-square bg-rose-50/50 dark:bg-gray-800 relative overflow-hidden">
        <img
          v-if="product.primary_image"
          :src="product.primary_image"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-900/40">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        </div>
        <span v-if="product.has_discount" class="absolute top-2 left-2 bg-rose-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          -{{ product.discount_percent }}%
        </span>
        <!-- Wishlist overlay button -->
        <div class="absolute top-2 right-2">
          <button @click.prevent="toggleWishlist" class="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-sm transition" :class="{ 'text-rose-400': inWish(), 'text-gray-300 dark:text-gray-600': !inWish() }">
            <svg class="w-4 h-4" :fill="inWish() ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </router-link>

    <div class="p-4">
      <router-link :to="`/products/${product.slug}`">
        <h3 class="font-medium text-gray-800 dark:text-white text-sm line-clamp-2 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ product.name }}</h3>
      </router-link>
      <p v-if="product.short_description" class="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{{ product.short_description }}</p>
      <div class="flex items-center justify-between mt-3">
        <div class="flex items-baseline gap-1.5">
          <span class="text-lg font-bold text-gray-800 dark:text-white">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.has_discount" class="text-sm text-gray-400 dark:text-gray-500 line-through">${{ product.compare_price.toFixed(2) }}</span>
        </div>
      </div>
      <router-link
        :to="`/products/${product.slug}`"
        class="block w-full mt-3 bg-rose-400 hover:bg-rose-500 text-white text-sm py-2.5 rounded-full font-medium transition text-center shadow-rose"
      >
        {{ locale.t('card.view_details') }}
      </router-link>
    </div>
  </div>
</template>
