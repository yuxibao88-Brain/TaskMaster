// 第6课（6.2）：SQLite 完整 CRUD — 增删改查
const Database = require("better-sqlite3");
const db = new Database("myapp.db");

// ========== 建表 ==========
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    job TEXT,
    age INTEGER
  )
`);

// ========== 增（INSERT）==========
console.log("===== 1. 新增用户 =====");
const add = db.prepare("INSERT INTO users (name, job, age) VALUES (?, ?, ?)");
add.run("张三", "前端开发", 25);
add.run("李四", "后端开发", 28);
add.run("王五", "产品经理", 30);
add.run("赵六", "测试工程师", 26);

const allUsers = db.prepare("SELECT * FROM users").all();
console.table(allUsers);

// ========== 查（SELECT）==========
console.log("===== 2. 查询 =====");

// 查所有人
console.log("所有人：");
console.table(db.prepare("SELECT * FROM users").all());

// 查一个人
console.log("找张三：");
console.log(db.prepare("SELECT * FROM users WHERE name = ?").get("张三"));

// 查年龄大于 26 的人
console.log("年龄 > 26 的人：");
console.table(db.prepare("SELECT * FROM users WHERE age > ?").all(26));

// ========== 改（UPDATE）==========
console.log("===== 3. 修改张三的工作 =====");
db.prepare("UPDATE users SET job = ? WHERE name = ?").run("全栈开发", "张三");

// 看看改了没
console.log(db.prepare("SELECT * FROM users WHERE name = ?").get("张三"));

// ========== 删（DELETE）==========
console.log("===== 4. 删除赵六 =====");
db.prepare("DELETE FROM users WHERE name = ?").run("赵六");

// 看看还剩谁
console.log("删除后：");
console.table(db.prepare("SELECT * FROM users").all());

db.close();
