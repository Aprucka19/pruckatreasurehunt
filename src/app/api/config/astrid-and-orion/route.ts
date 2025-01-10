import { getAstridAndOrionConfig } from "~/server/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getAstridAndOrionConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching Astrid and Orion config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
} 