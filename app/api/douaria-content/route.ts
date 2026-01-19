import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Paragraph {
  Paragraph: string;
  Content: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Douaria_Content");
    const paragraphs = rowsToObjects<Paragraph>(rows);
    
    const sorted = paragraphs.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching Douaria content:", error);
    return NextResponse.json([], { status: 500 });
  }
}
