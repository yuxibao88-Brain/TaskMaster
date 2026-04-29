// 第4课：Express 基础
const express = require("express");
const app = express();
const port = 3001;

// 解析前端发过来的 JSON 数据（POST/PUT 请求体）
app.use(express.json());

// ========== 1. GET 请求：获取数据 ==========

// 基础路由
app.get("/", (req, res) => {
  res.send("Hello Express！");
});

// 返回 JSON 数据
app.get("/api/user", (req, res) => {
  res.json({ code: 200, data: { name: "包玉玺", job: "前端开发" } });
});

// 路由参数 —— 获取指定 id 的用户（前端请求：axios.get("/api/user/123")）
app.get("/api/user/:id", (req, res) => {
  const id = req.params.id;
  res.json({ code: 200, data: { id, name: "用户" + id } });
});

// 查询参数 —— 搜索（前端请求：axios.get("/api/search?keyword=node&page=1")）
app.get("/api/search", (req, res) => {
  const { keyword, page } = req.query;
  res.json({ code: 200, data: { keyword, page } });
});

// ========== 2. POST 请求：新增数据 ==========
app.post("/api/user", (req, res) => {
  const { name, job } = req.body; // 获取前端传过来的数据
  res.json({ code: 200, message: "创建成功", data: { name, job } });
});

// ========== 3. PUT 请求：修改数据 ==========
app.put("/api/user/:id", (req, res) => {
  const id = req.params.id;
  const { name, job } = req.body;
  res.json({ code: 200, message: "修改成功", data: { id, name, job } });
});

// ========== 4. DELETE 请求：删除数据 ==========
app.delete("/api/user/:id", (req, res) => {
  const id = req.params.id;
  res.json({ code: 200, message: "删除成功", data: { id } });
});

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`);
});
