import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface DirectionsSetting {
  Key: string;
  EN: string;
  FR: string;
  ES: string;
  IT: string;
  PT: string;
  AR: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Directions_Settings");
    const settings = rowsToObjects<DirectionsSetting>(rows);
    
    // Convert to object keyed by Key
    const obj: Record<string, DirectionsSetting> = {};
    settings.forEach((s) => {
      obj[s.Key] = s;
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error("Error fetching directions settings:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
