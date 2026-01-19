import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Experience {
  Package_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Single_Supplement_EUR?: string;
  Duration: string;
  Includes: string;
  Min_Guests: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Kasbah_Experience");
    const experiences = rowsToObjects<Experience>(rows);
    
    const processed = experiences
      .map((exp) => ({
        ...exp,
        includes: exp.Includes ? exp.Includes.split(",").map((i) => i.trim()) : [],
      }))
      .sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error fetching Kasbah experience:", error);
    return NextResponse.json([], { status: 500 });
  }
}
