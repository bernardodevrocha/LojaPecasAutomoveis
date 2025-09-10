import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'

const HomePage = { template: '<div class="p-6">Home</div>' }

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/home', component: HomePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
