// 第5课：Express 中间件（Middleware）
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

// ========== 什么是中间件？==========
// 中间件就是请求到达路由之前，先经过的一系列"关卡"
// 每个关卡可以做一些事情（记录日志、验证权限、解析数据等）
// 处理完后调用 next() 放行，让请求继续往下走

// ========== 1. 内置中间件 ==========
// 解析 JSON 请求体（你第4课已经用过了）
app.use(express.json());

// ========== 2. 第三方中间件：cors 解决跨域 ==========
// 前端 localhost:5173 请求后端 localhost:3001 会跨域报错
// 加上这一行，后端就允许前端跨域访问了
app.use(cors());

// ========== 3. 自定义中间件：请求日志 ==========
// 每次有请求进来，先打印日志，再放行
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next(); // 放行！不调用 next() 请求就卡住了
});

// ========== 4. 自定义中间件：模拟权限验证 ==========
// 只对 /admin 开头的路由生效
app.use("/admin", (req, res, next) => {
  const token = req.headers.token;
  if (token === "123456") {
    next(); // 有 token，放行
  } else {
    res.status(401).json({ code: 401, message: "未登录，请先登录" });
  }
});

// ========== 路由 ==========

// 普通接口，不需要验证
app.get("/api/user", (req, res) => {
  res.json({ code: 200, data: { name: "包玉玺", job: "前端开发" } });
});

// 需要验证的接口（/admin 开头，会先经过权限中间件）
app.get("/admin/dashboard", (req, res) => {
  res.json({ code: 200, data: { totalUsers: 100, todayVisits: 50 } });
});

// ========== 5. 错误处理中间件（放在最后）==========
// 当上面的代码出错时，会自动跳到这里
app.use((err, req, res, next) => {
  console.error("服务器出错：", err.message);
  res.status(500).json({ code: 500, message: "服务器内部错误" });
});

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`);
});
