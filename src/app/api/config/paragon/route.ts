import { NextResponse } from 'next/server';
import { getParagonConfig } from "~/server/queries";

export async function GET() {
  try {
    const config = await getParagonConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
} 