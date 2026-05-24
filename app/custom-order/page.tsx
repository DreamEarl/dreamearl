"use client";

import { useState } from "react";
import { translations } from "@/lib/constants/translations";

const { heading, subtitle, form } = translations.customOrder;

const PRODUCT_TYPES = [
  "Necklace",
  "Bracelet",
  "Earrings",
  "Ring",
  "Anklet",
  "Hair Accessory",
  "Other",
];

export default function CustomOrderPage() {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImageFile(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up submission
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-6 md:px-12 max-w-3xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4 text-center">
          {heading}
        </h1>
        <p className="text-center text-gray-500 mb-10 leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inspiration Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {form.inspirationImage}
            </label>
            <label
              htmlFor="inspirationImage"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                dragActive
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <input
                type="file"
                id="inspirationImage"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={handleFileChange}
              />
              {imageFile ? (
                <p className="text-sm text-gray-600">{imageFile.name}</p>
              ) : (
                <>
                  <svg
                    className="w-10 h-10 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">{form.dropzone}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {form.dropzoneHint}
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {form.fullName}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                placeholder={form.fullNamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {form.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder={form.emailPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Phone & Product Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {form.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder={form.phonePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label
                htmlFor="productType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {form.productType}
              </label>
              <select
                id="productType"
                name="productType"
                defaultValue=""
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white appearance-none"
              >
                <option value="" disabled>
                  {form.productTypePlaceholder}
                </option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Requirements */}
          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Custom Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={6}
              placeholder="Describe your vision, preferred colors, size, materials, and any special details you'd like to include..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              type="submit"
              className="bg-black text-white px-16 py-4 text-sm tracking-widest font-light hover:bg-gray-900 transition-colors"
            >
              {form.submit}
            </button>
            <p className="text-xs text-gray-400 text-center">
              {form.submitNote}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
