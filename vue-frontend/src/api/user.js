import request from "@/utils/request";

/**
 * 获取当前用户资料
 * GET /api/vue-frontend/user/profile
 */
export async function getUserProfile() {
  return request("/api/vue-frontend/user/profile", {
    method: "GET",
  });
}

/**
 * 更新用户资料
 * PUT /api/vue-frontend/user/profile
 * @param {Object} data - { nickname, avatar, bio }
 */
export async function updateUserProfile(data) {
  return request("/api/vue-frontend/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data,
  });
}
