import { NextResponse } from 'next/server';
import { getMerryChristmasConfig } from "~/server/queries";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { score: number };
    const { score } = body;
    
    const config = await getMerryChristmasConfig();
    
    if (score >= config.requiredScore) {
      return NextResponse.json({
        message: config.clue,
      });
    }
    
    return NextResponse.json({ error: 'Score not high enough' }, { status: 400 });
    
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 