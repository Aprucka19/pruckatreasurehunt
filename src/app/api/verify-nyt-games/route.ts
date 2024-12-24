import { NextResponse } from "next/server";
import { getAstridAndOrionConfig } from "~/server/queries";

type RequestBody = {
  wordle: string;
  purpleGroup: string;
  strandsTheme: string;
};

export async function POST(request: Request) {
  try {
    const { wordle, purpleGroup, strandsTheme } = await request.json() as RequestBody;
    const config = await getAstridAndOrionConfig();

    const errors: string[] = [];

    if (wordle.toLowerCase() !== config.correctWordle.toLowerCase()) {
      errors.push("Wordle word");
    }
    if (purpleGroup.toLowerCase() !== config.correctPurpleGroup.toLowerCase()) {
      errors.push("Purple Group Description");
    }
    if (strandsTheme.toLowerCase() !== config.correctStrandsTheme.toLowerCase()) {
      errors.push("Strands Daily Theme");
    }

    let message;
    if (errors.length === 0) {
      message = config.clue;
    } else if (errors.length === 1) {
      message = `${errors[0]} is incorrect.`;
    } else {
      const lastError = errors.pop();
      message = `${errors.join(", ")} and ${lastError} are incorrect.`;
    }

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
