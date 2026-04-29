// 封装 axios 实例
import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  baseURL: "http://localhost:3001", // 后端地址，只写一次
  timeout: 5000, // 超时时间 5 秒
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (res) => res.data, // 成功时直接返回 data，不用每次 .data
  (err) => {
    ElMessage.error("请求失败，请稍后重试");
    return Promise.reject(err);
  }
);

export default request;
