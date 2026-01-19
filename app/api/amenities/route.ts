import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Amenity {
  Amenity_ID: string;
  Title: string;
  Subtitle: string;
  Image_URL: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Amenities");
    const amenities = rowsToObjects<Amenity>(rows);
    
    const processed = amenities
      .map((a) => ({
        ...a,
        Image_URL: convertDriveUrl(a.Image_URL),
      }))
      .sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
