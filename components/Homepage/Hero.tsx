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
    <section className="relative h-[90vh] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        poster="/images/fallbackmage.png"
      >
        <source src="/videos/backgroundvid01.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-indigo-900/60 to-emerald-700/40" />

      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 text-center">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-white sm:text-5xl drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">
            Digitizing School Fee Payments for a More Transparent Education System.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90">
            Helping schools, parents, and students in Cameroon save time, reduce
            stress, and manage school fees efficiently through secure digital
            payments.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="#funding"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black"
            >
              SignUp for Free Demo
            </Link>

            <Link
              href="#contact"
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black"
            >
              Partner With Us
            </Link>
          </div>

          {/* 🔥 24-STYLE COUNTDOWN (AFTER BUTTONS) */}
          <Countdown24 targetDate="2025-12-26T23:59:59" />
        </div>
      </div>
    </section>
  );
}
