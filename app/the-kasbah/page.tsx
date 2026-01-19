"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import BookingModal from "@/components/BookingModal";
import GalleryCarousel from "@/components/GalleryCarousel";
import BeyondTheWallsNav from "@/components/BeyondTheWallsNav";

interface Hero {
  Title: string;
  Subtitle: string;
  Location: string;
  Image_URL: string;
}

interface Paragraph {
  Content: string;
}

interface Experience {
  Package_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Single_Supplement_EUR?: string;
  Duration: string;
  Min_Guests: string;
  includes: string[];
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

// Icons
const BedIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-5h18v5" /><path d="M3 13v-2a2 2 0 012-2h14a2 2 0 012 2v2" /><circle cx="7" cy="11" r="2" /></svg>);
const BathIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5v15" /><path d="M4 8h12a4 4 0 014 4" /><path d="M14 14v2M11 15v2M17 15v2M14 19v2" /></svg>);
const MealsIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="6" /><circle cx="12" cy="14" r="2" /></svg>);
const AcIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="10" rx="1" /><path d="M7 18c0-1.5 1-3 2-3s2 1.5 2 3" /><path d="M13 18c0-1.5 1-3 2-3s2 1.5 2 3" /></svg>);
const AmenitiesIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="8" height="12" rx="1" /><path d="M10 8V6a2 2 0 014 0v2" /><path d="M10 12h4" /></svg>);
const CarIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 15h14l-2-5H7l-2 5z" /><path d="M5 15v3h14v-3" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="16.5" cy="18" r="1.5" /></svg>);
const PoolIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M3 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg>);
const WifiIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10c4-4 12-4 16 0" /><path d="M7 13c3-3 7-3 10 0" /><path d="M10 16c1.5-1.5 2.5-1.5 4 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>);
const HikingIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2" /><path d="M9 22l3-9 3 9" /><path d="M7 12l5 1 5-1" /><path d="M12 8v5" /></svg>);
const TeaIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h10a4 4 0 010 8H5a4 4 0 010-8z" /><path d="M15 14h2a2 2 0 010 4h-2" /><path d="M8 12V9M10 12V8M12 12V9" /></svg>);

const iconMap: Record<string, () => JSX.Element> = {
  "room": BedIcon, "accommodation": BedIcon, "night": BedIcon, "bed": BedIcon,
  "bathroom": BathIcon, "en-suite": BathIcon, "ensuite": BathIcon, "private": BathIcon,
  "breakfast": MealsIcon, "dinner": MealsIcon, "meal": MealsIcon, "lunch": MealsIcon, "food": MealsIcon,
  "air": AcIcon, "conditioning": AcIcon, "ac": AcIcon,
  "shower": AmenitiesIcon, "shampoo": AmenitiesIcon, "toiletries": AmenitiesIcon, "amenities": AmenitiesIcon,
  "transfer": CarIcon, "transport": CarIcon, "pickup": CarIcon, "drive": CarIcon,
  "pool": PoolIcon, "swimming": PoolIcon,
  "wifi": WifiIcon, "wi-fi": WifiIcon, "internet": WifiIcon,
  "hike": HikingIcon, "walk": HikingIcon, "trek": HikingIcon, "guided": HikingIcon, "tour": HikingIcon,
  "tea": TeaIcon, "welcome": TeaIcon,
};

const getIconForFeature = (feature: string): JSX.Element | null => {
  const lowerFeature = feature.toLowerCase();
  const matchedKey = Object.keys(iconMap).find(key => lowerFeature.includes(key));
  if (matchedKey) {
    const Icon = iconMap[matchedKey];
    return <Icon />;
  }
  return null;
};

export default function TheKasbahPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/kasbah-hero").then((res) => res.json()),
      fetch("/api/kasbah-content").then((res) => res.json()),
      fetch("/api/kasbah-experience").then((res) => res.json()),
      fetch("/api/kasbah-gallery").then((res) => res.json()),
    ])
      .then(([heroData, contentData, expData, galleryData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        if (expData.length > 0) setExperience(expData[0]);
        setGallery(galleryData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroImage = hero?.Image_URL || "";

  return (
    <div className="bg-[#f5f0e8] text-[#2a2520] min-h-screen">
      {/* Hero - Full viewport with image */}
      <section className="min-h-screen flex items-center justify-center relative">
        {heroImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="absolute inset-0 bg-[#2a2520]/40" />
          </>
        )}
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl relative z-10">
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
              {hero.Location}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            T H E<br />K A S B A H
          </h1>
          {hero?.Subtitle && (
            <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-2xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </div>
      </section>

      {/* Description */}
      {paragraphs.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p.Content.replace(/kasbah/gi, '<em>kasbah</em>').replace(/pisé/gi, '<em>pisé</em>') }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Experience Package */}
      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-[#2a2520]/40 mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 italic">
              {experience?.Name || "Two nights in the deep south"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-[#2a2520]/50">Loading experience...</div>
          ) : experience ? (
            <div className="bg-[#f5f0e8] p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-serif text-xl mb-6 italic">What's included</h3>
                  <ul className="space-y-4 text-[#2a2520]/60 text-sm">
                    {experience.includes.map((item, i) => {
                      const icon = getIconForFeature(item);
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#2a2520]/30 mt-0.5 flex-shrink-0">
                            {icon || <span className="w-1.5 h-1.5 rounded-full bg-[#2a2520]/30 block mt-1.5" />}
                          </span>
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-6 italic">Pricing</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[#2a2520]/40 text-xs tracking-widest mb-2">PER NIGHT (DOUBLE OCCUPANCY)</p>
                      <p className="font-serif text-3xl">{formatPrice(parseFloat(experience.Price_EUR))}</p>
                    </div>
                    {experience.Single_Supplement_EUR && (
                      <div>
                        <p className="text-[#2a2520]/40 text-xs tracking-widest mb-2">SINGLE SUPPLEMENT</p>
                        <p className="font-serif text-xl">{formatPrice(parseFloat(experience.Single_Supplement_EUR))}</p>
                      </div>
                    )}
                    <p className="text-[#2a2520]/40 text-xs">
                      Price includes all transfers, accommodation, meals, and activities. 
                      Minimum {experience.Min_Guests} guests. Private kasbah buyout available on request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#2a2520]/10 text-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs tracking-widest bg-[#2a2520] text-[#f5f0e8] px-10 py-4 hover:bg-[#2a2520]/90 transition-colors inline-block"
                >
                  BOOK THE KASBAH EXPERIENCE
                </button>
                <p className="text-[#2a2520]/40 text-xs mt-6">
                  Also part of{" "}
                  <a 
                    href="/#the-journey" 
                    className="underline hover:text-[#2a2520] transition-colors"
                  >
                    The Slow Journey South
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#2a2520]/50">No experience package available</div>
          )}
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen && experience !== null}
        onClose={() => setIsModalOpen(false)}
        item={experience ? {
          id: experience.Package_ID,
          name: experience.Name,
          priceEUR: experience.Price_EUR,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 3,
          baseGuestsPerUnit: 2,
          extraPersonFee: parseFloat(experience?.Extra_Person_EUR || "0"),
          maxNights: 5,
          maxUnits: 3,
          unitLabel: "room",
          selectCheckout: false,
          propertyName: "The Kasbah",
          paypalContainerId: "paypal-kasbah",
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
