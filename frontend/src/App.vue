<template>
  <div id="app">
    <AuthPage />
  </div>  
</template>

<script>
  import AuthPage from './pages/AuthPage.vue';

  export default{
    name: "App",
    components: {
      AuthPage
    }
  }
</script>