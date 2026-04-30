import request from "@/utils/request";

/** 注册 POST /api/vue-frontend/auth/register */
export async function register(body) {
  return request("/api/vue-frontend/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}

/** 登录 POST /api/vue-frontend/auth/login */
export async function login(body) {
  return request("/api/vue-frontend/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: body,
  });
}
