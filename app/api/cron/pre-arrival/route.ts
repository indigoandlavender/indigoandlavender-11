import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { sendPreArrivalEmail } from '@/lib/email';

const OPS_SHEET_ID = '1qBOHt08Y5_2dn1dmBdZjKJQR9ShjacZLdLJvsK787Qo';

// Column indices in Master_Guests (0-based)
const COL = {
  BOOKING_ID: 0,
  SOURCE: 1,
  STATUS: 2,
  FIRST_NAME: 3,
  LAST_NAME: 4,
  EMAIL: 5,
  PHONE: 6,
  COUNTRY: 7,
  LANGUAGE: 8,
  PROPERTY: 9,
  ROOM: 10,
  CHECK_IN: 11,
  CHECK_OUT: 12,
  NIGHTS: 13,
  GUESTS: 14,
  ADULTS: 15,
  CHILDREN: 16,
  TOTAL_EUR: 17,
  CITY_TAX: 18,
  SPECIAL_REQUESTS: 19,
  ARRIVAL_TIME_STATED: 20,
  ARRIVAL_REQUEST_SENT: 21,
  ARRIVAL_CONFIRMED: 22,
  ARRIVAL_TIME_CONFIRMED: 23,
  READ_MESSAGES: 24,
  MIDSTAY_CHECKIN: 25,
  NOTES: 26,
  CREATED_AT: 27,
  UPDATED_AT: 28,
};

async function getAuthClient() {
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  return auth.getClient();
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseCheckInDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Handle various date formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date;
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });
    
    // Get all bookings from Master_Guests
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: OPS_SHEET_ID,
      range: 'Master_Guests!A2:AC', // Skip header row
    });
    
    const rows = response.data.values || [];
    
    // Calculate target date (5 days from now)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + 5);
    const targetDateStr = formatDateToYYYYMMDD(targetDate);
    
    console.log(`Checking for bookings arriving on ${targetDateStr}`);
    
    const results: { sent: string[], skipped: string[], errors: string[] } = {
      sent: [],
      skipped: [],
      errors: [],
    };
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowIndex = i + 2; // Actual sheet row (1-indexed, plus header)
      
      const bookingId = row[COL.BOOKING_ID] || '';
      const source = (row[COL.SOURCE] || '').toLowerCase();
      const status = (row[COL.STATUS] || '').toLowerCase();
      const email = row[COL.EMAIL] || '';
      const checkInStr = row[COL.CHECK_IN] || '';
      const notes = row[COL.NOTES] || '';
      
      // Skip if not a website booking
      if (source !== 'website') {
        continue;
      }
      
      // Skip if cancelled
      if (status === 'cancelled') {
        continue;
      }
      
      // Skip if no email
      if (!email) {
        continue;
      }
      
      // Parse check-in date
      const checkInDate = parseCheckInDate(checkInStr);
      if (!checkInDate) {
        continue;
      }
      
      // Check if check-in is 5 days from now
      const checkInDateStr = formatDateToYYYYMMDD(checkInDate);
      if (checkInDateStr !== targetDateStr) {
        continue;
      }
      
      // Check if pre-arrival email already sent (check notes)
      if (notes.toLowerCase().includes('pre-arrival-sent')) {
        results.skipped.push(`${bookingId} (already sent)`);
        continue;
      }
      
      // Get booking details for email
      const firstName = row[COL.FIRST_NAME] || 'Guest';
      const checkOut = row[COL.CHECK_OUT] || '';
      const room = row[COL.ROOM] || 'Your room';
      const arrivalConfirmed = row[COL.ARRIVAL_CONFIRMED] || '';
      const arrivalTimeConfirmed = row[COL.ARRIVAL_TIME_CONFIRMED] || '';
      
      // Check if arrival time is confirmed
      const isArrivalConfirmed = arrivalConfirmed.toLowerCase() === 'confirmed' || 
                                  (arrivalTimeConfirmed && arrivalTimeConfirmed.trim() !== '');
      
      try {
        // Send pre-arrival email
        const emailResult = await sendPreArrivalEmail({
          bookingId,
          firstName,
          email,
          checkIn: checkInStr,
          checkOut,
          room,
          arrivalTimeConfirmed: isArrivalConfirmed,
          confirmedTime: arrivalTimeConfirmed,
        });
        
        if (emailResult.success) {
          // Update notes to mark as sent
          const timestamp = new Date().toISOString();
          const newNotes = notes 
            ? `${notes} | pre-arrival-sent: ${timestamp}`
            : `pre-arrival-sent: ${timestamp}`;
          
          await sheets.spreadsheets.values.update({
            spreadsheetId: OPS_SHEET_ID,
            range: `Master_Guests!${String.fromCharCode(65 + COL.NOTES)}${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[newNotes]],
            },
          });
          
          results.sent.push(`${bookingId} → ${email}`);
        } else {
          results.errors.push(`${bookingId}: Email failed`);
        }
      } catch (error) {
        console.error(`Error sending email for ${bookingId}:`, error);
        results.errors.push(`${bookingId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('Pre-arrival cron results:', results);
    
    return NextResponse.json({
      success: true,
      targetDate: targetDateStr,
      results,
    });
    
  } catch (error) {
    console.error('Pre-arrival cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
