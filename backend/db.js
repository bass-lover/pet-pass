const mysql = require('mysql2/promise');

// 创建数据库连接池（小皮面板默认配置）
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // 小皮默认密码，如果你改了就填自己的
  database: 'animal_park', // 你创建的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 【必须加这一行！】把db对象导出，供其他文件引用
module.exports = db;