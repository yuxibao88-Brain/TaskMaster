import request from "@/utils/request";

/** 增：在指定列表下新增任务 POST /api/vue-frontend/tasks/lists/:listId/tasks */
export async function addTask(listId, body) {
  return request(`/api/vue-frontend/tasks/lists/${listId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 改：修改任务内容 PUT /api/vue-frontend/tasks/:id */
export async function updateTask(id, body) {
  return request(`/api/vue-frontend/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 改：切换完成/星标状态 PATCH /api/vue-frontend/tasks/:id */
export async function patchTask(id, body) {
  return request(`/api/vue-frontend/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 删：删除任务 DELETE /api/vue-frontend/tasks/:id */
export async function deleteTask(id) {
  return request(`/api/vue-frontend/tasks/${id}`, {
    method: "DELETE",
  });
}
