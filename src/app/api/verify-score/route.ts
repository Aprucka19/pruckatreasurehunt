import { NextResponse } from 'next/server';
import { MerryChristmasConfig } from "~/config/config";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { score: number };
    const { score } = body;
    
    if (score >= MerryChristmasConfig.requiredScore) {
      return NextResponse.json({
        message: MerryChristmasConfig.clue,
      });
    }
    
    return NextResponse.json({ error: 'Score not high enough' }, { status: 400 });
    
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 