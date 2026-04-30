<script setup>
import { showNewListModal, newListName, createNewList } from "../store.js";
</script>

<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="showNewListModal" @click.self="showNewListModal = false">
      <div class="modal-card">
        <h3 class="modal-title">新建列表</h3>
        <div class="modal-input-wrapper">
          <input
            type="text"
            class="modal-input"
            v-model="newListName"
            placeholder="输入列表名称"
            @keyup.enter="createNewList"
            autofocus
          />
        </div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showNewListModal = false">
            取消
          </button>
          <button class="modal-btn confirm" :disabled="!newListName.trim()" @click="createNewList">
            完成
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* ================= 模态弹窗 (新建任务列表) ================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(32, 33, 36, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  width: 400px;
  border-radius: 12px;
  padding: 24px;
  box-shadow:
    0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #202124;
}

.modal-input-wrapper {
  background: #f1f3f4;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid #1a73e8;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  color: #202124;
  box-sizing: border-box;
  border: none;
  outline: none;
  background: transparent;
}

.modal-input::placeholder {
  color: #5f6368;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.modal-btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  border: none;
  background: transparent;
}

.modal-btn.cancel {
  color: #1a73e8;
}

.modal-btn.cancel:hover {
  background: rgba(26, 115, 232, 0.04);
}

.modal-btn.confirm {
  color: #1a73e8;
}

.modal-btn.confirm:hover:not(:disabled) {
  background: rgba(26, 115, 232, 0.04);
}

.modal-btn.confirm:disabled {
  color: #9aa0a6;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
