import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Tent {
  Tent_ID: string;
  Level: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Features: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Desert_Tents");
    const tents = rowsToObjects<Tent>(rows);
    
    const processed = tents
      .map((tent) => ({
        ...tent,
        features: tent.Features ? tent.Features.split(",").map((f) => f.trim()) : [],
      }))
      .sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching Desert tents:", error);
    return NextResponse.json([], { status: 500 });
  }
}
