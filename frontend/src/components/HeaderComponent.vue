<template>
  <div class="container">
    <ul class="lista">
      <a href="/home"><li id="elemento">HOME</li></a>
      <a href="/comprar-pecas"><li id="elemento">| COMPRAR PEÇAS</li></a>
      <a href="/sobre-nos"><li id="elemento">| SOBRE NÓS</li></a>
      <a href="/categorias"><li id="elemento">| CATEGORIAS</li></a>
    </ul>
  </div>
</template>

<script>
export default{
  name: "HeaderComponent"
}
</script>

<style scoped>
  .lista{
    display: flex;
    justify-content: right;
    align-items: right;
    flex-wrap: wrap;
    background-color: black;
    height: 150px;
  }

  #elemento{
    padding-left: 5px;
    text-decoration: none;
    list-style-type: none;
    color: white;
  }

  #elemento:hover{
    color: rgb(22, 22, 113);
    transition: .7s ease-in-out;
  }
</style>