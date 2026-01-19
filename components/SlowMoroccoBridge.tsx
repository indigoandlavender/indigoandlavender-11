import Link from "next/link";

export default function SlowMoroccoBridge() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-display text-xl md:text-2xl leading-relaxed text-[#2a2a2a]/80 mb-8">
          Riad di Siena is where Slow Morocco sleeps. Three hundred years old,
          five rooms, a courtyard fountain you&apos;ll hear before you see.
          The journeys start here — or end here, depending on which direction
          you&apos;re traveling.
        </p>
        <Link
          href="https://slowmorocco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm tracking-widest border-b border-[#2a2a2a]/40 pb-1 hover:border-[#2a2a2a] transition-colors text-[#2a2a2a]"
        >
          Explore the journeys &rarr;
        </Link>
      </div>
    </section>
  );
}
