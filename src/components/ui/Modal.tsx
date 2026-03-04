"use client";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={`relative ${maxWidth} w-full dream-card p-6 shadow-2xl animate-slide-up`}
        onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="dream-title-glow text-xl font-semibold text-[#F5F5F5]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {title}
            </h2>
            <button onClick={onClose} className="text-[#B0B0C0] hover:text-[#F5F5F5] transition-colors text-xl leading-none">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
