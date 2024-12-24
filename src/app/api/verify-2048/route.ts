import { NextResponse } from "next/server";
import { get2048Config } from "~/server/queries";

type RequestBody = {
  score: number;
};

export async function POST(request: Request) {
  try {
    const { score } = await request.json() as RequestBody;
    const config = await get2048Config();

    if (score >= config.targetScore) {
      return NextResponse.json({ clue: config.clue });
    }

    return NextResponse.json(
      { error: "Score not high enough" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 