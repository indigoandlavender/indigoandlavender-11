import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface HomeSection {
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
  Button_Text: string;
  Button_Link: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Home");
    const sections = rowsToObjects<HomeSection>(rows);
    
    const obj: Record<string, HomeSection> = {};
    sections.forEach((s) => {
      if (s.Image_URL) s.Image_URL = convertDriveUrl(s.Image_URL);
      obj[s.Section] = s;
    });

    return NextResponse.json(obj);
  } catch (error) {
    console.error("Error fetching home:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
