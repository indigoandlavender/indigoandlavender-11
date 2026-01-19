import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface JourneysPage {
  Title: string;
  Subtitle: string;
  Body: string;
  Button_Text: string;
  Button_Link: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Journeys_Page");
    const data = rowsToObjects<JourneysPage>(rows);
    
    if (data.length > 0) {
      return NextResponse.json(data[0]);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error("Error fetching journeys page:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
