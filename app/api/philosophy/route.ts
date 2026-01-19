import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Section {
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Philosophy");
    const sections = rowsToObjects<Section>(rows);
    
    const obj: Record<string, Section> = {};
    sections.forEach((s) => {
      if (s.Image_URL) s.Image_URL = convertDriveUrl(s.Image_URL);
      obj[s.Section] = s;
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error("Error fetching philosophy:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
