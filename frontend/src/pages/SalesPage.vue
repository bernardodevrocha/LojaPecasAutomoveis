<template>
  <div class="page">
    <AppHeader />

    <div class="container">
      <h2 class="title">Vendas</h2>

      <section class="search-box">
        <input v-model="q" type="search" class="input" placeholder="Buscar produto por nome..." />
      </section>

      <div class="content">
        <section class="catalog">
          <h3 class="section-title">Produtos</h3>
          <div v-if="loading" class="state">Carregando produtos...</div>
          <div v-else-if="error" class="state error">{{ error }}</div>
          <ul class="grid">
            <li v-for="p in filtered" :key="p.id" class="card">
              <img :src="p.imageUrl || placeholder" class="thumb" alt="" />
              <div class="prod-body">
                <h4 class="name">{{ p.name }}</h4>
                <p class="desc">{{ p.description }}</p>
                <div class="meta">
                  <span class="price">{{ toBRL(p.price) }}</span>
                  <button class="btn" @click="addToCart(p)">Adicionar</button>
                </div>
              </div>
            </li>
          </ul>
        </section>

        <aside class="cart">
          <h3 class="section-title">Carrinho</h3>

          <div v-if="cart.length === 0" class="muted">Nenhum item no carrinho.</div>

          <ul class="cart-list" v-else>
            <li v-for="item in cart" :key="item.product.id" class="cart-row">
              <div class="cart-info">
                <div class="cart-name">{{ item.product.name }}</div>
                <div class="cart-price">{{ toBRL(item.product.price) }}</div>
              </div>

              <div class="cart-qty">
                <button class="qty-btn" @click="dec(item)">-</button>
                <input class="qty-input" type="number" min="1" v-model.number="item.quantity" @change="normalizeQty(item)" />
                <button class="qty-btn" @click="inc(item)">+</button>
              </div>

              <div class="cart-line-total">{{ toBRL(item.quantity * Number(item.product.price || 0)) }}</div>

              <button class="rm-btn" title="Remover" @click="removeItem(item.product.id)">×</button>
            </li>
          </ul>

          <div class="totals" v-if="cart.length">
            <div class="row">
              <span>Subtotal</span>
              <span>{{ toBRL(subtotal) }}</span>
            </div>
            <div class="row total">
              <span>Total</span>
              <span>{{ toBRL(subtotal) }}</span>
            </div>
            <button class="btn primary" :disabled="submitting || cart.length===0" @click="checkout">
              <span v-if="submitting">Enviando...</span>
              <span v-else>Confirmar venda</span>
            </button>

            <div v-if="okMsg" class="ok">{{ okMsg }}</div>
            <div v-if="errMsg" class="err">{{ errMsg }}</div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'

const products = ref([])
const loading  = ref(false)
const error    = ref('')
const q        = ref('')
const placeholder = 'https://via.placeholder.com/300x200?text=Produto'

const cart = ref([])

const okMsg  = ref('')
const errMsg = ref('')
const submitting = ref(false)

const filtered = computed(()=>{
  const s = q.value.trim().toLowerCase()
  if (!s) return products.value
  return products.value.filter(p => (p.name || '').toLowerCase().includes(s))
})

const subtotal = computed(()=>{
  return cart.value.reduce((sum, it) => sum + Number(it.product.price || 0) * it.quantity, 0)
})

function toBRL(v){ return (Number(v)||0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) }

function addToCart(p){
  const found = cart.value.find(it => it.product.id === p.id)
  if (found) found.quantity += 1
  else cart.value.push({ product: p, quantity: 1 })
}

function removeItem(pid){
  cart.value = cart.value.filter(it => it.product.id !== pid)
}

function inc(it){ it.quantity += 1 }
function dec(it){ it.quantity = Math.max(1, it.quantity - 1) }
function normalizeQty(it){ it.quantity = Math.max(1, Number(it.quantity || 1)) }

async function fetchProducts(){
  loading.value = true
  error.value = ''
  try {
    const { data } = await axios.get('http://localhost:3000/api/product')
    products.value = Array.isArray(data) ? data : (data?.content || [])
  } catch (e) {
    error.value = e?.response?.data?.error || e.message || 'Erro ao carregar produtos.'
  } finally {
    loading.value = false
  }
}

async function checkout(){
  okMsg.value = ''
  errMsg.value = ''
  submitting.value = true

  try {
    // monta o payload esperado pelo backend /api/sales (items: productId, quantity, unitPrice?)
    const items = cart.value.map(it => ({
      productId: it.product.id,
      quantity: it.quantity,
      // unitPrice: Number(it.product.price) // opcional; se não enviar, o backend usa Product.price
    }))

    const { data } = await axios.post('http://localhost:3000/api/sales', {
      userId: null, // se quiser atribuir ao funcionário logado, envie o id aqui
      items
    })

    okMsg.value = `Venda #${data.id} criada com sucesso! Total ${toBRL(data.total)}`
    cart.value = [] // limpa carrinho
  } catch (e) {
    errMsg.value = e?.response?.data?.error || e.message || 'Erro ao confirmar a venda.'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.page{ background:#f5f6f8; min-height:100vh; }
.container{ max-width:1200px; margin:0 auto; padding:16px; }
.title{ margin:12px 0 16px; }

.search-box{ margin:8px 0 16px; }
.input{ width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:8px; }

.content{ display:grid; grid-template-columns: 2fr 1fr; gap:16px; }
@media (max-width: 980px){ .content{ grid-template-columns: 1fr; } }

.section-title{ margin:8px 0 12px; }
.state{ padding:10px; }
.state.error{ color:#b91c1c; }

.grid{ display:flex; flex-wrap:wrap; gap:16px; list-style:none; padding:0; margin:0; }
.card{ background:#fff; border:1px solid #e5e7eb; border-radius:10px; width:260px; overflow:hidden; }
.thumb{ width:100%; height:140px; object-fit:cover; background:#f3f4f6; }
.prod-body{ padding:10px; }
.name{ margin:6px 0 4px; font-size:15px; }
.desc{ margin:0 0 8px; color:#6b7280; font-size:13px; min-height:32px; }
.meta{ display:flex; align-items:center; justify-content:space-between; }
.price{ font-weight:700; }

.btn{ background:#0ea5e9; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; }
.btn:hover{ filter:brightness(.95); }
.btn.primary{ width:100%; background:#2563eb; }

.cart{ background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:12px; height:max-content; position:sticky; top:12px; }
.muted{ color:#6b7280; }

.cart-list{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
.cart-row{ display:grid; grid-template-columns: 1fr auto auto auto; gap:8px; align-items:center; padding:8px; border:1px solid #eef; border-radius:8px; }
.cart-info{ display:flex; flex-direction:column; }
.cart-name{ font-weight:600; }
.cart-price{ color:#6b7280; font-size:13px; }
.cart-qty{ display:flex; align-items:center; gap:6px; }
.qty-btn{ width:28px; height:28px; border:1px solid #d1d5db; border-radius:6px; background:#fff; cursor:pointer; }
.qty-input{ width:56px; padding:4px 6px; border:1px solid #d1d5db; border-radius:6px; text-align:center; }
.cart-line-total{ font-weight:700; }
.rm-btn{ width:28px; height:28px; border:none; border-radius:50%; background:#ef4444; color:#fff; cursor:pointer; }

.totals{ margin-top:12px; display:flex; flex-direction:column; gap:8px; }
.totals .row{ display:flex; justify-content:space-between; }
.totals .total{ font-size:18px; font-weight:800; }

.ok{ color:#065f46; background:#ecfdf5; border:1px solid #a7f3d0; padding:8px; border-radius:8px; margin-top:8px; }
.err{ color:#991b1b; background:#fef2f2; border:1px solid #fecaca; padding:8px; border-radius:8px; margin-top:8px; }
</style>
