import { NextResponse } from "next/server";
import { AstridAndOrionConfig } from "~/config/config";

type RequestBody = {
  wordle: string;
  purpleGroup: string;
  strandsTheme: string;
};

export async function POST(request: Request) {
  try {
    const { wordle, purpleGroup, strandsTheme } = await request.json() as RequestBody;

    const { correctWordle, correctPurpleGroup, correctStrandsTheme, clue } = AstridAndOrionConfig;

    const errors: string[] = [];

    if (wordle.toLowerCase() !== correctWordle.toLowerCase()) {
      errors.push("Wordle word");
    }
    if (purpleGroup.toLowerCase() !== correctPurpleGroup.toLowerCase()) {
      errors.push("Purple Group Description");
    }
    if (strandsTheme.toLowerCase() !== correctStrandsTheme.toLowerCase()) {
      errors.push("Strands Daily Theme");
    }

    let message;
    if (errors.length === 0) {
      message = clue;
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
