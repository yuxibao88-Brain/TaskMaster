<script setup>
import { toggleSidebar } from "../store.js";
</script>

<template>
  <header class="header">
    <div class="header-left">
      <button class="icon-btn hamburger" @click="toggleSidebar">
        <svg viewBox="0 0 24 24" fill="#5f6368" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
      <div class="logo">
        <img src="/favicon.svg" class="logo-img" alt="Tasks Logo" />
        <span class="logo-text">Tasks</span>
      </div>
    </div>
    <div class="header-right">
      <button class="icon-btn">?</button>
      <button class="icon-btn">⋮⋮</button>
      <div class="avatar"></div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 64px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #dadce0;
  flex-shrink: 0;
  z-index: 10;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #5f6368;
  transition: background 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
}

.icon-btn:hover {
  background: #f1f3f4;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}

.logo-img {
  width: 36px;
  height: 36px;
}

.logo-text {
  font-size: 22px;
  color: #3c4043;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffab40;
  margin-left: 8px;
}
</style>
