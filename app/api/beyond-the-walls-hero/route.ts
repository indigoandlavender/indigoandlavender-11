import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl } from "@/lib/sheets";

export const revalidate = 0;

interface HeroContent {
  Title: string;
  Subtitle: string;
  Intro: string;
  Image_URL: string;
}

export async function GET() {
  try {
    const rows = await getSheetData("Beyond_the_Walls_Hero");
    const content = rowsToObjects<HeroContent>(rows);
    
    if (content.length > 0) {
      const hero = content[0];
      if (hero.Image_URL) {
        hero.Image_URL = convertDriveUrl(hero.Image_URL);
      }
      return NextResponse.json(hero);
    }

    return NextResponse.json({
      Title: "Beyond the Walls",
      Subtitle: "Where the sanctuary continues",
      Intro: "",
      Image_URL: "",
    });
  } catch (error) {
    console.error("Error fetching Beyond the Walls hero:", error);
    return NextResponse.json({
      Title: "Beyond the Walls",
      Subtitle: "Where the sanctuary continues",
      Intro: "",
      Image_URL: "",
    });
  }
}
