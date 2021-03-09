import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const sqlPromise = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

(async () => {
  const sql = await sqlPromise;
  // handle unexpected errors by just logging them
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });
})();

export default sqlPromise;
