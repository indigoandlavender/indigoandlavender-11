import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface FAQItem {
  Section: string;
  Question: string;
  Answer: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("FAQ");
    const items = rowsToObjects<FAQItem>(rows);
    
    const sorted = items.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json([], { status: 500 });
  }
}
