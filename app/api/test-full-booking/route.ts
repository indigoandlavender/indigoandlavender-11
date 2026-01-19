import { NextResponse } from "next/server";
import { addPayPalBookingToOps } from "@/lib/sheets";
import { sendBookingEmails } from "@/lib/email";

// This endpoint simulates the EXACT same flow as a real PayPal booking
// Use this to verify the full system works end-to-end

export async function POST() {
  const results: { step: string; success: boolean; error?: string }[] = [];

  const bookingId = `TEST-${Date.now()}`;
  const testData = {
    booking_id: bookingId,
    guest_name: "Test Guest",
    email: "happy@indigoandlavender.love",
    phone: "+1 555 000 0000",
    property: "Riad di Siena",
    room_type: "Test Room",
    check_in: "2026-05-01",
    check_out: "2026-05-03",
    nights: 2,
    guests_count: 2,
    total_price: "€200",
    paypal_order_id: "TEST-PAYPAL-ORDER",
    remarks: "This is a test booking - DELETE THIS ROW",
  };

  // Step 1: Write to Google Sheet (same as real booking)
  try {
    const sheetSuccess = await addPayPalBookingToOps(testData);
    results.push({
      step: "1. Write to OPS Sheet",
      success: sheetSuccess,
      error: sheetSuccess ? undefined : "Sheet write returned false"
    });
  } catch (error) {
    results.push({
      step: "1. Write to OPS Sheet",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Step 2: Send booking emails (same as real booking)
  try {
    const emailResult = await sendBookingEmails({
      bookingId,
      firstName: "Test",
      lastName: "Guest",
      email: "happy@indigoandlavender.love",
      phone: "+1 555 000 0000",
      property: "Riad di Siena",
      room: "Test Room",
      checkIn: "2026-05-01",
      checkOut: "2026-05-03",
      nights: 2,
      guests: 2,
      total: 200,
      paypalOrderId: "TEST-PAYPAL-ORDER",
      message: "This is a test booking",
    });

    results.push({
      step: "2a. Owner notification email",
      success: emailResult.owner.success,
      error: emailResult.owner.success ? undefined : "Failed to send"
    });

    results.push({
      step: "2b. Guest confirmation email",
      success: emailResult.guest.success,
      error: emailResult.guest.success ? undefined : "Failed to send"
    });
  } catch (error) {
    results.push({
      step: "2. Send emails",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  const allSuccess = results.every(r => r.success);

  return NextResponse.json({
    success: allSuccess,
    message: allSuccess
      ? "✅ ALL SYSTEMS WORKING - Full booking flow verified"
      : "❌ SOME STEPS FAILED - Check results below",
    bookingId,
    results,
    note: "Delete the test row from Master_Guests sheet after verifying"
  });
}
