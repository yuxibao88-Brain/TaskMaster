// 第3课：内置模块 http — 起一个 Web 服务
const http = require("http");

// 创建服务器，根据不同 URL 返回不同数据（路由）
const server = http.createServer((req, res) => {
  // 统一设置响应头
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });

  // 根据请求路径返回不同内容
  if (req.url === "/api/user") {
    res.end(JSON.stringify({
      code: 200,
      data: { name: "张三", age: 25, role: "前端开发" },
    }));
  } else if (req.url === "/api/list") {
    res.end(JSON.stringify({
      code: 200,
      data: [
        { id: 1, title: "学习 Node.js" },
        { id: 2, title: "学习 Express" },
        { id: 3, title: "学习数据库" },
      ],
    }));
  } else {
    res.end(JSON.stringify({ code: 404, message: "接口不存在" }));
  }
});

// 监听 3000 端口，浏览器访问 http://localhost:3000
server.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});
