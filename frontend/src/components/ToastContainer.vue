<script setup>
import { useToastStore } from '../stores/toast'

const toast = useToastStore()

const icons = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-300',
    iconBg: 'bg-green-100 dark:bg-green-800/50',
    iconColor: 'text-green-600 dark:text-green-400',
    svg: 'M5 13l4 4L19 7',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
    iconBg: 'bg-red-100 dark:bg-red-800/50',
    iconColor: 'text-red-600 dark:text-red-400',
    svg: 'M6 18L18 6M6 6l12 12',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-800/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    svg: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="t in toast.toasts"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg dark:shadow-2xl dark:shadow-black/30 backdrop-blur-sm"
          :class="icons[t.type]?.bg || icons.info.bg"
        >
          <!-- Icon -->
          <div
            class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            :class="icons[t.type]?.iconBg || icons.info.iconBg"
          >
            <svg
              class="w-4 h-4"
              :class="icons[t.type]?.iconColor || icons.info.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="icons[t.type]?.svg || icons.info.svg"
              />
            </svg>
          </div>

          <!-- Message -->
          <p class="flex-1 text-sm font-medium pt-0.5" :class="icons[t.type]?.text || icons.info.text">
            {{ t.message }}
          </p>

          <!-- Close -->
          <button
            @click="toast.removeToast(t.id)"
            class="shrink-0 p-0.5 rounded-full opacity-60 hover:opacity-100 transition"
            :class="icons[t.type]?.text || icons.info.text"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.25s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 0.2s ease;
}
</style>
