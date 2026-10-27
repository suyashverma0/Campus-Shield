import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import ItemForm from "../components/items/ItemForm";

export default function ReportFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          to="/found"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-ink-2 hover:text-ink hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Found Items Feed
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl border-2 border-ink bg-accent text-accent-fg flex items-center justify-center shadow-hard-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heavy text-3xl font-black uppercase text-ink">
              Log A Found Item
            </h1>
            <p className="text-xs font-bold text-ink-3">
              Help reunite lost property. Earn karma points and keep your campus safe.
            </p>
          </div>
        </div>
      </div>

      <ItemForm initialType="found" />
    </div>
  );
}
