import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { useLocaleStore } from './stores/locale'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize theme and locale before mounting (prevents flash)
const theme = useThemeStore()
theme.init()
const locale = useLocaleStore()
locale.init()

app.mount('#app')
