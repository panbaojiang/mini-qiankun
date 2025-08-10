<template>
  <div class="home">
    <h3>Vue3 子应用首页</h3>
    <p>欢迎来到 Vue3 子应用！</p>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const currentTime = ref("");

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});

function updateTime() {
  currentTime.value = new Date().toLocaleString();
}
</script>

<style scoped>
.home {
  margin-top: 20px;
}
</style>
