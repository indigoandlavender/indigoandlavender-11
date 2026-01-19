import { google } from "googleapis";

// Accept both env var names for compatibility
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || process.env.GOOGLE_SPREADSHEET_ID;

// Convert Google Drive URLs to direct image URLs
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  
  // Already a direct URL (not Google Drive)
  if (!url.includes("drive.google.com")) return url;
  
  // Extract file ID from various Google Drive URL formats
  let fileId = "";
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Return thumbnail URL with large size (w1600 = 1600px width)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }
  
  // If no match, return original URL
  return url;
}

async function getAuthClient() {
  // Support multiple env var naming conventions:
  // 1. GOOGLE_SERVICE_ACCOUNT_BASE64 (full JSON base64 encoded)
  // 2. GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY (raw key with \n)
  // 3. GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY_BASE64 (base64 encoded key)
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    // Decode the full service account JSON
    const serviceAccountJson = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    return auth;
  }
  
  // Get client email (try both naming conventions)
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  
  // Get private key (try raw first, then base64)
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey && process.env.GOOGLE_PRIVATE_KEY_BASE64) {
    privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, "base64").toString("utf-8");
  }
  
  // Handle escaped newlines in raw key
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

export async function getSheetData(sheetName: string): Promise<string[][]> {
  if (!SHEET_ID) {
    console.error(`SHEET_ID not configured. Set GOOGLE_SHEETS_ID or GOOGLE_SPREADSHEET_ID env var.`);
    return [];
  }
  
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: sheetName,
    });

    const rows = response.data.values || [];
    console.log(`Fetched ${rows.length} rows from ${sheetName}`);
    return rows;
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
}

export async function appendToSheet(sheetName: string, values: string[][]) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return true;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    return false;
  }
}

// Convert rows to objects using header row as keys
export function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj as T;
  });
}

// Get a single setting value
export async function getSetting(key: string): Promise<string | null> {
  const rows = await getSheetData("Settings");
  const settings = rowsToObjects<{ Key: string; Value: string }>(rows);
  const setting = settings.find((s) => s.Key === key);
  return setting?.Value || null;
}

// Get all settings as an object
export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await getSheetData("Settings");
  const settings = rowsToObjects<{ Key: string; Value: string }>(rows);
  const obj: Record<string, string> = {};
  settings.forEach((s) => {
    obj[s.Key] = s.Value;
  });
  return obj;
}

// Content types
export interface ContentBlock {
  Page: string;
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
  Order: string;
}

// Get content for a specific page
export async function getPageContent(page: string): Promise<Record<string, ContentBlock>> {
  const rows = await getSheetData("Content");
  const allContent = rowsToObjects<ContentBlock>(rows);
  const pageContent = allContent.filter((c) => c.Page === page);
  
  const obj: Record<string, ContentBlock> = {};
  pageContent.forEach((c) => {
    // Convert Google Drive URLs to direct URLs
    if (c.Image_URL) {
      c.Image_URL = convertDriveUrl(c.Image_URL);
    }
    obj[c.Section] = c;
  });
  return obj;
}

// Alias for appendToSheet (some files use this name)
export const appendSheetData = appendToSheet;

// Update a specific row in a sheet
export async function updateSheetRow(sheetName: string, rowIndex: number, values: string[]) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // rowIndex is 0-based from data, but sheets are 1-based and have header row
    // So row 0 in data = row 2 in sheet (row 1 is header)
    const sheetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A${sheetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    return true;
  } catch (error) {
    console.error(`Error updating row in ${sheetName}:`, error);
    return false;
  }
}

// Get data from Nexus sheet
const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;

export async function getNexusData(sheetName: string): Promise<string[][]> {
  if (!NEXUS_SHEET_ID) {
    console.warn("NEXUS_SHEET_ID not configured, returning empty data");
    return [];
  }
  
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: sheetName,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Error fetching Nexus ${sheetName}:`, error);
    return [];
  }
}

// OPS Sheet for operational data (bookings go here)
const OPS_SHEET_ID = process.env.OPS_SPREADSHEET_ID || "1qBOHt08Y5_2dn1dmBdZjKJQR9ShjacZLdLJvsK787Qo";

// Master_Guests tab - 29 columns (same as OPS dashboard)
// booking_id, source, status, first_name, last_name, email, phone, country,
// language, property, room, check_in, check_out, nights, guests, adults, children,
// total_eur, city_tax, special_requests, arrival_time_stated, arrival_request_sent,
// arrival_confirmed, arrival_time_confirmed, read_messages, midstay_checkin,
// notes, created_at, updated_at

export interface WebsiteBooking {
  booking_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property: string;
  room: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  adults?: number;
  children?: number;
  total_eur: string;
  city_tax?: string;
  special_requests?: string;
  paypal_order_id?: string;
}

// Write website booking to OPS sheet (Master_Guests tab) - single source of truth
export async function addBookingToMasterGuests(booking: WebsiteBooking): Promise<boolean> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date().toISOString();
    
    // Build 29-column row matching Master_Guests structure exactly
    const row = [
      booking.booking_id,                           // 1. booking_id
      "Website",                                    // 2. source (distinguishes from Airbnb/Booking.com)
      "confirmed",                                  // 3. status (PayPal payment complete)
      booking.first_name,                           // 4. first_name
      booking.last_name,                            // 5. last_name
      booking.email,                                // 6. email
      booking.phone,                                // 7. phone
      "",                                           // 8. country (could add later)
      "",                                           // 9. language (could add later)
      booking.property,                             // 10. property
      booking.room,                                 // 11. room
      booking.check_in,                             // 12. check_in
      booking.check_out,                            // 13. check_out
      String(booking.nights),                       // 14. nights
      String(booking.guests),                       // 15. guests
      String(booking.adults || booking.guests),     // 16. adults
      String(booking.children || 0),                // 17. children
      booking.total_eur,                            // 18. total_eur (e.g., "€450")
      booking.city_tax || "",                       // 19. city_tax
      booking.special_requests || "",               // 20. special_requests
      "",                                           // 21. arrival_time_stated
      "",                                           // 22. arrival_request_sent
      "pending",                                    // 23. arrival_confirmed
      "",                                           // 24. arrival_time_confirmed
      "",                                           // 25. read_messages
      "pending",                                    // 26. midstay_checkin
      booking.paypal_order_id ? `PayPal: ${booking.paypal_order_id}` : "", // 27. notes
      now,                                          // 28. created_at
      "",                                           // 29. updated_at
    ];

    // Append to Master_Guests tab
    await sheets.spreadsheets.values.append({
      spreadsheetId: OPS_SHEET_ID,
      range: "Master_Guests!A:A",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    
    console.log(`Website booking ${booking.booking_id} written to Master_Guests`);
    return true;
  } catch (error) {
    console.error("Error writing booking to Master_Guests:", error);
    return false;
  }
}

// Legacy alias for backward compatibility
export async function addPayPalBookingToOps(booking: {
  booking_id: string;
  guest_name: string;
  email: string;
  phone: string;
  property: string;
  room_type: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests_count: number;
  total_price: string;
  paypal_order_id: string;
  remarks: string;
}): Promise<boolean> {
  // Parse guest name into first/last
  const nameParts = booking.guest_name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  return addBookingToMasterGuests({
    booking_id: booking.booking_id,
    first_name: firstName,
    last_name: lastName,
    email: booking.email,
    phone: booking.phone,
    property: booking.property,
    room: booking.room_type,
    check_in: booking.check_in,
    check_out: booking.check_out,
    nights: booking.nights,
    guests: booking.guests_count,
    total_eur: booking.total_price,
    special_requests: booking.remarks,
    paypal_order_id: booking.paypal_order_id,
  });
}
