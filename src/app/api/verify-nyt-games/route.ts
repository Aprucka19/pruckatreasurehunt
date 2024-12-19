import { NextResponse } from "next/server";
import { AstridAndOrionConfig } from "~/config/config";

export async function POST(request: Request) {
  try {
    const { wordle, purpleGroup, strandsTheme } = await request.json();

    const { correctWordle, correctPurpleGroup, correctStrandsTheme, clue } = AstridAndOrionConfig;

    const errors: string[] = [];

    // Convert both user input and correct answers to lowercase for comparison
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
      // All correct
      message = clue;
    } else if (errors.length === 1) {
      message = `${errors[0]} is incorrect.`;
    } else {
      // Combine errors into a single string
      const lastError = errors.pop();
      message = `${errors.join(", ")} and ${lastError} are incorrect.`;
    }

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
