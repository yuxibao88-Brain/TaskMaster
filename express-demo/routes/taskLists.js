// ========== 任务列表路由 ==========
const express = require("express");
const router = express.Router();
const db = require("../db");

// 查：获取当前用户的所有任务列表（含任务）
router.get("/", (req, res) => {
  // req.userId 是中间件验证 token 后挂上去的
  const lists = db.prepare("SELECT * FROM task_lists WHERE user_id = ?").all(req.userId);
  lists.forEach((list) => {
    list.tasks = db.prepare("SELECT * FROM tasks WHERE list_id = ?").all(list.id);
  });
  res.json({ code: 200, data: lists });
});

// 增：新建列表（绑定当前用户）
router.post("/", (req, res) => {
  const { name } = req.body;
  const result = db.prepare("INSERT INTO task_lists (user_id, name) VALUES (?, ?)").run(req.userId, name);
  res.json({ code: 200, data: { id: result.lastInsertRowid }, message: "创建成功" });
});

// 改：修改列表名称
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.prepare("UPDATE task_lists SET name = ? WHERE id = ? AND user_id = ?").run(name, id, req.userId);
  res.json({ code: 200, message: "修改成功" });
});

// 删：删除列表（级联删除任务）
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM tasks WHERE list_id = ?").run(id);
  db.prepare("DELETE FROM task_lists WHERE id = ? AND user_id = ?").run(id, req.userId);
  res.json({ code: 200, message: "删除成功" });
});

module.exports = router;
