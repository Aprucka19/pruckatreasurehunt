import { getSudokuConfig } from "~/server/queries";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const config = await getSudokuConfig();
    return NextResponse.json({ clue: config.clue });
  } catch (error) {
    console.error("Error in verify-sudoku:", error);
    return NextResponse.json(
      { error: "Failed to verify sudoku completion" },
      { status: 500 }
    );
  }
} 