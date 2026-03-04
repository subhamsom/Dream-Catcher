import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dream Catcher — AI Dream Journal",
  description: "Capture your nightly journeys. AI-powered dream insights and pattern analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <Stars />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: ((i * 97 + 13) % 100).toFixed(2),
    left: ((i * 61 + 7) % 100).toFixed(2),
    size: ((i % 3) + 1).toString(),
    delay: ((i * 0.4) % 4).toFixed(1),
    duration: (3 + (i % 3)).toFixed(1),
  }));
  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
