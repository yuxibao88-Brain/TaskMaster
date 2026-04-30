// ========== 服务入口文件 ==========
const express = require("express");
const cors = require("cors");

// 引入数据库（会自动执行建表）
require("./db");

// 引入路由模块
const authRouter = require("./routes/auth");
const taskListsRouter = require("./routes/taskLists");
const tasksRouter = require("./routes/tasks");

// 引入认证中间件
const authMiddleware = require("./middleware/auth");

const app = express();

// 中间件
app.use(cors());         // 允许前端跨域访问
app.use(express.json()); // 解析 JSON 请求体

// 注册路由
// 登录注册不需要 token 验证（公开接口）
app.use("/api/vue-frontend/auth", authRouter);

// 以下接口需要登录后才能访问（受保护接口）
app.use("/api/vue-frontend/task-lists", authMiddleware, taskListsRouter);
app.use("/api/vue-frontend/tasks", authMiddleware, tasksRouter);

// 启动服务
app.listen(3001, () => {
  console.log("后端服务已启动：http://localhost:3001");
});
