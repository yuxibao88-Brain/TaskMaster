<script setup>
import {
  currentMenu,
  lists,
  allStarredTasks,
  selectedDate,
  openAddTask,
  cancelAdd,
} from "../store.js";
import {
  addTask,
  patchTask,
  deleteTask as deleteTaskApi,
} from "../api/task.js";
import { deleteTaskList } from "../api/taskList.js";

// 保存任务（调后端接口）
const saveTask = async (list) => {
  if (!list.newTaskTitle.trim()) {
    list.isAdding = false;
    return;
  }
  const res = await addTask(list.id, {
    title: list.newTaskTitle,
    details: list.newTaskDetails,
    date: list.newTaskDate,
  });
  if (res.code === 200) {
    list.tasks.unshift({
      id: res.data.id,
      title: list.newTaskTitle,
      details: list.newTaskDetails,
      date: "",
      completed: 0,
      starred: 0,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    });
    list.newTaskTitle = "";
    list.newTaskDetails = "";
  }
};

// 切换完成状态（调后端接口）
const toggleTask = async (task) => {
  const newVal = task.completed ? 0 : 1;
  const res = await patchTask(task.id, { completed: newVal });
  if (res.code === 200) {
    task.completed = newVal;
  }
};

// 切换星标状态（调后端接口）
const toggleStar = async (task) => {
  const newVal = task.starred ? 0 : 1;
  const res = await patchTask(task.id, { starred: newVal });
  if (res.code === 200) {
    task.starred = newVal;
  }
};

// 删除任务（调后端接口）
const handleDeleteTask = async (list, task) => {
  const res = await deleteTaskApi(task.id);
  if (res.code === 200) {
    // 星标视图传 null，需要遍历查找所属列表
    const targetList =
      list || lists.value.find((l) => l.tasks.some((t) => t.id === task.id));
    if (targetList) {
      targetList.tasks = targetList.tasks.filter((t) => t.id !== task.id);
    }
  }
};

// 删除列表（调后端接口）
const handleDeleteList = async (list) => {
  const res = await deleteTaskList(list.id);
  if (res.code === 200) {
    lists.value = lists.value.filter((l) => l.id !== list.id);
    if (currentMenu.value === list.id) {
      currentMenu.value = "all";
    }
  }
};
</script>

<template>
  <main class="board-area">
    <!-- 星标任务专属视图 -->
    <div class="lists-wrapper center-wrapper" v-if="currentMenu === 'starred'">
      <div class="task-list wide-list">
        <div class="list-header">
          <h2 class="list-title">已加星标的任务</h2>
          <button class="icon-btn more-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>

        <div class="add-transition-wrapper">
          <div class="add-task-trigger">
            <span class="add-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                width="18"
                height="18"
              >
                <path d="M12 5v14M5 12h14"></path>
              </svg>
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
            v-show="
              !selectedDate ||
              (task.created_at &&
                task.created_at.substring(0, 10) === selectedDate)
            "
          >
            <button class="circle-btn" @click="toggleTask(task)">
              <svg
                v-if="task.completed"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                width="20"
                height="20"
              >
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
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
              <button
                class="action-btn delete-btn"
                @click="handleDeleteTask(null, task)"
                title="删除"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
              <button
                class="action-btn"
                @click="toggleStar(task)"
                :class="{ 'is-starred': task.starred }"
              >
                <svg
                  v-if="task.starred"
                  viewBox="0 0 24 24"
                  fill="#fbbc04"
                  width="18"
                  height="18"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  ></polygon>
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                  width="18"
                  height="18"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  ></polygon>
                </svg>
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
        <div class="list-header">
          <h2 class="list-title">{{ list.name }}</h2>
          <button
            class="icon-btn more-btn"
            @click="handleDeleteList(list)"
            title="删除列表"
          >
            <svg viewBox="0 0 24 24" fill="#5f6368" width="20" height="20">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  width="18"
                  height="18"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </span>
              <span class="add-text">添加任务</span>
            </div>

            <!-- 激活状态：添加任务输入框 -->
            <div v-else class="add-task-form">
              <div class="form-inputs">
                <button class="circle-empty" @click="cancelAdd(list)">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    width="20"
                    height="20"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </button>
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
              <div class="form-actions" style="justify-content: flex-end">
                <button class="save-btn" @click="saveTask(list)">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"
                    />
                  </svg>
                </button>
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
            v-show="
              !selectedDate ||
              (task.created_at &&
                task.created_at.substring(0, 10) === selectedDate)
            "
          >
            <button class="circle-btn" @click="toggleTask(task)">
              <svg
                v-if="task.completed"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                width="20"
                height="20"
              >
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
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
              <button
                class="action-btn delete-btn"
                @click="handleDeleteTask(list, task)"
                title="删除"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="18"
                  height="18"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
              <button
                class="action-btn"
                @click="toggleStar(task)"
                :class="{ 'is-starred': task.starred }"
              >
                <svg
                  v-if="task.starred"
                  viewBox="0 0 24 24"
                  fill="#fbbc04"
                  width="18"
                  height="18"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  ></polygon>
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                  width="18"
                  height="18"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  ></polygon>
                </svg>
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
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 24px;
  scroll-behavior: smooth;
}

.lists-wrapper {
  display: flex;
  gap: 24px;
  flex: 1;
  min-height: 0;
  align-items: flex-start;
}

/* 单个任务列表卡片 */
.task-list {
  width: 360px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  padding: 16px 16px;
  flex-shrink: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.03),
    0 1px 2px rgba(0, 0, 0, 0.02);
  position: relative;
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
  line-height: 1.2;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(26, 115, 232, 0.2);
}

.form-inputs {
  display: flex;
  gap: 12px;
}

.circle-empty {
  color: #5f6368;
  display: flex;
  align-items: flex-start;
  padding: 0;
  margin-top: 0;
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

.save-btn {
  background: transparent;
  color: #5f6368;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 12px 10px;
  border-radius: 10px;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.3s ease;
  cursor: pointer;
  background: transparent;
  margin-bottom: 2px;
}

.task-item:hover {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
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

.delete-btn:hover {
  background: #fce8e6;
  color: #d93025;
}

.circle-btn {
  color: #5f6368;
  padding: 0;
  margin-top: 0;
  display: flex;
  align-items: flex-start;
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
  line-height: 1.4;
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
