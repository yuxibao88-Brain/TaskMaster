<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
import TaskBoard from "./components/TaskBoard.vue";
import AddListModal from "./components/AddListModal.vue";
import LoginPage from "./components/LoginPage.vue";
import { lists, isSidebarOpen, toggleSidebar } from "./store.js";
import { getTaskLists } from "./api/taskList.js";

// 登录状态
const isLoggedIn = ref(false);
const currentUser = ref("");

// 加载任务数据
const loadData = async () => {
  const res = await getTaskLists();
  if (res.code === 200) {
    res.data.forEach((list) => {
      list.isAdding = false;
      list.newTaskTitle = "";
      list.newTaskDetails = "";
      list.newTaskDate = "";
    });
    lists.value = res.data;
  } else if (res.code === 401) {
    // token 过期，退出登录
    handleLogout();
  }
};

// 登录成功回调
const handleLoginSuccess = (username) => {
  isLoggedIn.value = true;
  currentUser.value = username;
  loadData();
};

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false;
  currentUser.value = "";
  lists.value = [];
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

// 页面加载时检查是否已登录
onMounted(() => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (token) {
    isLoggedIn.value = true;
    currentUser.value = username || "";
    loadData();
  }
});
</script>

<template>
  <!-- 未登录：显示登录页 -->
  <LoginPage v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

  <!-- 已登录：显示主应用 -->
  <div class="app-container" v-else>
    <AppHeader :username="currentUser" @logout="handleLogout" />
    <div class="main-layout">
      <!-- 手机端侧边栏遮罩 -->
      <div
        class="sidebar-backdrop"
        v-if="isSidebarOpen"
        @click="toggleSidebar"
      ></div>
      <AppSidebar />
      <TaskBoard />
    </div>
    <AddListModal />
    <footer class="app-footer">
      联系 Brain <a href="mailto:yuxibao88@gmail.com">yuxibao88@gmail.com</a>
    </footer>
  </div>
</template>

<style>
/* 全局重置 */
body,
html {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background-color: #f4f5f8;
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  background-color: #f4f5f8;
  background-image: radial-gradient(
    circle at 50% 0%,
    #ffffff 0%,
    transparent 70%
  );
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 6px 0;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.3);
  letter-spacing: 0.3px;
  z-index: 10;
  pointer-events: none;
}

.app-footer a {
  color: rgba(0, 0, 0, 0.4);
  text-decoration: none;
  pointer-events: auto;
}

.app-footer a:hover {
  color: #1a73e8;
  text-decoration: underline;
}

/* 侧边栏遮罩（仅手机端生效） */
.sidebar-backdrop {
  display: none;
}

/* ============ 手机端适配 ============ */
@media (max-width: 768px) {
  .sidebar-backdrop {
    display: block;
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
  }

  .main-layout {
    flex-direction: column;
  }

  .app-footer {
    font-size: 10px;
    padding: 4px 0;
  }
}
</style>
