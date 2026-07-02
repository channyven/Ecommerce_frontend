<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocaleStore } from '../stores/locale'
import api from '../api/client'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const locale = useLocaleStore()
const products = ref([])
const categories = ref([])
const loading = ref(true)
const meta = ref({})

const searchQuery = ref(route.query.q || '')
const filters = ref({
  category_id: route.query.category_id || '',
  featured: route.query.featured || '',
  sort: route.query.sort || 'latest',
})

const sortOptions = computed(() => [
  { value: 'latest', label: locale.t('products.sort.latest') },
  { value: 'price_asc', label: locale.t('products.sort.price_asc') },
  { value: 'price_desc', label: locale.t('products.sort.price_desc') },
  { value: 'name_asc', label: locale.t('products.sort.name_asc') },
])

async function fetchProducts() {
  loading.value = true
  try {
    const params = { ...filters.value, per_page: 12 }
    if (params.featured === '') delete params.featured
    if (params.category_id === '') delete params.category_id
    if (route.query.q) params.q = route.query.q
    if (route.query.page) params.page = route.query.page

    const { data } = route.query.q
      ? await api.get('/products/search', { params: { q: route.query.q, per_page: 12, page: route.query.page || 1 } })
      : await api.get('/products', { params })

    products.value = data.data ?? []
    meta.value = data.meta ?? {}
  } catch (e) {
    console.error('Failed to load products', e)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const { data } = await api.get('/categories')
    const allLabel = locale.t('products.filter.all')
    categories.value = [{ id: '', name: allLabel }, ...(data.data ?? [])]
  } catch { /* ignore */ }
}

function applyFilters() {
  const q = searchQuery.value.trim()
  router.replace({ query: { ...filters.value, ...(q ? { q } : {}) } })
}

const paginationPages = computed(() => {
  const total = meta.value.last_page || 1
  const current = meta.value.current_page || 1

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []

  // Always show first page
  pages.push(1)

  // Ellipsis after first if current is far enough
  if (current > 3) {
    pages.push('...')
  }

  // Pages around current (window of 3)
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Ellipsis before last if current is far enough
  if (current < total - 2) {
    pages.push('...')
  }

  // Always show last page
  pages.push(total)

  return pages
})

function goToPage(page) {
  router.replace({ query: { ...route.query, page } })
}

function clearFilters() {
  filters.value = { category_id: '', featured: '', sort: 'latest' }
  searchQuery.value = ''
  router.replace({ query: {} })
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

watch(() => route.query, fetchProducts)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8 text-center md:text-left">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mt-1" v-if="route.query.q">{{ locale.t('products.search') }}: &quot;{{ route.query.q }}&quot;</h1>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mt-1" v-else>{{ locale.t('products.title') }}</h1>
      <div class="divider-rose w-20 mt-3 mx-auto md:mx-0"></div>
      <p class="text-gray-400 dark:text-gray-500 mt-2 text-sm" v-if="meta.total">{{ meta.total }} {{ locale.t('products.found') }}</p>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-4 mb-6 shadow-rose transition-colors">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[200px]">
          <input v-model="searchQuery" @keyup.enter="applyFilters" type="text" :placeholder="locale.t('search.placeholder')"
                 class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500">
        </div>
        <select v-model="filters.category_id" @change="applyFilters"
                class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="dark:bg-gray-800">{{ cat.name }}</option>
        </select>
        <select v-model="filters.sort" @change="applyFilters"
                class="px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value" class="dark:bg-gray-800">{{ opt.label }}</option>
        </select>
        <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input type="checkbox" v-model="filters.featured" true-value="1" false-value="" @change="applyFilters"
                 class="rounded border-rose-300 dark:border-rose-700 text-rose-500 focus:ring-rose-300 dark:focus:ring-rose-700 dark:bg-gray-800 cursor-pointer">
          {{ locale.t('products.featured') }}
        </label>
        <button @click="clearFilters" class="text-sm text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 px-3 py-2 font-medium">{{ locale.t('products.clear') }}</button>
      </div>
    </div>

    <!-- Products Grid -->
    <LoadingSpinner v-if="loading" />
    <div v-else-if="products.length === 0" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-500">{{ locale.t('products.none') }}</p>
      <button @click="clearFilters" class="mt-2 text-rose-500 dark:text-rose-400 underline text-sm hover:text-rose-600">{{ locale.t('products.clear_filters') }}</button>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="flex items-center justify-center gap-1 mt-10">
      <!-- Previous -->
      <button @click="goToPage(meta.current_page - 1)"
              :disabled="meta.current_page <= 1"
              class="px-3 py-2 rounded-full text-sm font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed"
              :class="meta.current_page <= 1 ? 'text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 border-rose-200 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-600 hover:text-rose-500 dark:hover:text-rose-400'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <!-- Page numbers with ellipsis -->
      <template v-for="(page, idx) in paginationPages" :key="idx">
        <span v-if="page === '...'" class="px-2 text-gray-400 dark:text-gray-500 select-none">…</span>
        <button v-else
                @click="goToPage(page)"
                class="w-10 h-10 rounded-full text-sm font-medium border transition"
                :class="page === meta.current_page ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200 dark:shadow-rose-900/30' : 'text-gray-500 dark:text-gray-400 border-rose-200 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-600 hover:text-rose-500 dark:hover:text-rose-400'">
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button @click="goToPage(meta.current_page + 1)"
              :disabled="meta.current_page >= meta.last_page"
              class="px-3 py-2 rounded-full text-sm font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed"
              :class="meta.current_page >= meta.last_page ? 'text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700' : 'text-gray-500 dark:text-gray-400 border-rose-200 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-600 hover:text-rose-500 dark:hover:text-rose-400'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</template>
