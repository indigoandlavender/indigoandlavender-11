import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface BookingEmailData {
  bookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  property: string;
  room?: string;
  tent?: string;
  experience?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  paypalOrderId?: string;
  message?: string;
}

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const getAccommodationName = (data: BookingEmailData): string => {
  return data.room || data.tent || data.experience || 'Accommodation';
};

// Property-specific content
const getPropertyContent = (property: string) => {
  const propertyLower = property.toLowerCase();
  
  if (propertyLower.includes('kasbah')) {
    return {
      name: 'The Kasbah',
      subtitle: 'Thank you for choosing The Kasbah. We are preparing your rooms in the Draa Valley.',
      directions: `
        <p>The Kasbah is located in the Draa Valley, approximately 2 hours from Ouarzazate airport or 5 hours from Marrakech.</p>
        <p><strong>We will coordinate your transfer details</strong> once you confirm your arrival time. Most guests arrive via private driver from Marrakech or Ouarzazate.</p>
      `,
      signoff: 'The Kasbah',
      footer: 'The Kasbah · Draa Valley · Morocco',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    };
  }
  
  if (propertyLower.includes('desert') || propertyLower.includes('camp')) {
    return {
      name: 'The Desert Camp',
      subtitle: 'Thank you for choosing The Desert Camp. The Sahara awaits.',
      directions: `
        <p>The camp is located in the Erg Chebbi dunes near Merzouga, approximately 5 hours from Ouarzazate or 9 hours from Marrakech.</p>
        <p><strong>We will coordinate your transfer and camel trek</strong> once you confirm your arrival time. Most guests arrive in Merzouga by mid-afternoon for the sunset camel ride to camp.</p>
      `,
      signoff: 'The Desert Camp',
      footer: 'The Desert Camp · Erg Chebbi · Sahara',
      checkInTime: '4:00 PM',
      checkOutTime: '10:00 AM',
    };
  }
  
  // Default: Riad or Douaria (Marrakech)
  return {
    name: 'Riad di Siena',
    subtitle: 'Thank you for choosing Riad di Siena. We are preparing the house to receive you.',
    directions: `
      <p>The Medina is pedestrian-only. Have your driver drop you at <strong>Café Medina Rouge</strong> (near Koutoubia Mosque). From there, it's a 2-minute walk to our door at 35–37 Derb Fhal Zefriti.</p>
      <p>We can arrange a private driver from the airport for 200 MAD — just let us know when you confirm your arrival.</p>
    `,
    signoff: 'The Riad',
    footer: 'Riad di Siena · 35–37 Derb Fhal Zefriti · Marrakech Medina',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
  };
};

// Email to guest confirming their booking
export async function sendGuestConfirmationEmail(data: BookingEmailData) {
  const accommodationName = getAccommodationName(data);
  const propertyContent = getPropertyContent(data.property);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; color: #1a1a1a; line-height: 1.8; max-width: 600px; margin: 0 auto; padding: 20px; font-size: 15px; }
    h2 { font-size: 16px; font-weight: bold; margin: 30px 0 15px 0; }
    p { margin: 0 0 15px 0; }
    .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #666; }
    .signature a { color: #666; }
  </style>
</head>
<body>
  <p>Dear ${data.firstName},</p>

  <p>Thank you for choosing Riad di Siena. We are happy to welcome you to our simple sanctuary house.</p>

  <h2>Your Stay</h2>

  <p>
    <strong>Check-in:</strong> ${formatDate(data.checkIn)} from ${propertyContent.checkInTime}<br>
    <strong>Check-out:</strong> ${formatDate(data.checkOut)} by ${propertyContent.checkOutTime}<br>
    <strong>Room:</strong> ${accommodationName}<br>
    <strong>Guests:</strong> ${data.guests}<br>
    <strong>Total Paid:</strong> €${data.total.toLocaleString()} (including city taxes)
  </p>

  <p>When you are ready, please confirm your estimated arrival time with Zahra via WhatsApp: <strong>+212 6 19 11 20 08</strong></p>

  <p>This ensures a calm and relaxed check-in. Zahra will send you the directions to the riad and if you prefer, she will arrange for our night watchman to meet you at a nearby landmark.</p>

  <h2>Getting Here</h2>

  <p>The Medina is pedestrian-only. Have your driver drop you at <strong>Café Medina Rouge</strong> (near Koutoubia Mosque, facing Parking Bennani). From there, it's a 2-minute walk to our door at 35–37 Derb Fhal Zefriti.</p>

  <p>Once you confirm your arrival time, we'll send step-by-step directions.</p>

  <p>We can arrange a private driver from the airport for 200 MAD — just message Zahra. You can also use the taxi services at the airport counter.</p>

  <h2>Breakfast</h2>

  <p>Served each morning in the courtyard, 8:30–10:30 AM. If you have any dietary needs or allergies, please let us know.</p>

  <p>If you need anything or have any questions, please do not hesitate to ask Zahra.</p>

  <p>We look forward to welcoming you soon.</p>

  <div class="signature">
    <p>
      Jacqueline<br>
      <strong>STAY:</strong> <a href="https://riaddisiena.com">riaddisiena.com</a> | <strong>EXPLORE:</strong> <a href="https://slowmorocco.com">slowmorocco.com</a>
    </p>
  </div>
</body>
</html>
  `;

  try {
    const result = await getResend().emails.send({
      from: 'Riad di Siena <operations@mail.riaddisiena.com>',
      to: data.email,
      bcc: 'happy@riaddisiena.com',
      subject: `Your reservation at Riad di Siena / ${formatDate(data.checkIn)} to ${formatDate(data.checkOut)}`,
      html,
    });
    console.log('Guest confirmation email sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send guest confirmation email:', error);
    return { success: false, error };
  }
}

// Email to owner notifying of new booking
export async function sendOwnerNotificationEmail(data: BookingEmailData) {
  const accommodationName = getAccommodationName(data);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 18px; font-weight: normal; }
    .content { padding: 20px 0; }
    .highlight { background: #f0f7f0; padding: 15px; margin: 15px 0; border-left: 4px solid #4a5043; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e5e5; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b; }
    .amount { font-size: 24px; font-weight: bold; color: #4a5043; }
    .actions { margin-top: 20px; }
    .btn { display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #fff; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 NEW BOOKING</h1>
  </div>
  
  <div class="content">
    <div class="highlight">
      <strong>${data.firstName} ${data.lastName}</strong> just booked <strong>${accommodationName}</strong> at <strong>${data.property}</strong>
    </div>
    
    <p class="amount">€${data.total.toLocaleString()}</p>
    
    <table>
      <tr>
        <th>Booking ID</th>
        <td>${data.bookingId}</td>
      </tr>
      <tr>
        <th>Guest</th>
        <td>${data.firstName} ${data.lastName}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      ${data.phone ? `<tr><th>Phone</th><td>${data.phone}</td></tr>` : ''}
      <tr>
        <th>Property</th>
        <td>${data.property}</td>
      </tr>
      <tr>
        <th>Accommodation</th>
        <td>${accommodationName}</td>
      </tr>
      <tr>
        <th>Check-in</th>
        <td>${formatDate(data.checkIn)}</td>
      </tr>
      <tr>
        <th>Check-out</th>
        <td>${formatDate(data.checkOut)}</td>
      </tr>
      <tr>
        <th>Nights</th>
        <td>${data.nights}</td>
      </tr>
      <tr>
        <th>Guests</th>
        <td>${data.guests}</td>
      </tr>
      <tr>
        <th>Total</th>
        <td><strong>€${data.total.toLocaleString()}</strong></td>
      </tr>
      ${data.paypalOrderId ? `<tr><th>PayPal Order</th><td>${data.paypalOrderId}</td></tr>` : ''}
      ${data.message ? `<tr><th>Message</th><td>${data.message}</td></tr>` : ''}
    </table>
    
    <div class="actions">
      <a href="https://riaddisiena.com/admin/bookings" class="btn">View in Admin</a>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await getResend().emails.send({
      from: 'Riad di Siena <operations@mail.riaddisiena.com>',
      to: 'happy@riaddisiena.com',
      subject: `💰 New Booking: ${data.firstName} ${data.lastName} - €${data.total} - ${accommodationName}`,
      html,
    });
    console.log('Owner notification email sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send owner notification email:', error);
    return { success: false, error };
  }
}

// Send both emails
export async function sendBookingEmails(data: BookingEmailData) {
  const [guestResult, ownerResult] = await Promise.all([
    sendGuestConfirmationEmail(data),
    sendOwnerNotificationEmail(data),
  ]);
  
  return {
    guest: guestResult,
    owner: ownerResult,
  };
}

// Pre-arrival email data interface
interface PreArrivalEmailData {
  bookingId: string;
  firstName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  room: string;
  arrivalTimeConfirmed: boolean;
  confirmedTime?: string;
}

// Pre-arrival email (3-5 days before check-in)
export async function sendPreArrivalEmail(data: PreArrivalEmailData) {
  const arrivalFormUrl = `https://ops.riaddisiena.com/arrival?id=${data.bookingId}`;
  
  // Conditional section for arrival time
  const arrivalTimeSection = data.arrivalTimeConfirmed && data.confirmedTime
    ? `
      <div class="confirmed-box">
        <span class="label">Your arrival time</span>
        <span class="confirmed-time">${data.confirmedTime}</span>
        <p style="margin-top: 10px; font-size: 13px; color: #6b6b6b;">We'll be ready for you. If plans change, just reply to this email.</p>
      </div>
    `
    : `
      <div class="action-box">
        <h2>Please confirm your arrival time</h2>
        <p>We haven't received your arrival time yet. This helps us prepare for you.</p>
        <a href="${arrivalFormUrl}" class="btn">Confirm Arrival Time</a>
      </div>
    `;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; color: #1a1a1a; line-height: 1.7; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e5e5; }
    .logo { font-size: 24px; letter-spacing: 0.2em; font-weight: normal; }
    .content { padding: 30px 0; }
    h1 { font-size: 24px; font-weight: normal; margin-bottom: 10px; }
    .subtitle { color: #6b6b6b; font-size: 14px; margin-bottom: 30px; }
    .summary { background: #faf8f5; padding: 20px; margin: 20px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 6px 0; }
    .summary-label { color: #6b6b6b; font-size: 13px; }
    .summary-value { font-size: 14px; }
    .action-box { background: #1a1a1a; padding: 25px; margin: 25px 0; text-align: center; }
    .action-box h2 { color: #ffffff; font-size: 16px; font-weight: normal; margin: 0 0 10px 0; }
    .action-box p { color: #cccccc; font-size: 14px; margin: 0 0 20px 0; }
    .btn { display: inline-block; padding: 14px 32px; background: #ffffff; color: #1a1a1a; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; }
    .confirmed-box { background: #f0f7f0; padding: 20px; margin: 25px 0; text-align: center; }
    .confirmed-box .label { display: block; color: #6b6b6b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
    .confirmed-time { font-size: 20px; font-weight: normal; }
    .section { margin: 30px 0; }
    .section h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #6b6b6b; margin-bottom: 15px; font-weight: normal; }
    .directions-box { background: #faf8f5; padding: 20px; margin: 15px 0; }
    .step { margin-bottom: 15px; padding-left: 30px; position: relative; }
    .step-number { position: absolute; left: 0; top: 0; width: 20px; height: 20px; background: #1a1a1a; color: #fff; border-radius: 50%; font-size: 11px; text-align: center; line-height: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .info-item { }
    .info-item .label { display: block; color: #6b6b6b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
    .info-item .value { font-size: 14px; }
    .footer { text-align: center; padding: 30px 0; border-top: 1px solid #e5e5e5; color: #6b6b6b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">RIAD DI SIENA</div>
  </div>
  
  <div class="content">
    <h1>Preparing for your arrival</h1>
    <p class="subtitle">Your stay is approaching. Here's everything you need for a smooth arrival.</p>
    
    <div class="summary">
      <div class="summary-row">
        <span class="summary-label">Check-in</span>
        <span class="summary-value">${formatDate(data.checkIn)} from 3:00 PM</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Check-out</span>
        <span class="summary-value">${formatDate(data.checkOut)} by 11:00 AM</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Room</span>
        <span class="summary-value">${data.room}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Reference</span>
        <span class="summary-value">${data.bookingId}</span>
      </div>
    </div>
    
    ${arrivalTimeSection}
    
    <div class="section">
      <h3>Step-by-step directions</h3>
      <div class="directions-box">
        <div class="step">
          <span class="step-number">1</span>
          <strong>Tell your driver: Café Medina Rouge</strong><br>
          <span style="color: #6b6b6b; font-size: 14px;">It faces the Koutoubia Mosque, near Parking Bennani. All taxi drivers know it.</span>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <strong>Enter the alley beside the café</strong><br>
          <span style="color: #6b6b6b; font-size: 14px;">Walk straight for about 100 meters (2 minutes).</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <strong>Look for our door: 35–37 Derb Fhal Zefriti</strong><br>
          <span style="color: #6b6b6b; font-size: 14px;">A wooden door on your left. Knock or ring the bell — we'll be waiting.</span>
        </div>
      </div>
      <p style="font-size: 14px; color: #6b6b6b;">If you arrive after 5:00 PM, we'll send you self-check-in instructions with a door code.</p>
    </div>
    
    <div class="section">
      <h3>During your stay</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Breakfast</span>
          <span class="value">8:30–10:30 AM daily<br>in the courtyard</span>
        </div>
        <div class="info-item">
          <span class="label">Dinner</span>
          <span class="value">Available on request<br>speak with Zahra</span>
        </div>
        <div class="info-item">
          <span class="label">Early departure?</span>
          <span class="value">Tell us by 1 PM the day before<br>for a breakfast box</span>
        </div>
        <div class="info-item">
          <span class="label">Late flight?</span>
          <span class="value">Leave luggage in dining room<br>after checkout</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>Airport Transfer</h3>
      <p>We can arrange a private driver for 200 MAD (about €18). Just let Zahra know.</p>
    </div>
    
    <div class="section">
      <h3>Contact</h3>
      <p><strong>Zahra</strong> (WhatsApp): +212 6 19 11 20 08<br>
      <span style="color: #6b6b6b; font-size: 14px;">Available 8:00 AM – 5:00 PM</span></p>
    </div>
    
    <p style="margin-top: 30px;">Safe travels. We'll see you soon.</p>
    <p>Warmly,<br>The Riad</p>
  </div>
  
  <div class="footer">
    <p>Riad di Siena · 35–37 Derb Fhal Zefriti · Marrakech Medina</p>
    <p>riaddisiena.com</p>
  </div>
</body>
</html>
  `;

  try {
    const subject = data.arrivalTimeConfirmed 
      ? `Preparing for your arrival on ${formatDate(data.checkIn)}`
      : `Action needed: Confirm your arrival time`;
      
    const result = await getResend().emails.send({
      from: 'Riad di Siena <operations@mail.riaddisiena.com>',
      to: data.email,
      bcc: 'happy@riaddisiena.com',
      subject,
      html,
    });
    console.log('Pre-arrival email sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send pre-arrival email:', error);
    return { success: false, error };
  }
}

// Alert email when sheet write fails - sends all booking data so it can be recovered
interface SheetWriteFailureData {
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
}

export async function sendSheetWriteFailureAlert(data: SheetWriteFailureData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; margin-bottom: 20px; }
    .alert h1 { color: #dc2626; margin: 0 0 10px 0; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e5e5; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b6b; width: 140px; }
    .copy-data { background: #f5f5f5; padding: 15px; font-family: monospace; font-size: 12px; white-space: pre-wrap; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="alert">
    <h1>⚠️ SHEET WRITE FAILED - ACTION REQUIRED</h1>
    <p>A booking payment was received but failed to write to Google Sheets after 3 attempts. Add this booking manually.</p>
  </div>

  <table>
    <tr><th>Booking ID</th><td><strong>${data.booking_id}</strong></td></tr>
    <tr><th>Guest Name</th><td>${data.guest_name}</td></tr>
    <tr><th>Email</th><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><th>Phone</th><td>${data.phone}</td></tr>
    <tr><th>Property</th><td>${data.property}</td></tr>
    <tr><th>Room</th><td>${data.room_type}</td></tr>
    <tr><th>Check-in</th><td><strong>${data.check_in}</strong></td></tr>
    <tr><th>Check-out</th><td><strong>${data.check_out}</strong></td></tr>
    <tr><th>Nights</th><td>${data.nights}</td></tr>
    <tr><th>Guests</th><td>${data.guests_count}</td></tr>
    <tr><th>Total</th><td><strong>${data.total_price}</strong></td></tr>
    <tr><th>PayPal Order ID</th><td>${data.paypal_order_id}</td></tr>
    <tr><th>Remarks</th><td>${data.remarks || '-'}</td></tr>
  </table>

  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>

  <div class="copy-data">
<strong>CSV format (for copy/paste):</strong>
${data.booking_id},Website,confirmed,${data.guest_name.split(' ')[0]},${data.guest_name.split(' ').slice(1).join(' ')},${data.email},${data.phone},,,"${data.property}","${data.room_type}",${data.check_in},${data.check_out},${data.nights},${data.guests_count},,,"${data.total_price}",,${data.remarks ? `"${data.remarks}"` : ''},,,pending,,,pending,PayPal: ${data.paypal_order_id},${new Date().toISOString()},
  </div>
</body>
</html>
  `;

  try {
    const result = await getResend().emails.send({
      from: 'Riad di Siena <operations@mail.riaddisiena.com>',
      to: 'happy@riaddisiena.com',
      subject: `🚨 URGENT: Sheet write failed - ${data.guest_name} - ${data.check_in}`,
      html,
    });
    console.log('Sheet write failure alert sent:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send sheet write failure alert:', error);
    return { success: false, error };
  }
}
