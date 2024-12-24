import { NextResponse } from "next/server";
import { updateConfig } from "~/server/queries";

export async function POST(req: Request) {
  try {
    const updatedConfig = await req.json();
    
    // Update each section in the database
    for (const [section, config] of Object.entries(updatedConfig)) {
      await updateConfig(section, config as Record<string, unknown>);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
  }
}
