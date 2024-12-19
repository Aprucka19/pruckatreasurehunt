import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { score: number };
    const { score } = body;
    
    // Verify the score is legitimate
    if (score >= 100) {
      return NextResponse.json({
        message: "Find your next clue at the top of stargazer!" 
      });
    }
    
    return NextResponse.json({ error: 'Score not high enough' }, { status: 400 });
    
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 