import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const revalidate = 0;

interface Testimonial {
  Testimonial_ID: string;
  Guest_Name: string;
  Quote: string;
  Source: string;
  Date: string;
  Featured: string;
  Order: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Testimonials");
    const testimonials = rowsToObjects<Testimonial>(rows);
    
    const sorted = testimonials.sort((a, b) => parseInt(a.Order) - parseInt(b.Order));

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json([], { status: 500 });
  }
}
