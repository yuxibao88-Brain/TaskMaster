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

// Google 登录
const { OAuth2Client } = require("google-auth-library");
// 这里换成你的 Google Client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.json({ code: 400, message: "缺少 Google 凭证" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    // 查找用户，如果没有则自动注册
    let user = db.prepare("SELECT * FROM users WHERE username = ?").get(email);
    
    if (!user) {
      // 创建新用户，因为是第三方登录，密码可以留空或随机
      const result = db
        .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
        .run(email, ""); // 第三方登录不需要密码
      user = { id: result.lastInsertRowid, username: email };
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      code: 200,
      message: "Google 登录成功",
      data: { token, username: user.username },
    });
  } catch (error) {
    console.error("Google 登录失败:", error);
    res.json({ code: 401, message: "Google 登录验证失败，请检查 Client ID 是否配置正确" });
  }
});

module.exports = router;

// 同时导出密钥和验证中间件，供其他路由使用
module.exports.JWT_SECRET = JWT_SECRET;
