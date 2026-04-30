import request from "@/utils/request";

/** 查：获取所有任务列表（含任务） GET /api/vue-frontend/task-lists */
export async function getTaskLists() {
  return request("/api/vue-frontend/task-lists", {
    method: "GET",
  });
}

/** 增：新建任务列表 POST /api/vue-frontend/task-lists */
export async function addTaskList(body) {
  return request("/api/vue-frontend/task-lists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 改：修改列表名称 PUT /api/vue-frontend/task-lists/:id */
export async function updateTaskList(id, body) {
  return request(`/api/vue-frontend/task-lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 删：删除列表（级联删除任务） DELETE /api/vue-frontend/task-lists/:id */
export async function deleteTaskList(id) {
  return request(`/api/vue-frontend/task-lists/${id}`, {
    method: "DELETE",
  });
}
