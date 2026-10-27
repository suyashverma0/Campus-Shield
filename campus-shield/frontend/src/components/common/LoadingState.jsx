import React from "react";
import { Shield } from "lucide-react";

export default function LoadingState({ message = "Scanning Campus Shield registry..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl border-2 border-ink bg-pop shadow-hard flex items-center justify-center animate-bounce-subtle">
          <Shield className="w-8 h-8 text-ink" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-ink animate-ping" />
      </div>
      <h3 className="font-heavy text-lg font-extrabold uppercase tracking-tight text-ink">
        {message}
      </h3>
      <p className="text-xs text-ink-3 mt-1 font-semibold">
        Verifying university records & real-time campus data
      </p>
    </div>
  );
}
