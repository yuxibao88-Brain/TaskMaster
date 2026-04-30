<script setup>
import {
  currentMenu,
  lists,
  allStarredTasks,
  dateOptions,
  openAddTask,
  setDate,
  saveTask,
  toggleTask,
  toggleStar,
  cancelAdd,
} from "../store.js";
</script>

<template>
  <main class="board-area">
    <!-- 星标任务专属视图 -->
    <div class="lists-wrapper center-wrapper" v-if="currentMenu === 'starred'">
      <div class="task-list wide-list">
        <div class="list-header">
          <h2 class="list-title">已加星标的任务</h2>
          <button class="icon-btn more-btn">⋮</button>
        </div>

        <div class="add-transition-wrapper">
          <div class="add-task-trigger">
            <span class="add-icon">
              ✓
              <small
                style="position: absolute; margin-left: -4px; margin-top: 6px"
                >+</small
              >
            </span>
            <span class="add-text">将任务加注星标</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="allStarredTasks.length === 0">
          <div class="empty-illustration">
            <img
              src="../assets/empty-star-highres.png"
              alt="Empty Starred Tasks"
              class="empty-img"
            />
          </div>
          <h3 class="empty-title">没有任何已加星标的任务</h3>
          <p class="empty-desc">
            为重要任务加注星标，即可在此处轻松找到这些任务
          </p>
        </div>

        <!-- 星标任务列表 -->
        <div v-else class="tasks-container">
          <div
            class="task-item"
            v-for="task in allStarredTasks"
            :key="task.id"
            :class="{ completed: task.completed }"
          >
            <button class="circle-btn" @click="toggleTask(task)">
              {{ task.completed ? "✓" : "◯" }}
            </button>
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <div class="task-meta" v-if="task.details || task.date">
                <span class="task-desc" v-if="task.details">{{
                  task.details
                }}</span>
                <span class="task-date-tag" v-if="task.date">{{
                  task.date
                }}</span>
              </div>
            </div>
            <div class="task-actions">
              <button class="action-btn">⋮</button>
              <button
                class="action-btn"
                @click="toggleStar(task)"
                :class="{ 'is-starred': task.starred }"
              >
                {{ task.starred ? "★" : "☆" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常规列表视图 -->
    <div class="lists-wrapper" v-else>
      <!-- 单个任务列表 -->
      <div
        class="task-list"
        v-for="list in lists"
        :key="list.id"
        v-show="currentMenu === 'all' || currentMenu === list.id"
      >
        <div class="list-drag-handle"></div>
        <div class="list-header">
          <h2 class="list-title">{{ list.name }}</h2>
          <button class="icon-btn more-btn">⋮</button>
        </div>

        <!-- 添加区域平滑切换动画 -->
        <div class="add-transition-wrapper">
          <transition name="slide-fade" mode="out-in">
            <!-- 默认状态：添加任务按钮 -->
            <div
              v-if="!list.isAdding"
              class="add-task-trigger"
              @click="openAddTask(list)"
            >
              <span class="add-icon">
                ✓
                <small
                  style="position: absolute; margin-left: -4px; margin-top: 6px"
                  >+</small
                >
              </span>
              <span class="add-text">添加任务</span>
            </div>

            <!-- 激活状态：添加任务输入框 -->
            <div v-else class="add-task-form">
              <div class="form-inputs">
                <button class="circle-empty" @click="cancelAdd(list)">◯</button>
                <div class="inputs-wrapper">
                  <input
                    type="text"
                    class="title-input"
                    v-model="list.newTaskTitle"
                    placeholder="标题"
                    @keyup.enter="saveTask(list)"
                    @keyup.esc="cancelAdd(list)"
                    autofocus
                  />
                  <input
                    type="text"
                    class="details-input"
                    v-model="list.newTaskDetails"
                    placeholder="添加详细信息"
                    @keyup.enter="saveTask(list)"
                  />
                </div>
              </div>
              <div class="form-actions">
                <div class="chips">
                  <button
                    v-for="d in dateOptions"
                    :key="d"
                    class="chip"
                    :class="{ 'chip-active': list.newTaskDate === d }"
                    @click="setDate(list, d)"
                  >
                    {{ d }}
                  </button>
                </div>
                <button class="save-btn" @click="saveTask(list)">↵</button>
              </div>
            </div>
          </transition>
        </div>

        <!-- 任务项列表 (带顺滑过渡动画) -->
        <transition-group name="list-anim" tag="div" class="tasks-container">
          <div
            class="task-item"
            v-for="task in list.tasks"
            :key="task.id"
            :class="{ completed: task.completed }"
          >
            <button class="circle-btn" @click="toggleTask(task)">
              {{ task.completed ? "✓" : "◯" }}
            </button>
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <div class="task-meta" v-if="task.details || task.date">
                <span class="task-desc" v-if="task.details">{{
                  task.details
                }}</span>
                <span class="task-date-tag" v-if="task.date">{{
                  task.date
                }}</span>
              </div>
            </div>

            <!-- 悬浮操作按钮 -->
            <div class="task-actions">
              <button class="action-btn">⋮</button>
              <button
                class="action-btn"
                @click="toggleStar(task)"
                :class="{ 'is-starred': task.starred }"
              >
                {{ task.starred ? "★" : "☆" }}
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </main>
</template>

<style scoped>
.board-area {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 24px;
  scroll-behavior: smooth;
}

.lists-wrapper {
  display: flex;
  gap: 24px;
  height: 100%;
  align-items: flex-start;
}



/* 单个任务列表卡片 */
.task-list {
  width: 360px;
  background: #ffffff;
  border-radius: 12px;
  padding: 8px 16px 16px;
  flex-shrink: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
  position: relative;
}

/* 顶部拖拽手柄条 */
.list-drag-handle {
  width: 32px;
  height: 4px;
  background-color: #dadce0;
  border-radius: 2px;
  margin: 0 auto 12px auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
  flex-shrink: 0;
}

.list-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* 添加区域包裹器，固定最小高度避免跳闪 */
.add-transition-wrapper {
  min-height: 48px;
  flex-shrink: 0;
}

/* 表单切换的过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 添加任务按钮 (默认态) */
.add-task-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #1a73e8;
  font-weight: 500;
  transition: background 0.2s ease;
}

.add-task-trigger:hover {
  background: #f8f9fa;
}

.add-icon {
  font-weight: bold;
  position: relative;
}

/* ================= 空状态样式 ================= */
.center-wrapper {
  justify-content: center;
  align-items: flex-start;
  padding-top: 24px;
}

.wide-list {
  width: 800px;
  max-width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  flex: 1;
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-img {
  width: 180px;
  height: auto;
  opacity: 0.95;
  border-radius: 12px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: #5f6368;
  margin: 0;
}

/* 添加任务表单 (输入态) */
.add-task-form {
  background: #f1f3f4;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: inset 0 0 0 1px #1a73e8;
}

.form-inputs {
  display: flex;
  gap: 12px;
}

.circle-empty {
  color: #5f6368;
  font-size: 18px;
  margin-top: 2px;
  transition: color 0.2s;
  cursor: pointer;
  border: none;
  background: none;
}
.circle-empty:hover {
  color: #1a73e8;
}

.inputs-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-input {
  font-size: 15px;
  color: #3c4043;
  border: none;
  outline: none;
  background: transparent;
}

.title-input::placeholder {
  color: #5f6368;
}

.details-input {
  font-size: 13px;
  color: #5f6368;
  border: none;
  outline: none;
  background: transparent;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-left: 28px;
}

.chips {
  display: flex;
  gap: 8px;
}

/* 日期 Tag 样式及选中状态 */
.chip {
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  color: #3c4043;
  transition: all 0.2s ease;
  cursor: pointer;
}

.chip:hover {
  background: #f8f9fa;
}

.chip.chip-active {
  background: #e8f0fe;
  color: #1a73e8;
  border-color: #1a73e8;
}

.save-btn {
  background: transparent;
  color: #5f6368;
  font-size: 20px;
  padding: 4px;
  transition: color 0.2s;
  cursor: pointer;
  border: none;
}

.save-btn:hover {
  color: #1a73e8;
}

/* ================= 任务项与列表动画 ================= */
.tasks-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 12px;
  flex: 1;
}

/* Vue Transition Group: 任务列表增删动画 */
.list-anim-move,
.list-anim-enter-active,
.list-anim-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-anim-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.list-anim-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保删除时其他元素平滑填补空位 */
.list-anim-leave-active {
  position: absolute;
  width: calc(100% - 32px);
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    opacity 0.3s ease;
  cursor: pointer;
  background: #ffffff;
}

.task-item:hover {
  background: #f1f3f4;
}

/* 悬浮操作按钮区域 */
.task-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-left: auto; /* 推到最右边 */
}

/* 当鼠标悬浮在任务项上，或者该任务本身被标星时，显示按钮 */
.task-item:hover .task-actions,
.task-actions:has(.is-starred) {
  opacity: 1;
}

/* 为了兼容不支持 :has 的浏览器，单独给标星状态加上固定可见 */
.action-btn.is-starred {
  opacity: 1 !important;
  color: #1a73e8 !important;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #5f6368;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
  border: none;
  background: none;
}

.action-btn:hover {
  background: #e8eaed;
  color: #202124;
}

.circle-btn {
  color: #5f6368;
  font-size: 18px;
  padding: 0;
  margin-top: 2px;
  transition: color 0.2s;
  cursor: pointer;
  border: none;
  background: none;
}

.task-item.completed .circle-btn {
  color: #1a73e8;
}

.task-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-title {
  font-size: 14px;
  color: #3c4043;
  transition:
    color 0.3s,
    text-decoration 0.3s;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #5f6368;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-desc {
  font-size: 12px;
  color: #5f6368;
}

.task-date-tag {
  display: inline-block;
  font-size: 11px;
  color: #1a73e8;
  background: #e8f0fe;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
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
</style>
