// 第6课（6.3）：Express + SQLite — 完整 CRUD 接口
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const db = new Database("myapp.db");
const app = express();

app.use(cors()); // 允许前端跨域访问
app.use(express.json()); // 解析请求体

// 查：获取用户列表
app.get("/api/vue-frontend/users/list", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json({ code: 200, data: users });
});

// 增：新增用户
app.post("/api/vue-frontend/users/add", (req, res) => {
  const { name, job, age } = req.body;
  db.prepare("INSERT INTO users (name, job, age) VALUES (?, ?, ?)").run(
    name,
    job,
    age,
  );
  res.json({ code: 200, message: "添加成功" });
});

// 改：修改用户
app.post("/api/vue-frontend/users/edit", (req, res) => {
  const { id, name, job, age } = req.body;
  db.prepare("UPDATE users SET name = ?, job = ?, age = ? WHERE id = ?").run(
    name,
    job,
    age,
    id,
  );
  res.json({ code: 200, message: "修改成功" });
});

// 删：删除用户
app.post("/api/vue-frontend/users/delete", (req, res) => {
  const { id } = req.body;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  res.json({ code: 200, message: "删除成功" });
});

app.listen(3001, () => {
  console.log("后端服务已启动：http://localhost:3001");
});
