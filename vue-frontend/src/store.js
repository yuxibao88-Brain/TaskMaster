import { ref, computed } from "vue";

// ========== 纯状态（不含任何 API 调用） ==========
export const isSidebarOpen = ref(true);
export const currentMenu = ref("all");
export const isListsCollapsed = ref(false);
export const showNewListModal = ref(false);
export const newListName = ref("");
export const dateOptions = ["今天", "明天", "周一"];

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
  list.newTaskDate = "";
};

export const setDate = (list, date) => {
  list.newTaskDate = list.newTaskDate === date ? "" : date;
};

export const cancelAdd = (list) => {
  list.isAdding = false;
};
