import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Kasbah_Gallery");
    const images = rowsToObjects<GalleryImage>(rows);
    
    const processed = images
      .map((img) => ({
        ...img,
        Image_URL: convertDriveUrl(img.Image_URL),
      }))
      .sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching kasbah gallery:", error);
    return NextResponse.json([]);
  }
}
