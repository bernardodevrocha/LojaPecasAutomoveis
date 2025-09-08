<template>
  <section class="featured-products">
    <h2>Produtos em Destaque</h2>
    <div v-if="products.length > 0" class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>R$ {{ product.price.toFixed(2) }}</p>
      </div>
    </div>
    <p v-else>Nenhum produto em destaque no momento.</p>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FeaturedProducts',
  data() {
    return {
      products: [],
    };
  },
  async created() {
    try {
      // Exemplo de chamada para sua API
      const response = await axios.get('http://localhost:3000/api/products');
      this.products = response.data;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  },
};
</script>

<style scoped>
.featured-products {
  padding: 20px 0;
  text-align: center;
}

.product-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  width: 200px;
}
</style>