"use client";

import { useState } from "react";

const testimonials = [
  {
    id: 1,
    quote: "My 6 nights stay here left me wanting to move in. Thank you for such a lovely experience.",
    guest: "Ryan",
  },
  {
    id: 2,
    quote: "A real haven of peace close to the main square, a lovely host and an exquisite breakfast... what more could you ask for!",
    guest: "Céline",
  },
  {
    id: 3,
    quote: "We were very well received and felt at home. I recommend to all those who appreciate Moroccan hospitality and welcome.",
    guest: "Giovanni",
  },
  {
    id: 4,
    quote: "A real little haven of peace: typical, charming, peaceful and perfectly located. The hosting was exceptional!",
    guest: "Chloé",
  },
  {
    id: 5,
    quote: "I regret not spending enough days in this place. Best breakfast I had in a riad in Marrakesh.",
    guest: "Juan Andrés",
  },
  {
    id: 6,
    quote: "This place was magical! For being my first time in Marrakesh I couldn't have asked for a better experience.",
    guest: "Eduardo",
  },
];

export default function StaticTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-32 bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-16 text-[#2a2a2a]">
          What Guests Say
        </h2>

        {/* All testimonials in DOM for crawlers - visually hidden except current */}
        <div className="relative">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className={`text-center transition-opacity duration-500 ${
                index === currentIndex
                  ? "opacity-100"
                  : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
              aria-hidden={index !== currentIndex}
            >
              <blockquote className="mb-8">
                <p className="font-display text-xl md:text-2xl italic text-[#2a2a2a]/80 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <footer className="text-sm font-medium text-[#2a2a2a]">
                {testimonial.guest}
              </footer>
            </article>
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-6 mt-12" aria-label="Testimonial navigation">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-[#2a2a2a]/10 rounded-full transition-colors"
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2" role="tablist">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-[#2a2a2a]" : "bg-[#2a2a2a]/30"
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 hover:bg-[#2a2a2a]/10 rounded-full transition-colors"
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </nav>

        {/* SEO: All quotes visible to crawlers in noscript */}
        <noscript>
          <div className="space-y-8 mt-8">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="text-center">
                <p className="font-display text-lg italic text-[#2a2a2a]/80">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="text-sm font-medium text-[#2a2a2a] mt-2">
                  {testimonial.guest}
                </footer>
              </blockquote>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
