"use client";

import { useState, useEffect } from "react";
import BookingModal from "@/components/BookingModal";
import { useCurrency } from "@/components/CurrencyContext";

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Features: string;
  Image_URL: string;
  Widget_ID?: string;
  iCal_URL?: string;
  features: string[];
  Bookable?: string;
}

interface Hero {
  Title: string;
  Subtitle: string;
  Image_URL: string;
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-5h18v5" />
    <path d="M3 13v-2a2 2 0 012-2h14a2 2 0 012 2v2" />
    <circle cx="7" cy="11" r="2" />
  </svg>
);

const BathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5v15" />
    <path d="M4 8h12a4 4 0 014 4" />
    <path d="M14 14v2M11 15v2M17 15v2M14 19v2" />
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10c4-4 12-4 16 0" />
    <path d="M7 13c3-3 7-3 10 0" />
    <path d="M10 16c1.5-1.5 2.5-1.5 4 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
);

const AcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="10" rx="1" />
    <path d="M7 18c0-1.5 1-3 2-3s2 1.5 2 3" />
    <path d="M13 18c0-1.5 1-3 2-3s2 1.5 2 3" />
  </svg>
);

const SizeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M9 4v16" />
  </svg>
);

const ViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a7 7 0 017 7 7 7 0 01-7 7" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BreakfastIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h10a4 4 0 010 8H5a4 4 0 010-8z" />
    <path d="M15 14h2a2 2 0 010 4h-2" />
    <path d="M8 12V9M10 12V8M12 12V9" />
  </svg>
);

const LinensIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="4" rx="1" />
    <path d="M6 10v10M18 10v10" />
    <path d="M6 20h12" />
  </svg>
);

const AmenitiesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="8" height="12" rx="1" />
    <path d="M10 8V6a2 2 0 014 0v2" />
    <path d="M10 12h4" />
  </svg>
);

const iconMap: Record<string, () => JSX.Element> = {
  "bathroom": BathIcon,
  "ensuite": BathIcon,
  "en-suite": BathIcon,
  "private": BathIcon,
  "wi-fi": WifiIcon,
  "wifi": WifiIcon,
  "air": AcIcon,
  "conditioning": AcIcon,
  "bed": BedIcon,
  "queen": BedIcon,
  "king": BedIcon,
  "double": BedIcon,
  "m²": SizeIcon,
  "m2": SizeIcon,
  "sqm": SizeIcon,
  "30m": SizeIcon,
  "25m": SizeIcon,
  "20m": SizeIcon,
  "35m": SizeIcon,
  "40m": SizeIcon,
  "view": ViewIcon,
  "courtyard": ViewIcon,
  "breakfast": BreakfastIcon,
  "linens": LinensIcon,
  "towels": LinensIcon,
  "shower": AmenitiesIcon,
  "shampoo": AmenitiesIcon,
  "toiletries": AmenitiesIcon,
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hero, setHero] = useState<Hero | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cityTaxPerNight, setCityTaxPerNight] = useState(2.5);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    Promise.all([
      fetch("/api/rooms").then((res) => res.json()),
      fetch("/api/rooms-hero").then((res) => res.json()),
      fetch("/api/rooms-gallery").then((res) => res.json()),
      fetch("/api/settings").then((res) => res.json()),
    ])
      .then(([roomsData, heroData, galleryData, settingsData]) => {
        setRooms(roomsData);
        setHero(heroData);
        setGallery(galleryData);
        if (settingsData.city_tax_eur) {
          setCityTaxPerNight(parseFloat(settingsData.city_tax_eur));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2a2520]/20 border-t-[#2a2520] rounded-full animate-spin" />
      </div>
    );
  }

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
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
            Riad di Siena
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            R O O M S
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

      {/* Rooms Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-32">
            {rooms.map((room, index) => (
              <article key={room.Room_ID} className="grid md:grid-cols-2 gap-12 items-start">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="aspect-[3/4] overflow-hidden">
                    {room.Image_URL ? (
                      <img src={room.Image_URL} alt={room.Name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#2a2520]/5 flex items-center justify-center text-[#2a2520]/20">
                        <BedIcon />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`pt-4 md:pt-8 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <p className="text-xs tracking-widest text-[#2a2520]/40 mb-3">
                    FROM {formatPrice(parseFloat(room.Price_EUR))} / NIGHT
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 mb-4 italic">{room.Name}</h2>
                  <p className="text-[#2a2520]/60 leading-relaxed mb-8 text-lg">{room.Description}</p>
                  
                  {room.features && room.features.length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {room.features.map((feature) => {
                          const icon = getIconForFeature(feature);
                          return (
                            <div key={feature} className="flex items-center gap-3 text-[#2a2520]/50">
                              <span className="text-[#2a2520]/30">
                                {icon || <span className="w-1.5 h-1.5 rounded-full bg-[#2a2520]/30 block" />}
                              </span>
                              <span className="text-sm">{feature}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {room.Bookable?.toLowerCase() === "no" ? (
                    <p className="text-xs tracking-widest text-[#2a2520]/40 italic">
                      Not available for direct booking
                    </p>
                  ) : (
                    <button
                      onClick={() => openBookingModal(room)}
                      className="text-xs tracking-widest border-b border-[#2a2520]/30 pb-1 hover:border-[#2a2520] transition-colors"
                    >
                      BOOK THIS ROOM
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Keep modal always mounted */}
      <BookingModal
        isOpen={isModalOpen && selectedRoom !== null}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedRoom(null), 300);
        }}
        item={selectedRoom ? {
          id: selectedRoom.Room_ID,
          name: selectedRoom.Name,
          priceEUR: selectedRoom.Price_EUR,
          iCalURL: selectedRoom.iCal_URL,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 2,
          baseGuestsPerUnit: 2,
          hasCityTax: true,
          cityTaxPerNight,
          selectCheckout: true,
          paypalContainerId: `paypal-room-${selectedRoom?.Room_ID || "default"}`,
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
