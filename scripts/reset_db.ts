import { pool } from "../server/db";

async function reset() {
  try {
    console.log("Dropping tables...");
    await pool.query("DROP TABLE IF EXISTS order_items");
    await pool.query("DROP TABLE IF EXISTS orders");
    await pool.query("DROP TABLE IF EXISTS products");
    await pool.query("DROP TABLE IF EXISTS product");
    await pool.query("DROP TABLE IF EXISTS product_skus");
    await pool.query("DROP TABLE IF EXISTS users");
    await pool.query("DROP TABLE IF EXISTS sessions");
    // Optional: Drop users if you want a full clean slate, but let's keep auth for now if compatible
    // await pool.query("DROP TABLE IF EXISTS users");
    // await pool.query("DROP TABLE IF EXISTS sessions"); 
    console.log("Tables dropped successfully.");
  } catch (e) {
    console.error("Error dropping tables:", e);
  } finally {
    process.exit(0);
  }
}

reset();
