<template>
  <div>
    <HeaderComponent />
    <main>
      <HeroSection />
      <FeaturedProducts />
      <Categories /> 
    </main>
    <Footer />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import HeroSection from '../components/HeroSection.vue';

export default{
  name: "HomePage",
  components: {
    HeaderComponent,
    HeroSection,

  } 
};
</script>

<style scoped>
.hero-section{
  background-color: #f0f0f0;
  padding: 50px 20px;
  text-align: center;
}

.hero-section h1{
  font-size: 2.5rem;
  color: #004d99;
}

.hero-section button{
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 1.1rem;
}
</style>