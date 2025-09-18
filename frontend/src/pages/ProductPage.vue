<template>
  <div>
    <AppHeader />
    <h1 style="display: flex; justify-content: center; align-items: center; color: #0f172a;">Página de produtos</h1>
    <div class="container">
      <div v-if="loading" class="state">Carregando...</div>
      <div v-else-if="error" class="state error">{{ error }}</div>
      <div v-else>
        <div class="toolbar">
          <input
            type="search"
            placeholder="Busque seu produto aqui!"
            class="search"
          />
          <span class="count">{{ filtered.length }} items</span>
        </div>

        <h2 style="display: flex; justify-content: center; align-items: center">
          Em Alta🔥
        </h2>
        <p style="display: flex; justify-content: center; align-items: center">
          Seu carro performando melhor nas ruas
        </p>
        <ul class="grid">
          <li v-for="p in hot" :key="'hot-' + p.id" class="card">
            <img
              :src="p.imageUrl || placeholder"
              alt="Imagem do produto"
              class="thumb"
            />
            <h3 class="name">{{ p.name }}</h3>
            <p class="desc">{{ p.desc }}</p>
            <div class="meta">
              <span class="price">{{ formatPrice(p.price) }}</span>
              <span class="cat" v-if="p.category">{{ p.category }}</span>
            </div>
          </li>
        </ul>

        <h2 style="display: flex; justify-content: center; align-items: center">
          Produtos da nossa loja
        </h2>
        <ul class="grid">
          <li v-for="p in filtered" :key="p.id" class="card">
            <img :src="p.imageUrl || placeholder" alt="" class="thumb" />
            <h3 class="name">{{ p.name }}</h3>
            <p class="desc">{{ p.description }}</p>
            <div class="meta">
              <span class="price">{{ formatPrice(p.price) }}</span>
              <span class="cat" v-if="p.category">{{ p.category }}</span>
            </div>
          </li>
        </ul>

        <h2>Nossas categorias</h2>
        <p>Solucione seu problema por categoria</p>
        <ul class="grid">
          <a style="display: flex; justify-content: center; align-items: center;">
            <li>
              <img src="" alt="">
              <h3>Motores</h3>
            </li>
          </a>

          <a style="display: flex; justify-content: center; align-items: center;">
            <img src="" alt="">
            <h3>Freios</h3>
          </a>

          <a style="display: flex; justify-content: center; align-items: center;">
            <img src="" alt="">
            <h3>Eletrônicos</h3>
          </a>

          <a style="display: flex; justify-content: center; align-items: center;">
            <img src="" alt="">
            <h3>Suspensção e Direção</h3>
          </a>

          <a style="display: flex; justify-content: center; align-items: center;">
            <img src="" alt="">
           <h3>Manutenção</h3>
          </a>

          <a style="display: flex; justify-content: center; align-items: center;">
            <h3>Câmbio e Transmissão</h3>
          </a>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup>
  import AppHeader from "@/components/AppHeader.vue";
</script>

<script>
import axios from "axios";

export default {
  name: "ProductPage",
  data() {
    return {
      products: [],
      hot: [],
      categoria: [],
      loading: false,
      error: "",
      q: "",
      placeholder: "https://via.placeholder.com/300x200?text=Produto",
    };
  },
  computed: {
    filtered() {
      const q = this.q.toLowerCase();
      return this.products.filter((p) =>
        (p.name || "").toLowerCase().includes(q)
      );
    },
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await axios.get("http://localhost:3000/api/product");
        const list = Array.isArray(data) ? data : data?.content || [];
        this.products = list;
        this.hot = list.slice(0, 3); // 👈 pega os 3 primeiros
      } catch (e) {
        this.error =
          e?.response?.data?.error || e.message || "Erro ao carregar produtos.";
      } finally {
        this.loading = false;
      }
    },
    formatPrice(v) {
      if (v == null) return "-";
      const n = typeof v === "number" ? v : Number(v);
      return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.page {
  padding: 24px;
  background: #f5f6f8;
  min-height: 100vh;
}

h1 {
  margin: 0 0 16px;
}

.state {
  padding: 12px;
}

.state.error {
  color: #b91c1c;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 16px;
}

.search {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  flex: 1;
}

.count {
  color: #6b7280;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  width: 260px;
  max-width: 260px;
}
.thumb {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
}
.name {
  margin: 8px 0 4px;
  font-size: 16px;
}
.desc {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 14px;
  min-height: 34px;
}
.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-weight: 700;
  color: #111827;
}
.cat {
  font-size: 12px;
  color: #6b7280;
}
</style>