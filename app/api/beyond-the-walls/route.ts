import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Property {
  Property_ID: string;
  Name: string;
  Tagline: string;
  Description: string;
  Image_URL: string;
  Link: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Beyond_the_Walls");
    const properties = rowsToObjects<Property>(rows);
    
    const processed = properties
      .map((p) => ({
        ...p,
        Image_URL: convertDriveUrl(p.Image_URL),
      }))
      .sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching Beyond the Walls:", error);
    return NextResponse.json([], { status: 500 });
  }
}
