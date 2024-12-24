import { NextResponse } from "next/server";
import { getCrosswordConfig } from "~/server/queries";

type RequestBody = {
  answer: string;
};

export async function POST(request: Request) {
  try {
    const { answer } = await request.json() as RequestBody;
    const config = await getCrosswordConfig();

    if (answer.toLowerCase() === config.answer.toLowerCase()) {
      return NextResponse.json({ clue: config.clue });
    }

    return NextResponse.json(
      { error: "Incorrect answer" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
} 