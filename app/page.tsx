"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StaticTestimonials from "@/components/StaticTestimonials";
import SlowWaySouth from "@/components/SlowWaySouth";
import SlowMoroccoBridge from "@/components/SlowMoroccoBridge";
import BeyondTheWallsCarousel from "@/components/BeyondTheWallsCarousel";

interface HomeSection {
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
  Button_Text: string;
  Button_Link: string;
}

interface Property {
  Property_ID: string;
  Name: string;
  Tagline: string;
  Description: string;
  Image_URL: string;
  Link: string;
  Order: string;
}

export default function Home() {
  const [sections, setSections] = useState<Record<string, HomeSection>>({});
  const [beyondTheWalls, setBeyondTheWalls] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => res.json())
      .then((data) => setSections(data || {}))
      .catch((err) => console.error("Home API error:", err));

    fetch("/api/beyond-the-walls")
      .then((res) => res.json())
      .then((data) => setBeyondTheWalls(data || []))
      .catch((err) => console.error("Beyond the Walls API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const hero = sections["hero"];
  const welcome = sections["welcome"];
  const rooms = sections["rooms"];
  const filter = sections["filter"];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16">
        {hero?.Image_URL ? (
          <Image
            src={hero.Image_URL}
            alt="Courtyard with zellige fountain at Riad di Siena, Marrakech medina"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[hsl(var(--sand))]" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-4">
            Riad di Siena
          </p>
          <h1 className="font-display text-3xl md:text-5xl lg:text-5xl mb-6">
            {hero?.Title || "Welcome home"}
          </h1>
          <p className="text-base md:text-lg font-light opacity-90 max-w-2xl mx-auto">
            {hero?.Subtitle || ""}
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      {welcome && (
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              {welcome.Title}
            </h2>
            <p className="text-lg leading-relaxed opacity-80">
              {welcome.Body}
            </p>
            {welcome.Button_Text && welcome.Button_Link && (
              <Link
                href={welcome.Button_Link}
                className="inline-block mt-8 text-sm tracking-widest border-b border-current pb-1 hover:opacity-70 transition-opacity"
              >
                {welcome.Button_Text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Rooms Preview */}
      {rooms && (
        <section className="py-20 md:py-32 bg-[hsl(var(--secondary))] px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl mb-4">
                {rooms.Title}
              </h2>
              <p className="opacity-60 max-w-xl mx-auto">
                {rooms.Subtitle}
              </p>
            </div>
            <div className="text-center">
              <Link
                href={rooms.Button_Link || "/rooms"}
                className="inline-block px-8 py-3 text-sm tracking-widest border border-current hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))] transition-colors"
              >
                {rooms.Button_Text || "VIEW ROOMS"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Static HTML for crawlers */}
      <StaticTestimonials />

      {/* Bridge to Slow Morocco */}
      <SlowMoroccoBridge />

      {/* The Slow Way South - Syndicated Journey */}
      <SlowWaySouth />

      {/* Beyond the Walls */}
      {beyondTheWalls.length > 0 && (
        <section className="py-20 md:py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl mb-4">
                Beyond the Walls
              </h2>
              <p className="opacity-60 max-w-xl mx-auto">
                The riad is just the beginning. Discover the places we love.
              </p>
            </div>
            <BeyondTheWallsCarousel properties={beyondTheWalls} />
          </div>
        </section>
      )}

      {/* The Filter Section */}
      {filter && (
        <section className="py-20 md:py-32 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-8">
              {filter.Title}
            </h2>
            <p className="text-lg leading-relaxed opacity-80 mb-8">
              {filter.Body}
            </p>
            {filter.Button_Text && filter.Button_Link && (
              <Link
                href={filter.Button_Link}
                className="inline-block px-8 py-3 text-sm tracking-widest border border-current hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {filter.Button_Text}
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
