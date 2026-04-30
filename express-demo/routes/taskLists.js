// ========== 任务列表路由 ==========
const express = require("express");
const router = express.Router(); // 创建路由实例
const db = require("../db"); // 引入数据库实例

// 查询所有任务列表（含每个列表下的任务）
router.get("/", (req, res) => {
  const lists = db.prepare("SELECT * FROM task_lists").all();
  res.json({ code: 200, data: lists });
});

// TODO: 后续你来补充以下接口 ↓
// router.post("/", ...)       → 新建列表
// router.put("/:id", ...)     → 修改列表名称
// router.delete("/:id", ...)  → 删除列表（级联删除任务）

module.exports = router;
