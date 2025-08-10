<template>
  <div id="app">
    <h2>Vue2 子应用</h2>
    <p>这是一个 Vue2 子应用，运行在 qiankun 微前端架构中。</p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
