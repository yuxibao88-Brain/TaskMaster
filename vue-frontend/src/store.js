import { ref, computed } from "vue";

export const isSidebarOpen = ref(true);
export const currentMenu = ref("all");
export const isListsCollapsed = ref(false);
export const showNewListModal = ref(false);
export const newListName = ref("");
export const dateOptions = ["今天", "明天", "周一"];

export const lists = ref([
  {
    id: 1,
    name: "我的任务",
    isAdding: false,
    newTaskTitle: "",
    newTaskDetails: "",
    newTaskDate: "",
    tasks: [
      { id: 101, title: "12312", completed: false, date: "", starred: false },
      { id: 102, title: "2123", completed: false, date: "", starred: false },
    ],
  },
  {
    id: 2,
    name: "飞常准-工作",
    isAdding: false,
    newTaskTitle: "",
    newTaskDetails: "",
    newTaskDate: "",
    tasks: [{ id: 201, title: "123", completed: false, date: "", starred: false }],
  },
]);

export const allStarredTasks = computed(() => {
  const starred = [];
  lists.value.forEach(list => {
    list.tasks.forEach(task => {
      if (task.starred) starred.push(task);
    });
  });
  return starred;
});

export const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

export const openAddTask = (list) => {
  list.isAdding = true;
  list.newTaskTitle = "";
  list.newTaskDetails = "";
  list.newTaskDate = "";
};

export const createNewList = () => {
  if (!newListName.value.trim()) return;
  lists.value.push({
    id: Date.now(),
    name: newListName.value.trim(),
    isAdding: false,
    newTaskTitle: "",
    newTaskDetails: "",
    newTaskDate: "",
    tasks: [],
  });
  newListName.value = "";
  showNewListModal.value = false;
};

export const setDate = (list, date) => {
  list.newTaskDate = list.newTaskDate === date ? "" : date;
};

export const saveTask = (list) => {
  if (!list.newTaskTitle.trim()) {
    list.isAdding = false;
    return;
  }
  list.tasks.unshift({
    id: Date.now(),
    title: list.newTaskTitle,
    details: list.newTaskDetails,
    date: list.newTaskDate,
    completed: false,
    starred: false,
  });
  list.newTaskTitle = "";
  list.newTaskDetails = "";
  list.newTaskDate = "";
};

export const toggleTask = (task) => {
  task.completed = !task.completed;
};

export const toggleStar = (task) => {
  task.starred = !task.starred;
};

export const cancelAdd = (list) => {
  list.isAdding = false;
};
