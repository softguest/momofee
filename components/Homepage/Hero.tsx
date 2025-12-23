"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Digitizing School Fee Payments for a More Transparent Education System
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/90">
            Helping schools, parents, and students in Cameroon save time, reduce
            stress, and manage school fees efficiently through secure digital
            payments.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="#funding" className="rounded-xl bg-white px-6 py-3 font-semibold text-black">
              Support This Initiative
            </Link>
            <Link href="#contact" className="rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black">
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
