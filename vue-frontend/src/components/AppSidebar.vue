<script setup>
import {
  isSidebarOpen,
  currentMenu,
  isListsCollapsed,
  showNewListModal,
  lists,
} from "../store.js";
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-closed': !isSidebarOpen }">
    <div class="sidebar-inner">
      <button class="create-btn">
        <span class="plus-icon">
          <svg viewBox="0 0 24 24" fill="#1a73e8" width="24" height="24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </span>
        创建
      </button>

      <nav class="nav-menu">
        <div
          class="nav-item"
          :class="{ active: currentMenu === 'all' }"
          @click="currentMenu = 'all'"
        >
          <span class="nav-icon">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
              style="vertical-align: middle"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </span>
          所有任务
        </div>
        <div
          class="nav-item"
          :class="{ active: currentMenu === 'starred' }"
          @click="currentMenu = 'starred'"
        >
          <span class="nav-icon">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
              style="vertical-align: middle"
            >
              <path
                d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
              />
            </svg>
          </span>
          已加星标
        </div>

        <div class="nav-divider"></div>

        <div
          class="nav-group-title"
          @click="isListsCollapsed = !isListsCollapsed"
          style="cursor: pointer"
        >
          <span>任务列表</span>
          <span
            class="collapse-icon"
            :style="{
              transform: isListsCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
              display: 'flex',
            }"
          >
            <svg viewBox="0 0 24 24" fill="#5f6368" width="20" height="20">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
          </span>
        </div>

        <div
          class="nav-collapse-wrapper"
          :class="{ 'is-collapsed': isListsCollapsed }"
        >
          <div class="nav-collapse-content">
            <div
              class="nav-item"
              v-for="list in lists"
              :key="list.id"
              @click="currentMenu = list.id"
              :class="{ active: currentMenu === list.id }"
            >
              <span class="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                  style="vertical-align: middle"
                >
                  <path
                    d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
                  />
                </svg>
              </span>
              <span class="nav-text">{{ list.name }}</span>
              <span class="nav-count">{{ list.tasks.length }}</span>
            </div>

            <div class="nav-item add-list" @click="showNewListModal = true">
              <span class="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                  style="vertical-align: middle"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </span>
              新建任务列表
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background: transparent;
  flex-shrink: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  border-right: 1px solid rgba(0, 0, 0, 0.04);
}

.sidebar-closed {
  width: 0;
}

.sidebar-inner {
  width: 280px;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
}

.create-btn {
  margin: 0 16px 24px;
  width: 120px;
  height: 44px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
}

.create-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.plus-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-menu {
  display: flex;
  flex-direction: column;
}

.nav-item {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
  border-radius: 8px;
  margin: 2px 16px;
  color: #5f6368;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
}

.nav-item.active {
  background: #ffffff;
  color: #1a73e8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.nav-icon {
  margin-right: 16px;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.nav-count {
  font-size: 12px;
  color: #5f6368;
}

.nav-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 12px 16px;
}

.nav-group-title {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #3c4043;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.nav-group-title:hover {
  background: #f1f3f4;
}

/* 基于 CSS Grid 的完美折叠动画 */
.nav-collapse-wrapper {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-collapse-wrapper.is-collapsed {
  grid-template-rows: 0fr;
}

.nav-collapse-content {
  overflow: hidden;
}
</style>
