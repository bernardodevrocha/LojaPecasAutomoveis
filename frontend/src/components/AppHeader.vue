<template>
  <header class="header">
    <div class="inner">
      <h1 class="logo">AutoParts Admin</h1>
      <nav class="nav">
        <RouterLink to="/home" class="nav-link">Dashboard</RouterLink>
        <RouterLink to="/api/products" class="nav-link">Produtos</RouterLink>
        <RouterLink to="/api/vendas" class="nav-link">Vendas</RouterLink>
        <RouterLink to="/api/clientes" class="nav-link">Clientes</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header{ position:sticky; top:0; z-index:10; background:#0f172a; color:#fff; }
.inner{ max-width:1200px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; }
.logo{ font-size:18px; margin:0; }
.nav{ display:flex; gap:16px; }
.nav-link{ color:#cbd5e1; text-decoration:none; padding:6px 10px; border-radius:6px; }
.nav-link:hover{ background:#1e293b; color:#fff; }
</style>
