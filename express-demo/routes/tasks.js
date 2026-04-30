// ========== 任务路由 ==========
const express = require("express");
const router = express.Router(); // 创建路由实例
const db = require("../db"); // 引入数据库实例

// 增：在指定列表下新增任务
router.post("/lists/:listId/tasks", (req, res) => {
  const { listId } = req.params;
  const { title, details, date } = req.body;
  const result = db
    .prepare(
      "INSERT INTO tasks (list_id, title, details, date) VALUES (?, ?, ?, ?)",
    )
    .run(listId, title, details || "", date || "");
  res.json({
    code: 200,
    data: { id: result.lastInsertRowid },
    message: "添加成功",
  });
});

// 改：修改任务内容
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, details, date } = req.body;
  db.prepare(
    "UPDATE tasks SET title = ?, details = ?, date = ? WHERE id = ?",
  ).run(title, details, date, id);
  res.json({ code: 200, message: "修改成功" });
});

// 改：切换完成/星标状态（局部更新）
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  // 请求体里传什么就改什么
  if ("completed" in req.body) {
    db.prepare("UPDATE tasks SET completed = ? WHERE id = ?").run(
      req.body.completed,
      id,
    );
  }
  if ("starred" in req.body) {
    db.prepare("UPDATE tasks SET starred = ? WHERE id = ?").run(
      req.body.starred,
      id,
    );
  }
  res.json({ code: 200, message: "更新成功" });
});

// 删：删除任务
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  res.json({ code: 200, message: "删除成功" });
});

module.exports = router;
