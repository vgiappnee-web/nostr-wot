"use client";

export function CTAIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Outer rotating ring */}
      <g className="animate-rotate-slow" style={{ transformOrigin: "100px 100px" }}>
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.1"
          strokeDasharray="8 8"
        />
      </g>

      {/* Middle rotating ring - opposite direction */}
      <g className="animate-rotate-reverse" style={{ transformOrigin: "100px 100px" }}>
        <circle
          cx="100"
          cy="100"
          r="70"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="4 4"
        />
      </g>

      {/* Pulsing center glow */}
      <circle
        cx="100"
        cy="100"
        r="35"
        fill="currentColor"
        fillOpacity="0.05"
        className="animate-cta-pulse"
      />

      {/* Central network hub */}
      <circle cx="100" cy="100" r="12" fill="currentColor" fillOpacity="0.9" />
      <circle cx="100" cy="100" r="8" fill="currentColor" className="animate-cta-core" />

      {/* Orbiting nodes */}
      <g className="animate-orbit-1" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="40" r="6" fill="currentColor" fillOpacity="0.7" />
        <line
          x1="100"
          y1="46"
          x2="100"
          y2="88"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
      </g>

      <g className="animate-orbit-2" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="160" cy="100" r="5" fill="currentColor" fillOpacity="0.6" />
        <line
          x1="155"
          y1="100"
          x2="112"
          y2="100"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
      </g>

      <g className="animate-orbit-3" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="160" r="5" fill="currentColor" fillOpacity="0.6" />
        <line
          x1="100"
          y1="154"
          x2="100"
          y2="112"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
      </g>

      <g className="animate-orbit-4" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="40" cy="100" r="5" fill="currentColor" fillOpacity="0.6" />
        <line
          x1="45"
          y1="100"
          x2="88"
          y2="100"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />
      </g>

      {/* Diagonal orbiting nodes */}
      <g className="animate-orbit-5" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="142" cy="58" r="4" fill="currentColor" fillOpacity="0.5" />
        <line
          x1="139"
          y1="61"
          x2="108"
          y2="92"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </g>

      <g className="animate-orbit-6" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="142" cy="142" r="4" fill="currentColor" fillOpacity="0.5" />
        <line
          x1="139"
          y1="139"
          x2="108"
          y2="108"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </g>

      <g className="animate-orbit-7" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="58" cy="142" r="4" fill="currentColor" fillOpacity="0.5" />
        <line
          x1="61"
          y1="139"
          x2="92"
          y2="108"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </g>

      <g className="animate-orbit-8" style={{ transformOrigin: "100px 100px" }}>
        <circle cx="58" cy="58" r="4" fill="currentColor" fillOpacity="0.5" />
        <line
          x1="61"
          y1="61"
          x2="92"
          y2="92"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
      </g>

      {/* Traveling pulses on connections */}
      <circle className="animate-travel-1" cx="100" cy="64" r="2" fill="currentColor" fillOpacity="0.8" />
      <circle className="animate-travel-2" cx="136" cy="100" r="2" fill="currentColor" fillOpacity="0.8" />
      <circle className="animate-travel-3" cx="100" cy="136" r="2" fill="currentColor" fillOpacity="0.8" />
      <circle className="animate-travel-4" cx="64" cy="100" r="2" fill="currentColor" fillOpacity="0.8" />
    </svg>
  );
}
