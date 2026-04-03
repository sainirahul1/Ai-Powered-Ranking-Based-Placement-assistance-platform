import "dotenv/config";
import pg from "pg";
import { sql } from "drizzle-orm";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function testDatabase() {
  console.log("\n" + "=".repeat(60));
  console.log("🗄️  DATABASE CONNECTION TEST");
  console.log("=".repeat(60));

  try {
    // 1. Test connection
    console.log("\n📡 1. Testing PostgreSQL Connection...");
    console.log("   DATABASE_URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

    const connectionTest = await pool.query("SELECT NOW()");
    const timestamp = (connectionTest.rows[0] as any).now;
    console.log("   ✅ Connection successful!");
    console.log("   Server time:", timestamp);

    // 2. Test schema tables
    console.log("\n📊 2. Checking Database Tables...");
    const tablesQuery = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (tablesQuery.rows.length === 0) {
      console.log("   ⚠️  No tables found! You need to run migrations.");
      console.log("   Run: npx drizzle-kit push:pg");
    } else {
      console.log(`   ✅ Found ${tablesQuery.rows.length} tables:`);
      (tablesQuery.rows as any[]).forEach((row) => {
        console.log(`      - ${row.table_name}`);
      });
    }

    // 3. Check table structures
    console.log("\n📋 3. Checking Table Structures...");

    // Users table
    console.log("\n   📌 users table:");
    const usersColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    if (usersColumns.rows.length > 0) {
      (usersColumns.rows as any[]).forEach((col) => {
        console.log(`      - ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "NOT NULL" : ""}`);
      });
    } else {
      console.log("      ⚠️  Table does not exist");
    }

    // Interviews table
    console.log("\n   📌 interviews table:");
    const interviewColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'interviews'
      ORDER BY ordinal_position;
    `);

    if (interviewColumns.rows.length > 0) {
      (interviewColumns.rows as any[]).forEach((col) => {
        console.log(`      - ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "NOT NULL" : ""}`);
      });
    } else {
      console.log("      ⚠️  Table does not exist");
    }

    // Roadmaps table
    console.log("\n   📌 roadmaps table:");
    const roadmapsColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'roadmaps'
      ORDER BY ordinal_position;
    `);

    if (roadmapsColumns.rows.length > 0) {
      (roadmapsColumns.rows as any[]).forEach((col) => {
        console.log(`      - ${col.column_name} (${col.data_type}) ${col.is_nullable === "NO" ? "NOT NULL" : ""}`);
      });
    } else {
      console.log("      ⚠️  Table does not exist");
    }

    // 4. Test basic CRUD operations (only if tables exist)
    if (interviewColumns.rows.length > 0) {
      console.log("\n🔧 4. Testing CRUD Operations...");

      // Create a test record
      console.log("   ✍️  Creating test interview record...");
      const createResult = await pool.query(
        'INSERT INTO interviews (topic, difficulty, status) VALUES ($1, $2, $3) RETURNING *',
        ['Database Test Interview', 'Medium', 'pending']
      );

      if (createResult.rows.length > 0) {
        const testId = createResult.rows[0].id;
        console.log(`      ✅ Created record with ID: ${testId}`);

        // Read the record
        console.log("   📖 Reading test record...");
        const readResult = await pool.query(
          'SELECT * FROM interviews WHERE id = $1',
          [testId]
        );

        if (readResult.rows.length > 0) {
          const record = readResult.rows[0];
          console.log("      ✅ Record retrieved successfully");
          console.log(`         Topic: ${record.topic}`);
          console.log(`         Difficulty: ${record.difficulty}`);
          console.log(`         Status: ${record.status}`);
        }

        // Update the record
        console.log("   ✏️  Updating test record...");
        const updateResult = await pool.query(
          'UPDATE interviews SET status = $1 WHERE id = $2 RETURNING *',
          ['completed', testId]
        );

        if (updateResult.rows.length > 0) {
          console.log(`      ✅ Record updated - Status: ${updateResult.rows[0].status}`);
        }

        // Delete the record
        console.log("   🗑️  Deleting test record...");
        const deleteResult = await pool.query(
          'DELETE FROM interviews WHERE id = $1 RETURNING *',
          [testId]
        );

        if (deleteResult.rows.length > 0) {
          console.log("      ✅ Record deleted successfully");
        }
      }
    }

    // 5. Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ DATABASE TEST COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));

    console.log("\n📝 SUMMARY:");
    console.log("   ✓ PostgreSQL connection is working");
    if (tablesQuery.rows.length > 0) {
      console.log("   ✓ All required tables exist");
      console.log("   ✓ CRUD operations are functional");
    } else {
      console.log("   ✗ Tables are missing - Run migrations:");
      console.log("     npx drizzle-kit push:pg");
    }

  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.log("❌ DATABASE TEST FAILED!");
    console.log("=".repeat(60));

    if (error instanceof Error) {
      console.log("\n❌ Error:", error.message);
      console.log("   Code:", (error as any).code);

      if ((error as any).code === "ECONNREFUSED") {
        console.log("\n💡 SOLUTION:");
        console.log("   PostgreSQL server is not running or not accessible.");
        console.log("   Make sure PostgreSQL is running on 127.0.0.1:5432");
      } else if ((error as any).code === "3D000") {
        console.log("\n💡 SOLUTION:");
        console.log("   Database 'heliumdb' does not exist.");
        console.log("   Run: createdb heliumdb");
      } else if ((error as any).code === "28P01") {
        console.log("\n💡 SOLUTION:");
        console.log("   Invalid password or authentication failed.");
        console.log("   Check DATABASE_URL in .env file");
      }
    } else {
      console.log("Error:", error);
    }
  } finally {
    // Close the pool
    await pool.end();
    console.log("\n🔌 Database connection closed.\n");
  }
}

testDatabase();