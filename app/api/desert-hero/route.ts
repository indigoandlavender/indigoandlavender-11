import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Hero {
  Title: string;
  Subtitle: string;
  Location: string;
  Image_URL: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Desert_Hero");
    const data = rowsToObjects<Hero>(rows);
    
    if (data.length > 0) {
      const hero = data[0];
      if (hero.Image_URL) hero.Image_URL = convertDriveUrl(hero.Image_URL);
      return NextResponse.json(hero);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching Desert hero:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
