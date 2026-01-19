import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

export async function GET() {
  try {
    const rows = await getSheetData("Settings");
    const settings = rowsToObjects<{ Key: string; Value: string }>(rows);
    
    const obj: Record<string, string> = {};
    settings.forEach((s) => {
      obj[s.Key] = s.Value;
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
