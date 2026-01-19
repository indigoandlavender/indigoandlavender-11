import { NextResponse } from "next/server";

// Hardcoded footer data - Nexus integration disabled for stability
export async function GET() {
  return NextResponse.json({
    success: true,
    footer: {
      columns: [
        {
          title: "Stay",
          links: [
            { label: "Rooms", href: "/rooms", type: "internal" },
            { label: "The Douaria", href: "/the-douaria", type: "internal" },
            { label: "The Kasbah", href: "/the-kasbah", type: "internal" },
            { label: "The Desert Camp", href: "/the-desert-camp", type: "internal" },
          ],
        },
        {
          title: "Explore",
          links: [
            { label: "The Riad", href: "/the-riad", type: "internal" },
            { label: "Philosophy", href: "/philosophy", type: "internal" },
            { label: "Beyond the Walls", href: "/beyond-the-walls", type: "internal" },
          ],
        },
        {
          title: "Information",
          links: [
            { label: "Directions", href: "/directions", type: "internal" },
            { label: "FAQ", href: "/faq", type: "internal" },
            { label: "Contact", href: "/contact", type: "internal" },
          ],
        },
      ],
      siteInfo: {
        name: "Riad di Siena",
        address1: "37 Derb Jdid, Riad Laarous",
        address2: "Marrakech Medina, Morocco",
        phone: "+212 600 000 000",
        whatsapp: "+212 600 000 000",
        email: "happy@riaddisiena.com",
      },
    },
    currencies: [
      { code: "EUR", symbol: "€", label: "Euro" },
      { code: "USD", symbol: "$", label: "US Dollar" },
      { code: "GBP", symbol: "£", label: "British Pound" },
      { code: "MAD", symbol: "DH", label: "Moroccan Dirham" },
    ],
    languages: [
      { code: "EN", label: "English", native: "English", rtl: false },
    ],
  });
}
