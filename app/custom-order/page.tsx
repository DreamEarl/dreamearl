"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Button from "@/components/ui/Button";
import { translations } from "@/lib/constants/translations";
import { ADMIN_WHATSAPP_NUMBER } from "@/lib/constants/shopConfig";
import { useAuthUser } from "@/lib/supabase/useAuthUser";
import { getPhoneNumber } from "@/lib/account/getPhoneNumber";
import { MAX_CUSTOM_REQUEST_IMAGES } from "@/lib/customRequests/types";

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

function isValidEmail(value: string): boolean {
  const at = value.indexOf("@");
  if (at < 1) return false;
  const dot = value.lastIndexOf(".");
  return dot > at + 1 && dot < value.length - 1;
}

type FormErrors = Partial<
  Record<"fullName" | "email" | "phone" | "images", string>
>;

function validate(
  fullName: string,
  email: string,
  phone: string,
  imageCount: number,
): FormErrors {
  const errors: FormErrors = {};
  if (!fullName.trim()) errors.fullName = "Name is required";
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  if (!phone.trim()) errors.phone = "Phone is required";
  if (imageCount > MAX_CUSTOM_REQUEST_IMAGES) {
    errors.images = `You can attach up to ${MAX_CUSTOM_REQUEST_IMAGES} images`;
  }
  return errors;
}

function isAcceptedImage(file: File): boolean {
  return file.type === "image/png" || file.type === "image/jpeg";
}

// Unlike lib/account/getFullName, this never falls back to guessing a name from
// the email address — an email-derived guess is fine for a greeting, but wrong
// to silently prefill into a form field the customer submits as their real name.
function getAccountFullName(user: User): string {
  const metadata = user.user_metadata as Record<string, unknown>;
  const firstName =
    typeof metadata.first_name === "string" ? metadata.first_name.trim() : "";
  const lastName =
    typeof metadata.last_name === "string" ? metadata.last_name.trim() : "";
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(" ");
  }
  const fullName = metadata.full_name ?? metadata.name;
  return typeof fullName === "string" ? fullName.trim() : "";
}

function getAccountContact(user: User) {
  return {
    fullName: getAccountFullName(user),
    email: user.email ?? "",
    phone: getPhoneNumber(user),
  };
}

async function uploadImages(files: File[]): Promise<string[]> {
  const uploads = await Promise.all(
    files.map(async (file) => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload-image", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { url: string };
        return data.url;
      } catch {
        return null;
      }
    }),
  );
  return uploads.filter((url): url is string => url !== null);
}

interface ImageItem {
  file: File;
  previewUrl: string;
}

// Wrapped defensively since some test environments (jsdom) don't implement createObjectURL.
function createPreviewUrl(file: File): string {
  try {
    return URL.createObjectURL(file);
  } catch {
    return "";
  }
}

function revokePreviewUrl(url: string) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignore
  }
}

export default function CustomOrderPage() {
  const user = useAuthUser();
  const [dragActive, setDragActive] = useState(false);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productType, setProductType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactLocked, setIsContactLocked] = useState(false);

  // Prefill name/email/phone from the signed-in account once per user, so
  // returning customers don't have to retype details we already have. Adjusted
  // directly during render (React's sanctioned pattern for "state derived from
  // a changed prop/value") rather than in a useEffect, since this repo's lint
  // config forbids calling setState synchronously inside an effect body.
  // Functional setState keeps anything the customer already typed before auth
  // resolved.
  const [prefilledUserId, setPrefilledUserId] = useState<string | null>(null);
  if (user && user.id !== prefilledUserId) {
    setPrefilledUserId(user.id);

    const account = getAccountContact(user);
    setFullName((prev) => prev || account.fullName);
    setEmail((prev) => prev || account.email);
    setPhone((prev) => prev || account.phone);

    if (account.fullName || account.email || account.phone) {
      setIsContactLocked(true);
    }
  }

  function unlockContactFields() {
    setIsContactLocked(false);
  }

  // Object URLs are created/revoked in event handlers (addFiles/removeFile), not
  // during render, since the create/revoke calls are side effects tied to user
  // actions rather than something to synchronize via an effect. This ref just
  // lets us revoke any still-open URLs if the page unmounts with files pending.
  const imageItemsRef = useRef<ImageItem[]>([]);
  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);
  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((item) =>
        revokePreviewUrl(item.previewUrl),
      );
    };
  }, []);

  function addFiles(newFiles: File[]) {
    const accepted = newFiles.filter(isAcceptedImage);
    setImageItems((prev) => {
      const room = MAX_CUSTOM_REQUEST_IMAGES - prev.length;
      if (room <= 0) return prev;
      const toAdd = accepted
        .slice(0, room)
        .map((file) => ({ file, previewUrl: createPreviewUrl(file) }));
      return [...prev, ...toAdd];
    });
  }

  function removeFile(index: number) {
    setImageItems((prev) => {
      const target = prev[index];
      if (target) revokePreviewUrl(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(Array.from(e.dataTransfer.files ?? []));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(
      fullName,
      email,
      phone,
      imageItems.length,
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const files = imageItems.map((item) => item.file);
    const imageUrls = files.length ? await uploadImages(files) : [];
    const failedUploadCount = files.length - imageUrls.length;
    const failedUploadSuffix = failedUploadCount > 1 ? "s" : "";
    const failedUploadNote =
      failedUploadCount > 0
        ? `(${failedUploadCount} image upload${failedUploadSuffix} failed – please send manually)`
        : "";

    const message = [
      "New Custom Order – DreamEarl",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Product Type: ${productType || "Not specified"}`,
      "",
      "Requirements:",
      requirements || "No details provided",
      "",
      imageUrls.length
        ? `Inspiration Images:\n${imageUrls.join("\n")}`
        : "Inspiration Images: Not provided",
      failedUploadNote,
    ]
      .filter(Boolean)
      .join("\n");

    // Track the request on the account "Custom Requests" screen for signed-in users.
    if (user) {
      try {
        await fetch("/api/custom-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            productType: productType || "Custom Piece",
            message: requirements || "No details provided",
            imageUrls,
          }),
        });
      } catch {
        // non-blocking — the WhatsApp message below is the source of truth
      }
    }

    window.open(
      `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    );

    // Re-prefill (rather than blank) contact fields for signed-in users, in case
    // they submit another custom request in the same visit.
    if (user) {
      const account = getAccountContact(user);
      setFullName(account.fullName);
      setEmail(account.email);
      setPhone(account.phone);
      setIsContactLocked(
        Boolean(account.fullName || account.email || account.phone),
      );
    } else {
      setFullName("");
      setEmail("");
      setPhone("");
      setIsContactLocked(false);
    }
    setProductType("");
    setRequirements("");
    imageItems.forEach((item) => revokePreviewUrl(item.previewUrl));
    setImageItems([]);
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-16 px-6 md:px-12 max-w-3xl mx-auto pb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-4 text-center">
          {heading}
        </h1>
        <p className="text-center text-gray-500 mb-10 leading-relaxed">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inspiration Images */}
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
              } ${imageItems.length >= MAX_CUSTOM_REQUEST_IMAGES ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                type="file"
                id="inspirationImage"
                accept="image/png,image/jpeg"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                disabled={imageItems.length >= MAX_CUSTOM_REQUEST_IMAGES}
              />
              <svg
                className="w-10 h-10 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-gray-500">{form.dropzone}</p>
              <p className="text-xs text-gray-400 mt-1">{form.dropzoneHint}</p>
            </label>
            {errors.images && (
              <p className="mt-1 text-xs text-red-500">{errors.images}</p>
            )}
            {imageItems.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imageItems.map(({ file, previewUrl }, index) => (
                  <li
                    key={`${file.name}-${file.lastModified}`}
                    className="relative"
                  >
                    <div className="relative w-full aspect-square bg-gray-50 overflow-hidden rounded-lg">
                      {previewUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element -- blob: preview URLs aren't valid next/image sources */
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {file.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-black/70 text-white text-xs leading-none"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Full Name & Email */}
          {isContactLocked && (
            <div className="flex items-center justify-between -mb-2">
              <p className="text-xs text-gray-400">
                Auto-filled from your account
              </p>
              <button
                type="button"
                onClick={unlockContactFields}
                className="text-xs font-medium text-gray-600 underline hover:text-black"
              >
                Edit
              </button>
            </div>
          )}
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={form.fullNamePlaceholder}
                disabled={isContactLocked}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.fullName ? "border-red-400" : "border-gray-300"
                } ${isContactLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={form.emailPlaceholder}
                disabled={isContactLocked}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.email ? "border-red-400" : "border-gray-300"
                } ${isContactLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
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
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={form.phonePlaceholder}
                disabled={isContactLocked}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                  errors.phone ? "border-red-400" : "border-gray-300"
                } ${isContactLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
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
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
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
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe your vision, preferred colors, size, materials, and any special details you'd like to include..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="px-16 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : form.submit}
            </Button>
            <p className="text-xs text-gray-400 text-center">
              {form.submitNote}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
