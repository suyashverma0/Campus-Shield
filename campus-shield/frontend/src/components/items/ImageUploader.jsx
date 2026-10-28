import React, { useState } from "react";
import { UploadCloud, Image as ImageIcon, X, Sparkles } from "lucide-react";

export default function ImageUploader({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false);

  const samplePresets = [
    { label: "Laptop / Tech", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" },
    { label: "Wallet / ID", url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800" },
    { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" },
    { label: "Keys", url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800" },
    { label: "Water Bottle", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800" },
    { label: "Eyewear", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800" }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-black uppercase tracking-wider text-ink flex items-center justify-between">
        <span>Item Photograph (Optional but recommended)</span>
        <span className="text-[10px] text-ink-3 lowercase">jpg, png, webp (max 5mb)</span>
      </label>

      {value ? (
        <div className="relative aspect-video w-full rounded-2xl border-2 border-ink overflow-hidden bg-paper-3 shadow-hard group">
          <img src={value} alt="Item preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("", null)}
            className="absolute top-3 right-3 p-2 rounded-xl border-2 border-ink bg-status-lost text-white shadow-hard-sm hover:scale-105 transition-transform cursor-pointer"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg border border-ink bg-paper/90 backdrop-blur-sm text-xs font-extrabold text-ink">
            Photo Attached
          </div>
        </div>
      ) : (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer ${
              dragOver
                ? "border-accent bg-accent-wash/30 scale-[1.01]"
                : "border-ink/60 bg-paper hover:bg-paper-3 hover:border-ink"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-xl border-2 border-ink bg-paper-2 flex items-center justify-center mb-3 shadow-hard-sm">
              <UploadCloud className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm font-extrabold text-ink text-center">
              Drag & drop item photo here, or <span className="text-accent underline">browse</span>
            </p>
            <p className="text-[11px] font-bold text-ink-3 mt-1 text-center">
              Clear photos increase automatic AI match rates by 70%
            </p>
          </div>

          {/* Quick presets for rapid testing */}
          <div className="mt-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-ink-3 flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              Quick Demo Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChange(preset.url, null)}
                  className="px-2.5 py-1 rounded-lg border border-ink bg-paper text-[11px] font-bold text-ink hover:bg-pop hover:shadow-hard-sm transition-all cursor-pointer"
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
