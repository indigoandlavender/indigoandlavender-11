import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Direction {
  Step_Number: string;
  Building: string;
  Caption: string;
  Caption_FR: string;
  Caption_ES: string;
  Caption_IT: string;
  Caption_PT: string;
  Caption_AR: string;
  Image_URL: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Directions");
    console.log(`Directions API: got ${rows.length} rows`);
    
    const directions = rowsToObjects<Direction>(rows);
    console.log(`Directions API: parsed ${directions.length} direction objects`);
    
    const processed = directions.map((d) => ({
      ...d,
      Image_URL: convertDriveUrl(d.Image_URL),
    }));

    // Group by building
    const main = processed
      .filter((d) => d.Building === "main")
      .sort((a, b) => parseInt(a.Step_Number) - parseInt(b.Step_Number));
    
    const annex = processed
      .filter((d) => d.Building === "annex")
      .sort((a, b) => parseInt(a.Step_Number) - parseInt(b.Step_Number));

    console.log(`Directions API: ${main.length} main steps, ${annex.length} annex steps`);
    return NextResponse.json({ main, annex });
  } catch (error) {
    console.error("Error fetching directions:", error);
    return NextResponse.json({ main: [], annex: [] }, { status: 500 });
  }
}
