<script setup>
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const locale = useLocaleStore()
const router = useRouter()

onMounted(() => {
  if (!auth.isAuthenticated) router.push('/login')
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <span class="text-rose-400 text-sm font-medium tracking-widest uppercase">{{ locale.t('site.tagline') }}</span>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">{{ locale.t('profile.title') }}</h1>
      <div class="divider-rose w-16 mt-3"></div>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6 shadow-rose" v-if="auth.user">
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-rose-100 dark:border-rose-900/30">
        <div class="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-400 dark:text-rose-300 text-2xl font-bold">
          {{ auth.user.name?.charAt(0)?.toUpperCase() }}
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ auth.user.name }}</h2>
          <p class="text-sm text-gray-400 dark:text-gray-500">{{ auth.user.email }}</p>
        </div>
      </div>

      <dl class="space-y-4 text-sm">
        <div class="flex justify-between py-2 border-b border-rose-50 dark:border-rose-900/20">
          <dt class="text-gray-400 dark:text-gray-500">{{ locale.t('profile.email') }}</dt>
          <dd class="font-medium text-gray-700 dark:text-gray-200">{{ auth.user.email }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-rose-50 dark:border-rose-900/20">
          <dt class="text-gray-400 dark:text-gray-500">{{ locale.t('profile.phone') }}</dt>
          <dd class="font-medium text-gray-700 dark:text-gray-200">{{ auth.user.phone || locale.t('profile.not_provided') }}</dd>
        </div>
        <div class="flex justify-between py-2 border-b border-rose-50 dark:border-rose-900/20">
          <dt class="text-gray-400 dark:text-gray-500">{{ locale.t('profile.status') }}</dt>
          <dd class="font-medium text-gray-700 dark:text-gray-200 capitalize">{{ auth.user.status }}</dd>
        </div>
        <div class="flex justify-between py-2">
          <dt class="text-gray-400 dark:text-gray-500">{{ locale.t('profile.member_since') }}</dt>
          <dd class="font-medium text-gray-700 dark:text-gray-200">{{ new Date(auth.user.created_at).toLocaleDateString(locale.locale === 'km' ? 'km-KH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</dd>
        </div>
      </dl>

      <div class="mt-6 pt-6 border-t border-rose-100 dark:border-rose-900/30 flex gap-3">
        <router-link to="/orders" class="flex-1 text-center border border-rose-200 dark:border-rose-800/50 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition">{{ locale.t('profile.orders') }}</router-link>
        <router-link to="/wishlist" class="flex-1 text-center border border-rose-200 dark:border-rose-800/50 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition">{{ locale.t('profile.wishlist') }}</router-link>
      </div>
    </div>
  </div>
</template>
