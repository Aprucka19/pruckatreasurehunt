import { NextResponse } from "next/server";
import { getHangmanConfig } from "~/server/queries";

type RequestBody = {
  word: string;
};

export async function POST(request: Request) {
  try {
    const { word } = await request.json() as RequestBody;
    const config = await getHangmanConfig();

    if (config.words.includes(word.toUpperCase())) {
      return NextResponse.json({ clue: config.clue });
    }

    return NextResponse.json(
      { error: "Invalid word" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
} 