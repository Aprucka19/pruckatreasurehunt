import { getSudokuConfig } from "~/server/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getSudokuConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching sudoku config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
} 