import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { configurations } from "~/server/db/schema";

export async function GET() {
  try {
    const configs = await db.select().from(configurations);
    const configObject = configs.reduce((acc, curr) => {
      acc[curr.section] = curr.config;
      return acc;
    }, {} as Record<string, unknown>);
    
    return NextResponse.json(configObject);
  } catch (error) {
    console.error("Error fetching configs:", error);
    return NextResponse.json({ error: "Failed to fetch configs" }, { status: 500 });
  }
} 