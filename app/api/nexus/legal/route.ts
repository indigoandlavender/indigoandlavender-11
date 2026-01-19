import { NextResponse } from "next/server";
import { getLegalPageContent } from "@/lib/nexus";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("page");

  if (!pageId) {
    return NextResponse.json({ error: "Missing page parameter" }, { status: 400 });
  }

  try {
    const content = await getLegalPageContent(pageId);
    
    if (!content.title) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching legal content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
