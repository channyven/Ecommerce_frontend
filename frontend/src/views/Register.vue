<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'

const router = useRouter()
const auth = useAuthStore()
const locale = useLocaleStore()

const form = ref({ name: '', email: '', password: '', password_confirmation: '' })
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  const result = await auth.register(form.value.name, form.value.email, form.value.password, form.value.password_confirmation)
  loading.value = false
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.message
  }
}
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 p-8 shadow-rose-lg transition-colors">
        <div class="text-center mb-6">
          <span class="text-2xl text-rose-400">✦</span>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ locale.t('register.title') }}</h1>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">{{ locale.t('register.subtitle') }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ locale.t('register.name') }}</label>
            <input v-model="form.name" type="text" required
                   class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ locale.t('register.email') }}</label>
            <input v-model="form.email" type="email" required
                   class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ locale.t('register.password') }}</label>
            <input v-model="form.password" type="password" required minlength="8"
                   class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{{ locale.t('register.confirm') }}</label>
            <input v-model="form.password_confirmation" type="password" required
                   class="w-full px-4 py-2.5 border border-rose-200 dark:border-rose-800/50 rounded-full text-sm focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 outline-none bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-100">
          </div>

          <p v-if="error" class="text-rose-500 text-sm text-center">{{ error }}</p>

          <button type="submit" :disabled="loading"
                  class="w-full bg-rose-400 hover:bg-rose-500 text-white py-2.5 rounded-full text-sm font-medium transition disabled:opacity-50 shadow-rose">
            {{ loading ? locale.t('register.loading') : locale.t('register.button') }}
          </button>
        </form>

        <p class="text-sm text-gray-400 dark:text-gray-500 text-center mt-6">
          {{ locale.t('register.has_account') }}
          <router-link to="/login" class="text-rose-500 dark:text-rose-400 font-medium hover:text-rose-600 dark:hover:text-rose-300">{{ locale.t('register.login_link') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
