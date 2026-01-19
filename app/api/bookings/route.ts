import { NextResponse } from "next/server";
import { addPayPalBookingToOps } from "@/lib/sheets";
import { sendBookingEmails, sendSheetWriteFailureAlert } from "@/lib/email";

export const revalidate = 0;

// Retry helper with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<{ success: boolean; result?: T; attempts: number }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { success: true, result, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return { success: false, attempts: maxRetries };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingId = `RDS-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Extract all booking data
    const {
      // Guest info
      firstName,
      lastName,
      email,
      phone,
      message,

      // Stay details
      checkIn,
      checkOut,
      nights,
      guests,
      adults,
      children,
      total,

      // Accommodation
      room,
      roomId,
      property,
      tent,
      tentId,
      tentLevel,
      experience,
      experienceId,

      // PayPal
      paypalOrderId,
      paypalStatus,

      // Legacy fields (from old forms)
      name,
      roomPreference,
    } = body;

    // Handle legacy name field
    const guestFirstName = firstName || name?.split(" ")[0] || "";
    const guestLastName = lastName || name?.split(" ").slice(1).join(" ") || "";
    const fullName = `${guestFirstName} ${guestLastName}`.trim();

    // Determine property and accommodation name
    const propertyName = property || "Riad di Siena";
    const accommodationName = room || tent || experience || roomPreference || "";

    // Only store if payment is confirmed
    if (paypalStatus === "COMPLETED") {

      const bookingData = {
        booking_id: bookingId,
        guest_name: fullName,
        email: email || "",
        phone: phone || "",
        property: propertyName,
        room_type: accommodationName,
        check_in: checkIn || "",
        check_out: checkOut || "",
        nights: nights || 1,
        guests_count: guests || adults || 1,
        total_price: `€${total || 0}`,
        paypal_order_id: paypalOrderId || "",
        remarks: message || "",
      };

      // Write to OPS sheet with retry (3 attempts)
      const sheetResult = await retryWithBackoff(
        async () => {
          const success = await addPayPalBookingToOps(bookingData);
          if (!success) throw new Error("Sheet write returned false");
          return success;
        },
        3,
        1000
      );

      if (!sheetResult.success) {
        console.error(`Failed to write booking to OPS sheet after ${sheetResult.attempts} attempts`);

        // Send alert email with all booking details so it can be added manually
        try {
          await sendSheetWriteFailureAlert(bookingData);
        } catch (alertError) {
          console.error("Failed to send sheet write failure alert:", alertError);
        }
      } else {
        console.log(`Booking ${bookingId} written to sheet on attempt ${sheetResult.attempts}`);
      }

      // Send confirmation emails
      if (email) {
        try {
          await sendBookingEmails({
            bookingId,
            firstName: guestFirstName,
            lastName: guestLastName,
            email,
            phone,
            property: propertyName,
            room,
            tent,
            experience,
            checkIn,
            checkOut,
            nights: nights || 1,
            guests: guests || 1,
            total: total || 0,
            paypalOrderId,
            message,
          });
        } catch (emailError) {
          console.error("Failed to send booking emails:", emailError);
          // Don't fail the booking if email fails
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        bookingId,
        message: "Booking confirmed"
      });
    }
    
    // For non-completed payments (shouldn't happen with PayPal flow, but handle it)
    return NextResponse.json({ 
      success: false, 
      error: "Payment not completed",
      paypalStatus 
    }, { status: 400 });
    
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Server error" 
    }, { status: 500 });
  }
}

// GET endpoint - bookings are in the OPS dashboard
export async function GET() {
  return NextResponse.json({ 
    message: "View bookings at ops.riaddisiena.com"
  });
}
