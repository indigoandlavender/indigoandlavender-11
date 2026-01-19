import { NextResponse } from "next/server";
import { sendGuestConfirmationEmail } from "@/lib/email";

export async function POST() {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 }
    );
  }

  // Test data matching the sample email
  const testData = {
    bookingId: "RDS-TEST-001",
    firstName: "Chris",
    lastName: "Test",
    email: "happy@indigoandlavender.love",
    phone: "+1 555 123 4567",
    property: "Riad di Siena",
    room: "Tresor Cache",
    checkIn: "2026-04-06",
    checkOut: "2026-04-10",
    nights: 4,
    guests: 2,
    total: 440,
  };

  try {
    const result = await sendGuestConfirmationEmail(testData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test booking confirmation email sent to happy@indigoandlavender.love"
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
