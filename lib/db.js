const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.HOST_SQL,
    user: process.env.USER_SQL,
    password: process.env.PASSWORD_SQL,
    database: process.env.DATABASE_SQL,
    charset: 'utf8mb4' ,
    port: process.env.PORT_SQL
});

async function checkConnection() {
    try {
        const connection = await pool.getConnection(); // ใช้ getConnection() แทน connect()
        console.log('เชื่อมต่อฐานข้อมูลสำเร็จ!');
        connection.release();
    } catch (error) {
        console.error('ไม่สามารถเชื่อมต่อกับฐานข้อมูล:', error.message);
    }
}

checkConnection();

module.exports = pool;
