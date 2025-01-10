import "dotenv/config";
import { forceUpdateConfig } from "../queries";

// Make sure we're not running in production
if (process.env.NODE_ENV === "production") {
  throw new Error("This script should not be run in production");
}

async function main() {
  console.log("Force updating configurations...");
  await forceUpdateConfig();
  console.log("Force update complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during force update:", err);
  process.exit(1);
}); 