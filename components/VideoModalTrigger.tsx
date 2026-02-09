"use client";

import { useState, ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type VideoModalTriggerProps = {
  videoUrl: string;
  children: ReactNode;
};

export default function VideoModalTrigger({
  videoUrl,
  children,
}: VideoModalTriggerProps) {
  const [open, setOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button onClick={() => setOpen(true)} className="inline-block">
        {children}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl mx-4 overflow-hidden rounded-xl bg-black shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black"
            >
              <X size={20} />
            </button>

            {/* Video */}
            {/* <div className="aspect-video w-full">
              {videoUrl.includes("youtube") || videoUrl.includes("vimeo") ? (
                <iframe
                  src={videoUrl}
                  className="h-full w-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full"
                />
              )}
            </div> */}
             <div className="aspect-video w-full overflow-hidden rounded-lg">
              <video
                src="/videos/demo.mp4"
                controls
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
