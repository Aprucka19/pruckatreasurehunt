import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  varchar,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

//
// We’ll prefix table names with "pruckatreasurehunt_" for multi-project separation.
//
export const createTable = pgTableCreator(
  (name) => `pruckatreasurehunt_${name}`
);

//
// Define the single table to store all config data.
//
export const configurations = createTable(
  "configurations",
  {
    id: serial("id").primaryKey(),

    // E.g. "MerryChristmasConfig", "AstridAndOrionConfig", "ParagonConfig"
    section: varchar("section", { length: 256 }).notNull(),

    // The entire config object for the section
    config: jsonb("config").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    sectionUnique: uniqueIndex("config_section_unique").on(table.section),
  })
);
