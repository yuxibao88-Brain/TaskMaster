// ========== 认证路由（注册 + 登录） ==========
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs"); // 密码加密
const jwt = require("jsonwebtoken"); // 生成 token

// JWT 密钥（真实项目要放环境变量里，这里学习用先写死）
const JWT_SECRET = "my-task-app-secret-key-2026";

// 注册
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // 校验参数
  if (!username || !password) {
    return res.json({ code: 400, message: "用户名和密码不能为空" });
  }

  // 检查用户名是否已存在
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (existing) {
    return res.json({ code: 400, message: "用户名已存在" });
  }

  // 加密密码（不存明文，安全！）
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 插入用户
  const result = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);

  res.json({ code: 200, message: "注册成功", data: { id: result.lastInsertRowid } });
});

// 登录
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 校验参数
  if (!username || !password) {
    return res.json({ code: 400, message: "用户名和密码不能为空" });
  }

  // 查找用户
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.json({ code: 400, message: "用户名不存在" });
  }

  // 验证密码（把输入的密码和数据库里加密后的密码比对）
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.json({ code: 400, message: "密码错误" });
  }

  // 生成 JWT token（有效期 7 天）
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    code: 200,
    message: "登录成功",
    data: { token, username: user.username },
  });
});

module.exports = router;

// 同时导出密钥和验证中间件，供其他路由使用
module.exports.JWT_SECRET = JWT_SECRET;
