import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Section {
  Section: string;
  Title: string;
  Content: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Disclaimer");
    const sections = rowsToObjects<Section>(rows);
    
    const sorted = sections.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching disclaimer:", error);
    return NextResponse.json([], { status: 500 });
  }
}
