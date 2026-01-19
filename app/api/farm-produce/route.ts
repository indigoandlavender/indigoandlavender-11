import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Produce {
  Produce_ID: string;
  Name: string;
  Description: string;
  Season: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Farm_Produce");
    const produce = rowsToObjects<Produce>(rows);
    
    const sorted = produce.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching Farm produce:", error);
    return NextResponse.json([], { status: 500 });
  }
}
