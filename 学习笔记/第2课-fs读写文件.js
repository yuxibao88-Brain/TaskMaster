// 第2课：内置模块 fs — 读写文件
const fs = require("fs");
const fsp = require("fs/promises"); // Promise 版本，用于 async/await

// 1.同步--方式
// 写文件
fs.writeFileSync("hello.txt", "这是 Node.js 写的内容");
console.log("文件写入成功");

// 读文件
const content = fs.readFileSync("hello.txt", "utf-8");
console.log("文件内容：", content);

// 2.异步--回调函数方式
// 写文件
fs.writeFile("hello.txt", "这是 Node.js 写的内容", (err) => {
  if (err) {
    console.error("写入失败", err);
    return;
  }
  console.log("文件写入成功");

  // 读文件
  fs.readFile("hello.txt", "utf-8", (err, data) => {
    if (err) {
      console.error("读取失败", err);
      return;
    }
    console.log("文件内容：", data);
  });
});

// 3.Promise + async/await 方式
async function run() {
  try {
    await fsp.writeFile("hello.txt", "我使用promise方式读写文件");

    console.log("写入文件成功");

    const data = await fsp.readFile("hello.txt", "utf-8");

    console.log("读取文件成功", data);
  } catch (err) {
    console.error("出错了：", err);
  }
}
run();
