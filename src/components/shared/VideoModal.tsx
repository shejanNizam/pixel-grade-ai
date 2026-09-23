"use client";

import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  title = "See How It Works",
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop video playback and cleanup when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  // Handle ESC key press and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Dark frosted backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal Dialog Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-violet-500/30 bg-zinc-950 shadow-[0_0_50px_rgba(139,92,246,0.25)] transition-all"
      >
        {/* Modal Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-contain"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src={videoSrc} type="video/quicktime" />
            Your browser does not support playing this video.
          </video>
        </div>
      </div>
    </div>
  );
}
