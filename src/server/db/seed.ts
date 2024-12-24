import 'dotenv/config'; // This loads variables from .env into process.env
import { env } from "../../env";
import { db, conn } from "./index";
import { initializeConfig } from "../queries";
// seed.ts


async function seed() {
  try {
    await initializeConfig();
    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await conn.end();
  }
}

seed().catch((err) => {
  console.error("❌ Fatal error during seed:", err);
  process.exit(1);
}); 