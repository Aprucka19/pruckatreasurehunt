import { db } from "~/server/db";
import { configurations } from "~/server/db/schema";
import { config } from "~/config/config";
import { eq } from "drizzle-orm";

// Function to initialize the configuration in the database
export async function initializeConfig() {
  try {
    // Get all existing configurations
    const existingConfigs = await db
      .select({ section: configurations.section })
      .from(configurations);

    const existingSections = new Set(existingConfigs.map(c => c.section));

    // Create array of configs that don't exist yet
    const configsToInsert = [
      {
        section: "MerryChristmasConfig",
        config: config.MerryChristmasConfig,
      },
      {
        section: "AstridAndOrionConfig",
        config: config.AstridAndOrionConfig,
      },
      {
        section: "ParagonConfig",
        config: config.ParagonConfig,
      },
      {
        section: "Game2048Config",
        config: config.Game2048Config,
      }
    ].filter(cfg => !existingSections.has(cfg.section));

    if (configsToInsert.length > 0) {
      await db.insert(configurations).values(configsToInsert);
      console.log(`Initialized ${configsToInsert.length} new configurations`);
    } else {
      console.log("All configurations already exist");
    }
  } catch (error) {
    console.error("Error initializing configuration:", error);
    throw error;
  }
}

// Function to get configuration by section
export async function getConfigBySection(section: string) {
  const result = await db
    .select()
    .from(configurations)
    .where(eq(configurations.section, section))
    .limit(1);
  
  return result[0]?.config ?? {};
}

// Function to update configuration
export async function updateConfig(
  section: string,
  newConfig: Record<string, unknown>
) {
  await db
    .update(configurations)
    .set({ 
      config: newConfig,
      updatedAt: new Date(),
    })
    .where(eq(configurations.section, section));
}

export async function getMerryChristmasConfig() {
  const config = await getConfigBySection("MerryChristmasConfig") as typeof import("~/config/config").config.MerryChristmasConfig;
  if (!config.requiredScore || !config.clue) {
    throw new Error("MerryChristmas configuration is missing required fields");
  }
  return config;
}

export async function getAstridAndOrionConfig() {
  const config = await getConfigBySection("AstridAndOrionConfig") as typeof import("~/config/config").config.AstridAndOrionConfig;
  if (!config.correctWordle || !config.correctPurpleGroup || !config.correctStrandsTheme || !config.clue) {
    throw new Error("AstridAndOrion configuration is missing required fields");
  }
  return config;
}

export async function getParagonConfig() {
  const config = await getConfigBySection("ParagonConfig") as typeof import("~/config/config").config.ParagonConfig;
  if (!config.minesweeper || !config.clue) {
    throw new Error("Paragon configuration is missing required fields");
  }
  return config;
}

export async function get2048Config() {
  const config = await getConfigBySection("Game2048Config") as typeof import("~/config/config").config.Game2048Config;
  if (!config.targetScore || !config.clue) {
    throw new Error("2048 configuration is missing required fields");
  }
  return config;
}
  