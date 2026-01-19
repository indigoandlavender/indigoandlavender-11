import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
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
    const rows = await getSheetData("The_Riad");
    console.log("The_Riad rows:", rows.length);
    
    const sections = rowsToObjects<Section>(rows);
    console.log("The_Riad sections:", sections.length);
    
    // Convert to object keyed by Section name
    const content: Record<string, any> = {};
    
    for (const s of sections) {
      if (s.Section) {
        content[s.Section] = {
          Title: s.Title || "",
          Subtitle: s.Subtitle || "",
          Body: s.Body || "",
          Image_URL: s.Image_URL ? convertDriveUrl(s.Image_URL) : "",
        };
      }
    }

    console.log("The_Riad content keys:", Object.keys(content));
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching the-riad:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
