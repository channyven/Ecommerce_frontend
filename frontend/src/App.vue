<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useWishlistStore } from './stores/wishlist'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import ToastContainer from './components/ToastContainer.vue'

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()

onMounted(() => {
  if (auth.isAuthenticated) {
    cart.fetchCart()
    wishlist.fetchWishlist()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-200">
    <AppNavbar />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>
