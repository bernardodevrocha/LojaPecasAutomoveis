import { createRouter, createWebHistory } from 'vue-router'
import AuthPage   from '../pages/AuthPage.vue'
import ProductPage from '../pages/ProductPage.vue'
import HomePage from '@/pages/HomePage.vue'
import SalesPage from '@/pages/SalesPage.vue'
import ClientPage from '@/pages/ClientPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: AuthPage },
    { path: '/home', name: 'home', component: HomePage },
    { path: '/api/products',  name: 'products',  component: ProductPage },
    { path: '/api/vendas',  name: 'vendas',  component: SalesPage },
    { path: '/api/clientes', name: 'clientes', component: ClientPage}
  ],
})
