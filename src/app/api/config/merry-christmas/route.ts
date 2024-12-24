import { NextResponse } from 'next/server';
import { getMerryChristmasConfig } from "~/server/queries";

export async function GET() {
  try {
    const config = await getMerryChristmasConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
} 