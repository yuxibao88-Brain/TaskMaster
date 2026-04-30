// ========== 认证中间件 ==========
// 作用：拦截需要登录的接口，验证 token 是否有效
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../routes/auth");

const authMiddleware = (req, res, next) => {
  // 从请求头取 token（前端会在 Authorization 头里带上）
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ code: 401, message: "未登录，请先登录" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer xxx" → 取 xxx

  try {
    // 验证 token，解出用户信息
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;       // 把 userId 挂到 req 上，后面的路由就能用了
    req.username = decoded.username;
    next(); // 验证通过，继续执行后面的路由
  } catch (err) {
    return res.json({ code: 401, message: "登录已过期，请重新登录" });
  }
};

module.exports = authMiddleware;
