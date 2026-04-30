// ========== 服务入口文件 ==========
const express = require("express");
const cors = require("cors");

// 引入数据库（会自动执行建表）
require("./db");

// 引入路由模块
const authRouter = require("./routes/auth");
const taskListsRouter = require("./routes/taskLists");
const tasksRouter = require("./routes/tasks");
const userRouter = require("./routes/user");

// 引入认证中间件
const authMiddleware = require("./middleware/auth");
const path = require("path");

const app = express();

// 中间件
app.use(cors());         // 允许前端跨域访问
app.use(express.json({ limit: "5mb" })); // 解析 JSON 请求体，并设置 5MB 大小限制以支持 Base64 头像上传
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 托管静态文件（Vue 打包后的文件放在 public 目录下）
app.use(express.static(path.join(__dirname, "public")));

// 注册路由
// 登录注册不需要 token 验证（公开接口）
app.use("/api/vue-frontend/auth", authRouter);

// 以下接口需要登录后才能访问（受保护接口）
app.use("/api/vue-frontend/task-lists", authMiddleware, taskListsRouter);
app.use("/api/vue-frontend/tasks", authMiddleware, tasksRouter);
app.use("/api/vue-frontend/user", authMiddleware, userRouter);

// 兜底路由：如果不是以 /api 开头的请求，全部返回前端的 index.html，以支持 Vue Router 的 History 模式
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 启动服务
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
});
