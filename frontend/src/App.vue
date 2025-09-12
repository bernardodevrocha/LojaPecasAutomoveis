<template>
  <div id="app">
    <router-view />
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