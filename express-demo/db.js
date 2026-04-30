// ========== 数据库连接 + 建表 ==========
const Database = require("better-sqlite3");

const db = new Database("myapp.db");

// 任务列表表（一个列表下面可以有多个任务，一对多关系）
db.exec(`CREATE TABLE IF NOT EXISTS task_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 主键自增
  name TEXT NOT NULL,                           -- 列表名称，如"我的任务"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 创建时间，自动填充
)`);

// 任务表（每条任务都属于某个列表，通过 list_id 关联）
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 主键自增
  list_id INTEGER NOT NULL,                    -- 所属列表 ID（外键，关联 task_lists.id）
  title TEXT NOT NULL,                         -- 任务标题
  details TEXT DEFAULT '',                     -- 任务详情
  date TEXT DEFAULT '',                        -- 日期标签（"今天"/"明天"等）
  completed INTEGER DEFAULT 0,                 -- 是否完成（0=未完成，1=已完成）
  starred INTEGER DEFAULT 0,                   -- 是否加星（0=否，1=是）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- 创建时间
)`);

// 导出 db 实例，供路由文件使用
module.exports = db;
