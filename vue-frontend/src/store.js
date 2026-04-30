import { ref, computed } from "vue";

// ========== 纯状态（不含任何 API 调用） ==========
export const isSidebarOpen = ref(true);
export const currentMenu = ref("all");
export const isListsCollapsed = ref(false);
export const showNewListModal = ref(false);
export const newListName = ref("");

// 选中的日历日期过滤（默认选中今天）
const today = new Date();
const _m = String(today.getMonth() + 1).padStart(2, "0");
const _d = String(today.getDate()).padStart(2, "0");
export const selectedDate = ref(`${today.getFullYear()}-${_m}-${_d}`);

export const lists = ref([]);

// 星标任务：从所有列表中聚合
export const allStarredTasks = computed(() => {
  const starred = [];
  lists.value.forEach((list) => {
    list.tasks.forEach((task) => {
      if (task.starred) starred.push(task);
    });
  });
  return starred;
});

// ========== 纯操作方法（只操作本地状态） ==========

export const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

export const openAddTask = (list) => {
  list.isAdding = true;
  list.newTaskTitle = "";
  list.newTaskDetails = "";
};

export const cancelAdd = (list) => {
  list.isAdding = false;
};
