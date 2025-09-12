import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'      // use caminhos relativos se não tiver alias "@"
import ProductPage from '@/pages/ProductPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/home', component: ProductPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
