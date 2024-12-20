import { NextResponse } from "next/server";
import { ParagonConfig } from "~/config/config";

export async function POST(request: Request) {
  try {
    const { gameWon } = await request.json();
    if (gameWon) {
      return NextResponse.json({ clue: ParagonConfig.clue });
    }
    return NextResponse.json({ error: "Game not won" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 