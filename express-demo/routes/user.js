const express = require("express");
const router = express.Router();
const db = require("../db");

// 获取当前用户信息
router.get("/profile", (req, res) => {
  const userId = req.userId;
  const user = db.prepare("SELECT id, username, nickname, avatar, bio, created_at FROM users WHERE id = ?").get(userId);
  if (!user) {
    return res.status(404).json({ code: 404, message: "用户不存在" });
  }
  res.json({ code: 200, message: "获取成功", data: user });
});

// 更新当前用户信息
router.put("/profile", (req, res) => {
  const userId = req.userId;
  const { nickname, avatar, bio } = req.body;
  
  db.prepare("UPDATE users SET nickname = ?, avatar = ?, bio = ? WHERE id = ?").run(
    nickname || "",
    avatar || "",
    bio || "",
    userId
  );
  
  res.json({ code: 200, message: "资料更新成功" });
});

module.exports = router;
