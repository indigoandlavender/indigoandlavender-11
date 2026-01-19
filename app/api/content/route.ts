import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

// Content tab doesn't exist - return empty object
export async function GET(request: NextRequest) {
  return NextResponse.json({});
}
