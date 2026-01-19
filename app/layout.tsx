import type { Metadata } from 'next'
import Script from 'next/script'
import { CurrencyProvider } from '@/components/CurrencyContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://riaddisiena.com"),
  title: {
    default: "Riad di Siena | Marrakech Medina",
    template: "%s | Riad di Siena",
  },
  description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas. Not a hotel—a home with soul.",
  keywords: ["riad marrakech", "marrakech medina", "riad morocco", "traditional moroccan house", "marrakech accommodation", "riad with courtyard"],
  authors: [{ name: "Riad di Siena" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riaddisiena.com",
    siteName: "Riad di Siena",
    title: "Riad di Siena | Marrakech Medina",
    description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas. Not a hotel—a home with soul.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Riad di Siena courtyard with traditional zellige fountain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riad di Siena | Marrakech Medina",
    description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: "https://riaddisiena.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": "https://riaddisiena.com/#lodgingbusiness",
  "name": "Riad di Siena",
  "alternateName": "The Sanctuary of Slow Morocco",
  "description": "A 300-year-old traditional Moroccan riad in the heart of Marrakech medina. The physical manifestation of Slow Morocco's philosophy—not a hotel, a house with soul. Four uniquely designed rooms around a courtyard with zellige fountain, rooftop terrace with Atlas Mountain views.",
  "url": "https://riaddisiena.com",
  "telephone": "+212-524-391723",
  "email": "happy@riaddisiena.com",
  "image": [
    "https://riaddisiena.com/og-image.jpg"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "37 Derb Fhal Zfriti, Kennaria",
    "addressLocality": "Marrakech Medina",
    "addressRegion": "Marrakech-Safi",
    "postalCode": "40000",
    "addressCountry": "Morocco"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 31.6295,
    "longitude": -7.9811
  },
  "priceRange": "€80-€150",
  "currenciesAccepted": "EUR, MAD",
  "paymentAccepted": "PayPal, Credit Card, Cash",
  "checkinTime": "14:00",
  "checkoutTime": "11:00",
  "numberOfRooms": 4,
  "petsAllowed": false,
  "starRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "6",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Ryan" },
      "reviewBody": "My 6 nights stay here left me wanting to move in."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Céline" },
      "reviewBody": "A real haven of peace close to the main square."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Giovanni" },
      "reviewBody": "We felt at home. I recommend to all those who appreciate Moroccan hospitality."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Chloé" },
      "reviewBody": "A real little haven of peace. The hosting was exceptional."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Juan Andrés" },
      "reviewBody": "Best breakfast I had in a riad in Marrakesh."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Eduardo" },
      "reviewBody": "This place was magical. I couldn't have asked for a better experience."
    }
  ],
  "parentOrganization": {
    "@type": "Organization",
    "name": "Slow Morocco",
    "url": "https://slowmorocco.com",
    "@id": "https://slowmorocco.com/#organization"
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Rooftop Terrace", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Traditional Breakfast Included", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Courtyard", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Airport Transfer Available", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Concierge Service", "value": true }
  ],
  // Bidirectional link to Slow Morocco - establishes this as the Sanctuary
  "memberOf": {
    "@type": "Organization",
    "@id": "https://slowmorocco.com/#organization",
    "name": "Slow Morocco",
    "alternateName": "Moroccan Cultural Authority",
    "url": "https://slowmorocco.com",
    "description": "Transformative travel as an antidote to extractive tourism. Riad di Siena is the Sanctuary of Slow Morocco—where travelers stay to experience the philosophy firsthand."
  },
  // Part of the Slow Morocco knowledge network
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://slowmorocco.com/#website",
    "name": "Slow Morocco",
    "url": "https://slowmorocco.com"
  },
  // Connected entities in the Trust Cluster
  "sameAs": [
    "https://www.instagram.com/riaddisiena",
    "https://slowmorocco.com",
    "https://amazigh.online",
    "https://tenmirt.site"
  ],
  // Keywords for AI indexing
  "keywords": "riad marrakech, slow morocco sanctuary, traditional moroccan house, marrakech medina, transformative travel accommodation, authentic morocco stay"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V48C7J04GJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V48C7J04GJ');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <CurrencyProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </CurrencyProvider>
      </body>
    </html>
  )
}
