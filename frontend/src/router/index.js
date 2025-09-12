import { createRouter, createWebHistory } from 'vue-router'
import AuthPage   from '../pages/AuthPage.vue'
import ProductPage from '../pages/ProductPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: AuthPage },
    { path: '/home',  name: 'home',  component: ProductPage },
  ],
})
