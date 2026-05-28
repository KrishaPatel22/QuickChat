// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = "lg" }) {
  const sz = size === "lg" ? "w-12 h-12" : "w-6 h-6";
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`${sz} relative`}>
        <div className={`${sz} rounded-full border-4 border-white/30`} />
        <div
          className={`${sz} rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin`}
        />
      </div>
    </div>
  );
}