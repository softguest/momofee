"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function Countdown24({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex gap-6 rounded-2xl border border-primary-300/30 bg-primary/60 px-8 py-6 backdrop-blur-md">
        {[
          { label: "DAYS", value: timeLeft.days },
          { label: "HOURS", value: timeLeft.hours },
          { label: "MIN", value: timeLeft.minutes },
          { label: "SEC", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div
              className="
                font-mono
                text-4xl
                sm:text-5xl
                tracking-widest
                text-white
                drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]
              "
            >
              {item.value}
            </div>
            <div className="mt-2 text-xs tracking-widest text-white/70">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Force autoplay
  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.play().catch(() => {
      console.warn("Autoplay blocked");
    });
  }, []);

  // Parallax (safe)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        video.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
      <section className="relative min-h-[100svh] overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/fallbackmage.png"
        >
          <source src="/videos/backgroundvid01.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/85 via-indigo-900/65 to-emerald-700/45" />

        {/* Content */}
        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center">
            
            {/* Headline */}
            <h1 className="
              mx-auto max-w-5xl font-bold text-white tracking-tight
              text-[clamp(2rem,6vw,4rem)]
              leading-tight
              drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]
            ">
              Digitizing School Fee Payments
              <br className="hidden sm:block" />
              for a More Transparent
              <br className="hidden sm:block" />
              Education System.
            </h1>

            {/* Description */}
            <p className="
              mx-auto mt-6 max-w-3xl
              text-[clamp(1rem,2.5vw,1.125rem)]
              text-white/90
            ">
              Helping schools, parents, and students in Cameroon save time, reduce
              stress, and manage school fees efficiently through secure digital
              payments.
            </p>

            {/* CTA Buttons */}
            <div className="
              mt-10 flex flex-col items-center justify-center gap-4
              sm:flex-row
            ">
              <Link
                href="/sign-up"
                className="
                  w-full sm:w-auto rounded-xl bg-accent px-8 py-3
                  font-semibold text-primary
                  transition hover:scale-105
                "
              >
                Watch Demo
              </Link>

              <Link
                href="/dashboard"
                className="
                  w-full sm:w-auto rounded-xl border border-white px-8 py-3
                  font-semibold text-white
                  transition hover:bg-white hover:text-black hover:scale-105
                "
              >
                Go to Account
              </Link>
            </div>

            {/* Countdown */}
            <div className="mt-10">
              <Countdown24 targetDate="2026-01-20T23:59:59" />
            </div>
          </div>
        </div>
      </section>
  );
}
