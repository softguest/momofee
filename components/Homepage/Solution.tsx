"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Solution() {
  const features = [
    "Remote fee payments using mobile money",
    "Installment-based payments",
    "Real-time payment confirmation",
    "Automated school dashboards",
    "Transparent financial reporting",
    "Actionable analytics & insights",
  ];

  const textRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  // 🎢 Parallax
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (textRef.current) {
        textRef.current.style.transform = `translateY(${y * 0.08}px)`;
      }
      if (visualRef.current) {
        visualRef.current.style.transform = `translateY(${y * 0.15}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
      <section
        className="relative bg-cover bg-center bg-fixed overflow-hidden"
        style={{ backgroundImage: "url('/images/payment02.jpg')" }}
      >
        {/* Subtle background accent */}
        <div className="py-32 px-6 bg-white/60 backdrop-blur-md rounded-xl"
           data-aos="fade-up"
        >
          <div className="mx-auto max-w-7xl px-6 mb-32 grid gap-16 lg:grid-cols-2 items-center">
            {/* 📝 Text */}
            <div ref={textRef} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
                A Simple, Secure Digital Solution
              </h2>

              <p className="text-gray-600 max-w-xl font-bold">
                Our School Fee Payment Platform modernizes how schools collect,
                track, and manage fees — removing cash, delays, and uncertainty.
              </p>

              <ul className="space-y-4">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                    style={{
                      transitionDelay: `${i * 80}ms`,
                    }}
                  >
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold">
                      ✓
                    </span>
                    <span className="font-bold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🖥️ Visual */}
            <div
              ref={visualRef}
              className="relative h-[360px] rounded-2xl bg-primary shadow-xl ring-1 ring-black/5 flex items-center justify-center"
            >
              {/* Fake dashboard layers */}
              <div className="absolute top-6 left-6 h-20 w-32 rounded-lg bg-accent" />
              <div className="absolute bottom-6 right-6 h-24 w-40 rounded-lg bg-accent/40" />
                <Image src="/images/paycard.png" width={400} height={400} alt="paycard"/>
            </div>
          </div>
        </div>
      </section>
  );
}
