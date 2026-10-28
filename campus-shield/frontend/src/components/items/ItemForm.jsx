import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Gift,
  Lock,
  Building
} from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import ImageUploader from "./ImageUploader";
import { itemCategories, campusLocations } from "../../utils/helpers";
import { useItems } from "../../context/ItemContext";

export default function ItemForm({ initialType = "lost" }) {
  const navigate = useNavigate();
  const { reportItem } = useItems();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: initialType, // "lost" | "found"
    title: "",
    category: itemCategories[0],
    location: campusLocations[0],
    specificLocation: "",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    description: "",
    brand: "",
    color: "",
    image: "",
    imageFile: null,
    reward: "",
    securityQuestion: "",
    custodyLocation: ""
  });

  const [errors, setErrors] = useState({});

  const isLost = formData.type === "lost";

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (url, file) => {
    setFormData((prev) => ({
      ...prev,
      image: url,
      imageFile: file || null,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Item title is required.";
    if (!formData.category) errs.category = "Category is required.";
    if (!formData.location) errs.location = "Campus location is required.";
    if (!formData.date) errs.date = "Date is required.";
    if (!formData.description.trim()) errs.description = "Please provide identifying details.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const fullLocation = formData.specificLocation
        ? `${formData.location} (${formData.specificLocation})`
        : formData.location;

      const submissionPayload = {
        ...formData,
        location: fullLocation,
        imageFile: formData.imageFile,
      };

      const res = await reportItem(submissionPayload);
      if (res.matches && res.matches.length > 0) {
        navigate("/matches");
      } else {
        navigate(formData.type === "lost" ? "/lost" : "/found");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Type Toggle Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl border-2 border-ink bg-paper-3 shadow-hard-sm">
        <button
          type="button"
          onClick={() => handleChange("type", "lost")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wide border-2 transition-all cursor-pointer ${
            formData.type === "lost"
              ? "bg-status-lost text-white border-ink shadow-hard-sm -translate-y-0.5"
              : "border-transparent text-ink-2 hover:text-ink"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          I Lost An Item
        </button>

        <button
          type="button"
          onClick={() => handleChange("type", "found")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black uppercase tracking-wide border-2 transition-all cursor-pointer ${
            formData.type === "found"
              ? "bg-accent text-accent-fg border-ink shadow-hard-sm -translate-y-0.5"
              : "border-transparent text-ink-2 hover:text-ink"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          I Found An Item
        </button>
      </div>

      {/* Main Info Box */}
      <div className="flex flex-col gap-5 p-6 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard">
        <div className="border-b-2 border-paper-3 pb-3">
          <h2 className="font-heavy text-xl font-black text-ink">
            {isLost ? "Report a Lost Valuables" : "Log a Found Item"}
          </h2>
          <p className="text-xs font-semibold text-ink-2 mt-1">
            Provide accurate details so the AI matching engine can pair reports automatically.
          </p>
        </div>

        {/* Title */}
        <Input
          label="Item Name / Title"
          placeholder={isLost ? "e.g. Space Grey MacBook Air M2 in Navy Sleeve" : "e.g. Leather Bi-fold Wallet found on cafeteria bench"}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        {/* Category & Brand row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Category <span className="text-status-lost">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full rounded-xl border-2 border-ink bg-paper-2 py-2.5 px-3 text-sm font-bold text-ink focus:outline-none focus:shadow-hard cursor-pointer"
            >
              {itemCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Brand / Make (Optional)"
            placeholder="e.g. Apple, Casio, Fossil, Hydro Flask"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        </div>

        {/* Color and Physical Appearance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Color(s)"
            placeholder="e.g. Matte Black / Silver accents"
            value={formData.color}
            onChange={(e) => handleChange("color", e.target.value)}
          />

          {isLost ? (
            <Input
              label="Reward for Finder (Optional)"
              placeholder="e.g. ₹500 or Free Canteen Coffee"
              icon={Gift}
              value={formData.reward}
              onChange={(e) => handleChange("reward", e.target.value)}
            />
          ) : (
            <Input
              label="Current Custody Location"
              placeholder="e.g. Turn-in at Security Desk / Library Box #2"
              icon={Building}
              value={formData.custodyLocation}
              onChange={(e) => handleChange("custodyLocation", e.target.value)}
            />
          )}
        </div>

        {/* Campus Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Campus Location <span className="text-status-lost">*</span>
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full rounded-xl border-2 border-ink bg-paper-2 py-2.5 px-3 text-sm font-bold text-ink focus:outline-none focus:shadow-hard cursor-pointer"
          >
            {campusLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Specific Spot Details"
          placeholder="e.g. Desk #14 near south window, Locker Room bench 48"
          value={formData.specificLocation}
          onChange={(e) => handleChange("specificLocation", e.target.value)}
        />

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date Lost / Found"
            type="date"
            icon={Calendar}
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
            required
          />

          <Input
            label="Approximate Time"
            type="time"
            icon={Clock}
            value={formData.time}
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center justify-between">
            <span>Detailed Description <span className="text-status-lost">*</span></span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Mention scratches, stickers, case color, unique contents, keychains or marks that verify true ownership..."
            className={`w-full rounded-xl border-2 border-ink bg-paper-2 p-3 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:shadow-hard transition-all ${
              errors.description ? "border-status-lost bg-status-lost-wash/20" : ""
            }`}
          />
          {errors.description && (
            <span className="text-xs font-bold text-status-lost">{errors.description}</span>
          )}
        </div>

        {/* Security Question (Crucial Anti-Fraud Feature) */}
        <div className="p-4 rounded-2xl border-2 border-ink bg-pop-wash/60 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ink" />
            <span className="text-xs font-black uppercase tracking-wider text-ink">
              Claimant Verification Question
            </span>
          </div>
          <p className="text-[11px] font-semibold text-ink-2">
            Ask a question that only the rightful owner can answer (e.g. "What sticker is on the back?", "What is the initials inscribed inside?").
          </p>
          <input
            type="text"
            value={formData.securityQuestion}
            onChange={(e) => handleChange("securityQuestion", e.target.value)}
            placeholder="e.g. What color is the lanyard attached to the key ring?"
            className="w-full rounded-xl border-2 border-ink bg-paper-2 p-2.5 text-xs font-bold text-ink placeholder:text-ink-muted focus:outline-none focus:shadow-hard-sm"
          />
        </div>

        {/* Photo Upload */}
        <ImageUploader value={formData.image} onChange={handleImageChange} />
      </div>

      {/* Form Submission Button */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant={isLost ? "danger" : "accent"}
          size="lg"
          loading={submitting}
        >
          {isLost ? "Submit Lost Report" : "Publish Found Item"}
        </Button>
      </div>
    </form>
  );
}
