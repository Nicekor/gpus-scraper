import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

const promisePool = pool.promise();

(async () => {
  const sql = await promisePool;
  // handle unexpected errors by just logging them
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });
})();

export default promisePool;
