// ========== 数据库连接 + 建表 ==========
const Database = require("better-sqlite3");
const path = require("path");

// 使用环境变量中的路径，或者默认使用当前目录下的 myapp.db
const dbPath = process.env.DB_PATH || path.join(__dirname, "myapp.db");
const db = new Database(dbPath);

// 用户表
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 主键自增
  username TEXT NOT NULL UNIQUE,                -- 用户名（唯一）
  password TEXT NOT NULL,                       -- 密码（加密后存储）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 注册时间
)`);

// 添加用户资料字段（头像、昵称、签名）
try { db.exec("ALTER TABLE users ADD COLUMN nickname TEXT DEFAULT ''"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ''"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT ''"); } catch (e) {}

// 任务列表表（每个列表属于某个用户）
db.exec(`CREATE TABLE IF NOT EXISTS task_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 主键自增
  user_id INTEGER NOT NULL,                    -- 所属用户 ID
  name TEXT NOT NULL,                           -- 列表名称
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 创建时间
)`);

// 任务表（每条任务属于某个列表）
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 主键自增
  list_id INTEGER NOT NULL,                    -- 所属列表 ID
  title TEXT NOT NULL,                         -- 任务标题
  details TEXT DEFAULT '',                     -- 任务详情
  date TEXT DEFAULT '',                        -- 日期标签
  completed INTEGER DEFAULT 0,                 -- 是否完成
  starred INTEGER DEFAULT 0,                   -- 是否加星
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 创建时间
)`);

// 导出 db 实例，供路由文件使用
module.exports = db;
