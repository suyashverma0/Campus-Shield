import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Home as HomeIcon } from "lucide-react";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-6 text-center bg-paper">
      <div className="w-20 h-20 rounded-3xl border-3 border-ink bg-pop flex items-center justify-center shadow-hard-lg mb-6 animate-bounce-subtle">
        <Compass className="w-10 h-10 text-ink" />
      </div>

      <span className="badge-pill bg-status-lost text-white mb-2">404 Error</span>
      <h1 className="font-heavy text-4xl sm:text-5xl font-black uppercase text-ink">
        Lost in Campus Quads?
      </h1>
      <p className="text-sm font-bold text-ink-2 max-w-md mt-3 leading-relaxed">
        The page you are looking for took a wrong turn at the science laboratory and could not be found in our registry.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link to="/">
          <Button variant="accent" size="lg" icon={HomeIcon}>
            Back to Home
          </Button>
        </Link>
        <Link to="/lost">
          <Button variant="outline" size="lg">
            Search Lost Registry
          </Button>
        </Link>
      </div>
    </div>
  );
}
