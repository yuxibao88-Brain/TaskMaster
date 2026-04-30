// 封装 axios 实例
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.PROD ? "" : "http://localhost:3001", // 生产环境使用相对路径，开发环境使用本地后端
  timeout: 5000,
});

// 请求拦截器：每次请求自动带上 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("请求失败", err);
    return Promise.reject(err);
  }
);

export default request;
