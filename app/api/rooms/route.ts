import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Features: string;
  Image_URL: string;
  Widget_ID: string;
  iCal_URL: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Rooms");
    const rooms = rowsToObjects<Room>(rows);
    
    const processed = rooms
      .map((room) => ({
        ...room,
        Image_URL: convertDriveUrl(room.Image_URL),
        features: room.Features ? room.Features.split(",").map((f) => f.trim()) : [],
      }))
      .sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json([], { status: 500 });
  }
}
