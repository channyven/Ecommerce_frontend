<script setup>
import { useLocaleStore } from '../stores/locale'
const locale = useLocaleStore()
</script>

<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-rose-100 dark:border-rose-900/30 mt-16 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl text-rose-400">✦</span>
            <span class="text-lg font-bold text-gray-800 dark:text-white">{{ locale.t('site.name') }}</span>
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">{{ locale.t('footer.tagline') }}</p>
          <div class="flex items-center gap-3 text-rose-300 dark:text-rose-700">
            <span class="text-xl">✦</span>
            <span class="text-xl">✦</span>
            <span class="text-xl">✦</span>
          </div>
        </div>

        <!-- Shop -->
        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">{{ locale.t('footer.shop') }}</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/products" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('nav.products') }}</router-link></li>
            <li><router-link to="/wishlist" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('nav.wishlist') }}</router-link></li>
            <li><router-link to="/cart" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('nav.cart') }}</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wider">{{ locale.t('footer.support') }}</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('footer.faq') }}</a></li>
            <li><a href="#" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('footer.shipping_info') }}</a></li>
            <li><a href="#" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('footer.returns') }}</a></li>
            <li><a href="#" class="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition">{{ locale.t('footer.contact') }}</a></li>
          </ul>
        </div>
      </div>

      <div class="divider-rose mt-8 mb-6"></div>

      <div class="text-center text-sm text-gray-400 dark:text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ locale.t('site.name') }}. {{ locale.t('footer.rights') }}</p>
      </div>
    </div>
  </footer>
</template>
