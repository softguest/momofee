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
        className="
          relative overflow-hidden
          bg-cover bg-center
          md:bg-fixed
        "
        style={{ backgroundImage: "url('/images/payment02.jpg')" }}
      >
        {/* Glass Background */}
        <div
          className="
            mx-auto
            py-20 sm:py-24 lg:py-32
            px-4 sm:px-6 lg:px-8
            bg-white/70 backdrop-blur-md
          "
          data-aos="fade-up"
        >
          <div
            className="
              mx-auto max-w-7xl
              grid gap-14 lg:gap-20
              lg:grid-cols-2
              items-center
            "
          >
            {/* 📝 Text */}
            <div ref={textRef} className="space-y-6 text-center lg:text-left">
              <h2
                className="
                  font-bold tracking-tight text-gray-900
                  text-[clamp(1.75rem,4.5vw,2.5rem)]
                  leading-tight
                  drop-shadow-[0_0_14px_rgba(59,130,246,0.5)]
                "
              >
                A Simple, Secure Digital Solution
              </h2>

              <p
                className="
                  mx-auto lg:mx-0
                  max-w-xl
                  text-[clamp(0.95rem,2.5vw,1.05rem)]
                  font-semibold
                  text-gray-700
                "
              >
                Our School Fee Payment Platform modernizes how schools collect,
                track, and manage fees — removing cash, delays, and uncertainty.
              </p>

              <ul className="space-y-4">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="
                      flex items-start gap-3
                      text-[clamp(0.85rem,2.2vw,0.95rem)]
                      text-gray-700
                    "
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <span
                      className="
                        mt-1 flex h-5 w-5 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-accent/15 text-accent
                        text-xs font-bold
                      "
                    >
                      ✓
                    </span>
                    <span className="font-semibold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🖥️ Visual */}
            <div
              ref={visualRef}
              className="
                relative
                mx-auto
                w-full max-w-md lg:max-w-none
                h-[clamp(260px,45vw,380px)]
                rounded-2xl
                bg-primary
                shadow-xl
                ring-1 ring-black/5
                flex items-center justify-center
                overflow-hidden
              "
            >
              {/* Accent layers */}
              <div className="absolute top-4 left-4 h-16 w-24 rounded-lg bg-accent" />
              <div className="absolute bottom-4 right-4 h-20 w-32 rounded-lg bg-accent/40" />

              <Image
                src="/images/paycard.png"
                width={400}
                height={400}
                alt="paycard"
                className="relative z-10 w-[70%] sm:w-[60%] object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

  );
}
