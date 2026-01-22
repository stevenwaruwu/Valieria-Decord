import { pool } from "../server/db";

async function check() {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    console.log("Current Tables:", rows);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
}

check();
