import { NextResponse } from "next/server";
import { get2048Config } from "~/server/queries";

export async function GET() {
  try {
    const config = await get2048Config();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
} 