"use client";

interface IconProps {
  className?: string;
}

// Animated Link/Chain Icon for Universal API
export function AnimatedLinkIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes link-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .link-chain-1 { animation: link-pulse 2s ease-in-out infinite; }
          .link-chain-2 { animation: link-pulse 2s ease-in-out infinite 0.3s; }
        `}
      </style>
      <path
        className="link-chain-1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
      />
      <path
        className="link-chain-2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

// Animated Globe Icon for Choose Source
export function AnimatedGlobeIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes globe-rotate {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 50; }
          }
          .globe-meridian {
            stroke-dasharray: 5 3;
            animation: globe-rotate 3s linear infinite;
          }
        `}
      </style>
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path
        className="globe-meridian"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12h20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
      />
    </svg>
  );
}

// Animated Scale Icon for Trust Scoring
export function AnimatedScaleIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes scale-balance {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
          }
          .scale-arm {
            transform-origin: 12px 6px;
            animation: scale-balance 3s ease-in-out infinite;
          }
        `}
      </style>
      {/* Base */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8" />
      {/* Balanced arm */}
      <g className="scale-arm">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
        {/* Left pan */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l2 8h4l2-8" />
        {/* Right pan */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l2 8h4l2-8" />
      </g>
    </svg>
  );
}

// Animated Status Dots for Trust Thresholds
export function AnimatedStatusDot({ color, className = "w-5 h-5" }: { color: "green" | "yellow" | "red"; className?: string }) {
  const colors = {
    green: { fill: "#22c55e", glow: "#22c55e" },
    yellow: { fill: "#eab308", glow: "#eab308" },
    red: { fill: "#ef4444", glow: "#ef4444" },
  };

  return (
    <svg className={className} viewBox="0 0 24 24">
      <style>
        {`
          @keyframes status-pulse-${color} {
            0%, 100% { r: 8; opacity: 1; }
            50% { r: 10; opacity: 0.8; }
          }
          @keyframes status-glow-${color} {
            0%, 100% { r: 10; opacity: 0.3; }
            50% { r: 12; opacity: 0.1; }
          }
          .status-glow-${color} {
            animation: status-glow-${color} 2s ease-in-out infinite;
          }
          .status-dot-${color} {
            animation: status-pulse-${color} 2s ease-in-out infinite;
          }
        `}
      </style>
      <circle
        className={`status-glow-${color}`}
        cx="12"
        cy="12"
        r="10"
        fill={colors[color].glow}
        opacity="0.3"
      />
      <circle
        className={`status-dot-${color}`}
        cx="12"
        cy="12"
        r="8"
        fill={colors[color].fill}
      />
    </svg>
  );
}

// Animated Calculator/Abacus Icon for Formula
export function AnimatedCalculatorIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes bead-slide {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(3px); }
          }
          .bead-1 { animation: bead-slide 1.5s ease-in-out infinite; }
          .bead-2 { animation: bead-slide 1.5s ease-in-out infinite 0.3s; }
          .bead-3 { animation: bead-slide 1.5s ease-in-out infinite 0.6s; }
        `}
      </style>
      {/* Frame */}
      <rect x="4" y="3" width="16" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rods */}
      <line x1="6" y1="9" x2="18" y2="9" strokeLinecap="round" />
      <line x1="6" y1="13" x2="18" y2="13" strokeLinecap="round" />
      <line x1="6" y1="17" x2="18" y2="17" strokeLinecap="round" />
      {/* Beads */}
      <g className="bead-1">
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        <circle cx="13" cy="9" r="1.5" fill="currentColor" />
      </g>
      <g className="bead-2">
        <circle cx="10" cy="13" r="1.5" fill="currentColor" />
        <circle cx="14" cy="13" r="1.5" fill="currentColor" />
      </g>
      <g className="bead-3">
        <circle cx="8" cy="17" r="1.5" fill="currentColor" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
        <circle cx="16" cy="17" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}

// Animated Wrench Icon for Settings
export function AnimatedWrenchIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes wrench-turn {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            75% { transform: rotate(15deg); }
          }
          .wrench-tool {
            transform-origin: 12px 12px;
            animation: wrench-turn 2s ease-in-out infinite;
          }
        `}
      </style>
      <g className="wrench-tool">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        />
      </g>
    </svg>
  );
}

// Animated Chart Icon for Dashboard
export function AnimatedChartIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes bar-grow-1 {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.6); }
          }
          @keyframes bar-grow-2 {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.2); }
          }
          @keyframes bar-grow-3 {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.8); }
          }
          .bar-1 { transform-origin: bottom; animation: bar-grow-1 2s ease-in-out infinite; }
          .bar-2 { transform-origin: bottom; animation: bar-grow-2 2s ease-in-out infinite 0.3s; }
          .bar-3 { transform-origin: bottom; animation: bar-grow-3 2s ease-in-out infinite 0.6s; }
        `}
      </style>
      {/* Axes */}
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      {/* Bars */}
      <rect className="bar-1" x="7" y="10" width="3" height="8" rx="1" fill="currentColor" stroke="none" />
      <rect className="bar-2" x="12" y="6" width="3" height="12" rx="1" fill="currentColor" stroke="none" />
      <rect className="bar-3" x="17" y="8" width="3" height="10" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Animated Lock Icon for Privacy
export function AnimatedLockIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes lock-shimmer {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes keyhole-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .lock-body { animation: lock-shimmer 3s ease-in-out infinite; }
          .keyhole {
            transform-origin: 12px 16px;
            animation: keyhole-pulse 2s ease-in-out infinite;
          }
        `}
      </style>
      {/* Shackle */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 11V7a4 4 0 118 0v4"
      />
      {/* Body */}
      <rect
        className="lock-body"
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Keyhole */}
      <circle className="keyhole" cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Animated Rocket Icon for Get Started
export function AnimatedRocketIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <style>
        {`
          @keyframes rocket-hover {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-2px) translateX(2px); }
          }
          @keyframes flame-flicker {
            0%, 100% { opacity: 1; transform: scaleY(1); }
            50% { opacity: 0.7; transform: scaleY(0.8); }
          }
          .rocket-body {
            animation: rocket-hover 2s ease-in-out infinite;
          }
          .rocket-flame {
            transform-origin: center top;
            animation: flame-flicker 0.3s ease-in-out infinite;
          }
        `}
      </style>
      <g className="rocket-body">
        {/* Rocket body */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        />
      </g>
      {/* Flame */}
      <g className="rocket-flame">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18l-2 2"
          stroke="currentColor"
          opacity="0.6"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 21l-1 1"
          stroke="currentColor"
          opacity="0.4"
        />
      </g>
    </svg>
  );
}
