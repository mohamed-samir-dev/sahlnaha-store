"use client";

export default function AnimatedBackground() {
  return (
    <div className="animated-bg fixed inset-0 -z-10 overflow-hidden">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="grid-overlay" />
      <div className="top-shine" />
    </div>
  );
}
