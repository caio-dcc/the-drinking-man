"use client";

import { Suspense } from "react";
import { DrinkingManForm } from "@/components/feature/DrinkingManForm";

export default function SuggestionPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/background-wood.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay to match other sections */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10">
        <Suspense>
          <DrinkingManForm />
        </Suspense>
      </div>
    </div>
  );
}
