<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const locale = useLocaleStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const auth = useAuthStore()

const product = ref(null)
const loading = ref(true)
const addingToCart = ref(false)
const quantity = ref(1)

const isInWish = computed(() => wishlist.isInWishlist(product.value?.id))

onMounted(async () => {
  try {
    const { data } = await api.get(`/products/${route.params.slug}`)
    product.value = data.data
  } catch {
    router.push('/products')
  } finally {
    loading.value = false
  }
})

async function addToCart() {
  if (!auth.isAuthenticated) { router.push('/login'); return }
  addingToCart.value = true
  const result = await cart.addItem(product.value.id, quantity.value)
  addingToCart.value = false
  if (result.success) {
    quantity.value = 1
  }
}

async function toggleWishlist() {
  if (!auth.isAuthenticated) { router.push('/login'); return }
  if (isInWish.value) await wishlist.removeItem(product.value.id)
  else await wishlist.addItem(product.value.id)
}

function primaryImage() {
  return product.value.images?.find((i) => i.is_primary) || product.value.images?.[0]
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <LoadingSpinner v-if="loading" />
    <template v-else-if="product">
      <router-link to="/products" class="text-sm text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 mb-4 inline-flex items-center gap-1 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ locale.t('detail.back') }}
      </router-link>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
        <!-- Images -->
        <div>
          <div class="aspect-square bg-rose-50/50 dark:bg-gray-800 rounded-2xl border border-rose-100 dark:border-rose-900/30 overflow-hidden">
            <img v-if="primaryImage()" :src="primaryImage().url" :alt="product.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-900/40">
              <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
          </div>
          <div v-if="product.images?.length > 1" class="flex gap-2 mt-3 overflow-x-auto pb-2">
            <img v-for="img in product.images" :key="img.id" :src="img.url" :alt="img.alt || product.name"
                 class="w-20 h-20 object-cover rounded-xl border-2 cursor-pointer transition flex-shrink-0"
                 :class="{ 'border-rose-400 dark:border-rose-500': img.is_primary, 'border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700': !img.is_primary }">
          </div>
        </div>

        <!-- Info -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-rose-400 text-sm">✦</span>
            <p v-if="product.category" class="text-sm text-rose-500 dark:text-rose-400 font-medium uppercase tracking-wider">{{ product.category.name }}</p>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{{ product.name }}</h1>

          <div class="flex items-baseline gap-3 mt-4">
            <span class="text-3xl font-bold text-gray-800 dark:text-white">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.has_discount" class="text-xl text-gray-400 dark:text-gray-500 line-through">${{ product.compare_price.toFixed(2) }}</span>
            <span v-if="product.has_discount" class="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-sm font-medium px-2.5 py-0.5 rounded-full">-{{ product.discount_percent }}%</span>
          </div>

          <div class="mt-4 flex items-center gap-3 text-sm">
            <span :class="product.in_stock ? 'text-green-600 dark:text-green-400' : 'text-rose-500 dark:text-rose-400'" class="font-medium">
              <span class="inline-block w-2 h-2 rounded-full mr-1.5" :class="product.in_stock ? 'bg-green-500' : 'bg-rose-400'"></span>
              {{ product.in_stock ? locale.t('detail.in_stock') : locale.t('detail.out_of_stock') }}
            </span>
            <span v-if="product.in_stock" class="text-gray-400 dark:text-gray-500">({{ product.quantity }} {{ locale.t('detail.available') }})</span>
          </div>

          <p v-if="product.short_description" class="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed">{{ product.short_description }}</p>

          <!-- Add to Cart -->
          <div class="flex items-center gap-3 mt-6">
            <div class="flex border border-rose-200 dark:border-rose-800/50 rounded-full overflow-hidden">
              <button @click="quantity = Math.max(1, quantity - 1)" class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">−</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.quantity"
                     class="w-14 text-center border-x border-rose-200 dark:border-rose-800/50 text-sm py-2 outline-none bg-white dark:bg-gray-800 text-gray-700 dark:text-white" />
              <button @click="quantity = Math.min(product.quantity, quantity + 1)" class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">+</button>
            </div>
            <button @click="addToCart" :disabled="addingToCart || !product.in_stock"
                    class="flex-1 bg-rose-400 hover:bg-rose-500 text-white py-2.5 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-rose">
              {{ addingToCart ? locale.t('detail.adding') : locale.t('detail.add_to_cart') }}
            </button>
            <button @click="toggleWishlist" class="p-2.5 rounded-full border transition"
                    :class="isInWish ? 'border-rose-200 dark:border-rose-800 text-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-rose-200 dark:border-rose-800/50 text-gray-400 dark:text-gray-500 hover:text-rose-500'">
              <svg class="w-5 h-5" :fill="isInWish ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="mt-8 border-t border-rose-100 dark:border-rose-900/30 pt-6">
            <h3 class="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <span class="text-rose-400">✦</span>
              {{ locale.t('detail.description') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Reviews Summary -->
          <div v-if="product.reviews_summary" class="mt-8 border-t border-rose-100 dark:border-rose-900/30 pt-6">
            <h3 class="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <span class="text-rose-400">✦</span>
              {{ locale.t('detail.reviews') }} ({{ product.reviews_summary.total }})
            </h3>
            <div v-if="product.reviews_summary.total > 0" class="space-y-2">
              <div v-for="(count, rating) in product.reviews_summary.ratings" :key="rating" class="text-sm text-gray-500 dark:text-gray-400">
                <span class="text-amber-400">{{ '★'.repeat(Number(rating)) }}{{ '☆'.repeat(5 - Number(rating)) }}</span>
                {{ count }} {{ locale.t('detail.reviews_label') }}
              </div>
            </div>
            <p v-else class="text-sm text-gray-400 dark:text-gray-500">{{ locale.t('detail.no_reviews') }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
