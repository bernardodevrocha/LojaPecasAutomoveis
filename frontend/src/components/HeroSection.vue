<template>
  <section class="featured-products">
    <h1>Peças de Qualidade para o seu veículo</h1>
    <p>As melhores marcas com os melhores preços. Encontre tudo que você precisa aqui!</p>
    <form action="/api/products" method="GET">
      <button >Ver Produtos</button>
    </form>
  </section>
</template>

<script>
export default{
  name: "HeroSection"
};
</script>

<style scoped>
.hero-section {
  background-color: #f0f0f0;
  padding: 50px 20px;
  text-align: center;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #004d99;
}

.hero-section button {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.1rem;
}
</style>