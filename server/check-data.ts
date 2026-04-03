
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const client = await pool.connect();
  try {
    const users = await client.query("SELECT * FROM users");
    console.log("👥 Users:", users.rows.map(u => ({ id: u.id, username: u.username })));
    
    const roadmaps = await client.query("SELECT * FROM roadmaps");
    console.log("🗺️ Roadmaps:", roadmaps.rows.map(r => ({ id: r.id, user_id: r.user_id, role: r.role })));
    
    const interviews = await client.query("SELECT * FROM interviews");
    console.log("🎤 Interviews:", interviews.rows.map(i => ({ id: i.id, user_id: i.user_id, topic: i.topic })));
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

check();
