import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { score } = await request.json();
    
    // Verify the score is legitimate
    if (score >= 100) {
      return NextResponse.json({
        message: "Find your next clue at the top of stargazer!" 
      });
    }
    
    return NextResponse.json({ error: 'Score not high enough' }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 