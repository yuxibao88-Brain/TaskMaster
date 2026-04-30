<script setup>
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
import TaskBoard from "./components/TaskBoard.vue";
import AddListModal from "./components/AddListModal.vue";
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar />
      <TaskBoard />
    </div>
    <AddListModal />
  </div>
</template>

<style>
/* 全局重置 */
body, html {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
  background-color: #ffffff;
  color: #202124;
}

#app {
  height: 100vh;
}
</style>

<style scoped>
/* 根布局 */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
