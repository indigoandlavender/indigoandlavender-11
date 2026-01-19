import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Condition {
  Section: string;
  Title: string;
  Content: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Booking_Conditions");
    const conditions = rowsToObjects<Condition>(rows);
    
    const sorted = conditions.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching booking conditions:", error);
    return NextResponse.json([], { status: 500 });
  }
}
