<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const locale = useLocaleStore()
const featuredProducts = ref([])
const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products', { params: { featured: true, per_page: 8 } }),
      api.get('/categories'),
    ])
    featuredProducts.value = prodRes.data.data ?? []
    categories.value = catRes.data.data ?? []
  } catch (e) {
    console.error('Failed to load homepage data', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-skincare-gradient relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-20 left-10 w-64 h-64 bg-rose-200/30 dark:bg-rose-800/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 right-20 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-40 right-1/3 w-32 h-32 bg-amber-200/20 dark:bg-amber-800/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div class="max-w-2xl">
          <!-- Leaf decoration -->
          <div class="flex items-center gap-2 mb-4">
            <span class="text-rose-400 dark:text-rose-500 text-lg">✦</span>
            <span class="text-rose-500 dark:text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
            <span class="text-rose-400 dark:text-rose-500 text-lg">✦</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white leading-tight whitespace-pre-line">
            {{ locale.t('home.hero.title') }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
            {{ locale.t('home.hero.subtitle') }}
          </p>
          <div class="flex gap-3">
            <router-link to="/products" class="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3.5 rounded-full font-medium transition shadow-rose-lg hover:shadow-rose-xl">
              {{ locale.t('home.hero.shop') }}
            </router-link>
            <router-link to="/products?featured=1" class="border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-300 px-8 py-3.5 rounded-full font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition">
              {{ locale.t('home.hero.featured') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-10">
        <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ locale.t('home.categories.title') }}</h2>
        <div class="divider-rose w-20 mx-auto mt-4"></div>
      </div>

      <div v-if="loading" class="flex justify-center"><LoadingSpinner /></div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <router-link
          v-for="cat in categories" :key="cat.id"
          :to="`/products?category_id=${cat.id}`"
          class="group bg-white dark:bg-gray-800/80 rounded-2xl p-6 text-center border border-rose-100 dark:border-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-rose-lg transition-all duration-300"
        >
          <div class="w-12 h-12 mx-auto mb-3 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
            <svg class="w-6 h-6 text-rose-400 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <p class="font-medium text-gray-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">{{ cat.name }}</p>
          <p v-if="cat.products_count" class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ cat.products_count }} {{ locale.t('home.categories.items') }}</p>
        </router-link>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="bg-white dark:bg-gray-900/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-10">
          <div>
            <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('home.hero.featured') }}</span>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ locale.t('home.featured.title') }}</h2>
            <div class="divider-rose w-20 mt-4"></div>
          </div>
          <router-link to="/products?featured=1" class="hidden sm:inline-flex items-center gap-1 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium text-sm transition">
            {{ locale.t('home.featured.view') }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </router-link>
        </div>

        <div v-if="loading" class="flex justify-center"><LoadingSpinner /></div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard v-for="p in featuredProducts" :key="p.id" :product="p" />
        </div>

        <div class="mt-8 text-center sm:hidden">
          <router-link to="/products?featured=1" class="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium text-sm transition">
            {{ locale.t('home.featured.view') }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Brand Promise Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-skincare-gradient rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-rose-200/40 dark:bg-rose-800/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/30 dark:bg-pink-900/15 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div class="relative max-w-2xl">
          <span class="text-rose-500 dark:text-rose-300 text-3xl">✦</span>
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{{ locale.t('home.banner.title') }}</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{{ locale.t('home.banner.text') }}</p>
          <router-link to="/products" class="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition text-sm">
            {{ locale.t('home.banner.cta') }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
