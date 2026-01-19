import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Rule {
  Title: string;
  Content: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("House_Rules");
    const rules = rowsToObjects<Rule>(rows);
    
    const sorted = rules.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching house rules:", error);
    return NextResponse.json([], { status: 500 });
  }
}
