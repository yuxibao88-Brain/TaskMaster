// ========== 服务入口文件 ==========
const express = require("express");
const cors = require("cors");

// 引入数据库（会自动执行建表）
require("./db");

// 引入路由模块
const taskListsRouter = require("./routes/taskLists");
const tasksRouter = require("./routes/tasks");

const app = express();

// 中间件
app.use(cors());         // 允许前端跨域访问
app.use(express.json()); // 解析 JSON 请求体

// 注册路由
// 这里的路径是"前缀"，会拼接到路由文件里的路径前面
// 比如 taskListsRouter 里写 router.get("/")，实际访问路径就是 /api/vue-frontend/task-lists/
app.use("/api/vue-frontend/task-lists", taskListsRouter);
app.use("/api/vue-frontend/tasks", tasksRouter);

// 启动服务
app.listen(3001, () => {
  console.log("后端服务已启动：http://localhost:3001");
});
