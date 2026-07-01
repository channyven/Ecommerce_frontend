<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { useLocaleStore } from '../stores/locale'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const theme = useThemeStore()
const locale = useLocaleStore()
const router = useRouter()
const mobileOpen = ref(false)
const cartDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}

function handleSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push({ name: 'products', query: { q } })
    searchQuery.value = ''
    mobileOpen.value = false
  }
}

function toggleCartDropdown() {
  cartDropdownOpen.value = !cartDropdownOpen.value
}

function closeCartDropdown() {
  cartDropdownOpen.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    cartDropdownOpen.value = false
  }
}

function toggleLang() {
  locale.setLocale(locale.locale === 'en' ? 'km' : 'en')
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <nav class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-rose-100 dark:border-rose-900/30 sticky top-0 z-50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl text-rose-400">✦</span>
          <span class="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
            {{ locale.t('site.name') }}
          </span>
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-3 ml-8 flex-1 justify-end">
          <!-- Search Bar -->
          <form @submit.prevent="handleSearch" class="relative flex-1 max-w-xs">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="locale.t('search.placeholder')"
              class="w-full pl-9 pr-3 py-2 text-sm border border-rose-200 dark:border-rose-800/50 rounded-full focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 focus:border-rose-300 dark:focus:border-rose-700 outline-none transition bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            >
            <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300 dark:text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </form>

          <router-link to="/products" class="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 font-medium">{{ locale.t('nav.products') }}</router-link>

          <template v-if="auth.isAuthenticated">
            <router-link to="/wishlist" class="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 font-medium">{{ locale.t('nav.wishlist') }}</router-link>
            <router-link to="/orders" class="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 font-medium">{{ locale.t('nav.orders') }}</router-link>
            <router-link to="/profile" class="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 font-medium">{{ locale.t('nav.profile') }}</router-link>
          </template>

          <!-- Theme Toggle -->
          <button @click="theme.toggle" class="p-1.5 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0" :title="theme.isDark ? 'Light mode' : 'Dark mode'">
            <svg v-if="theme.isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <!-- Language Toggle -->
          <button @click="toggleLang" :aria-label="locale.locale === 'en' ? 'Switch to Khmer' : 'ប្តូរទៅជាភាសាអង់គ្លេស'" :title="locale.locale === 'en' ? 'Khmer' : 'English'" class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 border border-rose-200 dark:border-rose-800/50 rounded-full px-3 py-1 min-w-[36px] text-center">
            {{ locale.locale === 'en' ? 'KH' : 'EN' }}
          </button>

          <!-- Cart with Dropdown -->
          <div ref="dropdownRef" class="relative shrink-0">
            <button @click="toggleCartDropdown" class="relative text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              <span v-if="cart.count > 0" class="absolute -top-1.5 -right-1.5 bg-rose-400 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {{ cart.count }}
              </span>
            </button>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="cartDropdownOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl border border-rose-100 dark:border-rose-900/30 shadow-xl overflow-hidden">
                <!-- Header -->
                <div class="px-4 py-3 border-b border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
                  <p class="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                    </svg>
                    {{ locale.t('nav.cart') }}
                  </p>
                  <p v-if="cart.count > 0" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 ml-6">{{ cart.count }} {{ cart.count !== 1 ? locale.t('nav.cart.items') : locale.t('nav.cart.item') }}</p>
                </div>

                <!-- Items -->
                <div v-if="cart.items.length > 0" class="max-h-72 overflow-y-auto divide-y divide-rose-50 dark:divide-rose-900/20">
                  <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3 px-4 py-3 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition">
                    <router-link :to="{ name: 'product-detail', params: { slug: item.product?.slug || item.product_id } }" @click="closeCartDropdown" class="shrink-0">
                      <img
                        v-if="item.product?.image"
                        :src="item.product.image"
                        :alt="item.product.name"
                        class="w-12 h-12 object-cover rounded-xl border border-rose-100 dark:border-rose-900/30"
                      >
                      <div v-else class="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-center text-rose-300 dark:text-rose-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    </router-link>
                    <div class="flex-1 min-w-0">
                      <router-link
                        :to="{ name: 'product-detail', params: { slug: item.product?.slug || item.product_id } }"
                        @click="closeCartDropdown"
                        class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate block hover:text-rose-500 dark:hover:text-rose-400"
                      >
                        {{ item.product?.name || 'Product' }}
                      </router-link>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ locale.t('nav.cart.qty') }}: {{ item.quantity }} × ${{ (item.product?.price || 0).toFixed(2) }}</p>
                    </div>
                    <p class="text-sm font-medium text-gray-800 dark:text-white shrink-0">${{ (item.subtotal || 0).toFixed(2) }}</p>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="px-4 py-10 text-center">
                  <svg class="w-10 h-10 mx-auto text-rose-200 dark:text-rose-800 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
                  </svg>
                  <p class="text-sm text-gray-400 dark:text-gray-500">{{ locale.t('nav.cart.empty') }}</p>
                  <router-link @click="closeCartDropdown" to="/products" class="mt-2 inline-block text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition">
                    {{ locale.t('nav.cart.start') }}
                  </router-link>
                </div>

                <!-- Footer -->
                <div v-if="cart.items.length > 0" class="border-t border-rose-100 dark:border-rose-900/30 px-4 py-3 space-y-3 bg-rose-50/30 dark:bg-rose-900/5">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500 dark:text-gray-400">{{ locale.t('nav.cart.total') }}</span>
                    <span class="font-semibold text-gray-800 dark:text-white">${{ cart.total.toFixed(2) }}</span>
                  </div>
                  <div class="flex gap-2">
                    <router-link
                      @click="closeCartDropdown"
                      to="/cart"
                      class="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-full border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                    >
                      {{ locale.t('nav.cart.view') }}
                    </router-link>
                    <router-link
                      @click="closeCartDropdown"
                      to="/checkout"
                      class="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition"
                    >
                      {{ locale.t('nav.cart.checkout') }}
                    </router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <template v-if="!auth.isAuthenticated">
            <router-link to="/login" class="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition shrink-0 font-medium">{{ locale.t('nav.login') }}</router-link>
            <router-link to="/register" class="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded-full text-sm font-medium transition shrink-0 shadow-rose">{{ locale.t('nav.signup') }}</router-link>
          </template>
          <button v-else @click="handleLogout" class="text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition shrink-0 font-medium">{{ locale.t('nav.logout') }}</button>
        </div>

        <!-- Mobile: icons + Hamburger -->
        <div class="flex items-center gap-2 md:hidden">
          <!-- Mobile Theme -->
          <button @click="theme.toggle" class="p-1.5 text-gray-400 dark:text-gray-500 hover:text-rose-500">
            <svg v-if="theme.isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <!-- Mobile Lang -->
          <button @click="toggleLang" class="text-xs font-semibold uppercase border border-rose-200 dark:border-rose-800/50 rounded-full px-2 py-1 text-gray-400 dark:text-gray-500 hover:text-rose-500 min-w-[36px] text-center">
            {{ locale.locale === 'en' ? 'KH' : 'EN' }}
          </button>
          <router-link to="/cart" class="relative text-gray-400 dark:text-gray-500 p-1">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span v-if="cart.count > 0" class="absolute -top-1 -right-1 bg-rose-400 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">{{ cart.count }}</span>
          </router-link>
          <button @click="mobileOpen = !mobileOpen" class="p-2 text-gray-400 dark:text-gray-500 hover:text-rose-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" stroke-linecap="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="mobileOpen" class="md:hidden pb-4 space-y-1">
          <form @submit.prevent="handleSearch" class="px-3 pb-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="locale.t('search.placeholder')"
                class="w-full pl-9 pr-16 py-2.5 text-sm border border-rose-200 dark:border-rose-800/50 rounded-full focus:ring-2 focus:ring-rose-300 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100 placeholder:text-gray-400"
              >
              <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-300 dark:text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button type="submit" class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-white bg-rose-400 hover:bg-rose-500 rounded-full transition">
                {{ locale.t('mobile.search') }}
              </button>
            </div>
          </form>

          <router-link @click="mobileOpen = false" to="/products" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.products') }}</router-link>
          <router-link @click="mobileOpen = false" to="/cart" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.cart') }} ({{ cart.count }})</router-link>
          <template v-if="auth.isAuthenticated">
            <router-link @click="mobileOpen = false" to="/wishlist" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.wishlist') }}</router-link>
            <router-link @click="mobileOpen = false" to="/orders" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.orders') }}</router-link>
            <router-link @click="mobileOpen = false" to="/profile" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.profile') }}</router-link>
            <button @click="handleLogout" class="block w-full text-left px-3 py-2 text-sm text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.logout') }}</button>
          </template>
          <template v-else>
            <router-link @click="mobileOpen = false" to="/login" class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg font-medium">{{ locale.t('nav.login') }}</router-link>
            <router-link @click="mobileOpen = false" to="/register" class="block px-3 py-2 text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">{{ locale.t('nav.signup') }}</router-link>
          </template>
        </div>
      </Transition>
    </div>
  </nav>
</template>
