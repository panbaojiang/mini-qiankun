<template>
  <div class="home">
    <h3>Vue2 子应用首页</h3>
    <p>欢迎来到 Vue2 子应用！</p>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      currentTime: "",
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleString();
    },
  },
};
</script>

<style scoped>
.home {
  margin-top: 20px;
}
</style>
