import request from "@/utils/request";

/** 查：获取用户列表 GET /api/vue-frontend/users/list */
export async function getUserList(options) {
  return request("/api/vue-frontend/users/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 增：新增用户 POST /api/vue-frontend/users/add */
export async function addUser(body, options) {
  return request("/api/vue-frontend/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 改：修改用户 POST /api/vue-frontend/users/edit */
export async function editUser(body, options) {
  return request("/api/vue-frontend/users/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删：删除用户 POST /api/vue-frontend/users/delete */
export async function deleteUser(body, options) {
  return request("/api/vue-frontend/users/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
