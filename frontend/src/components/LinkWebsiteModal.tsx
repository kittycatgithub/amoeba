import { useState } from "react";
import { FiX, FiGlobe, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface LinkWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUrl?: string;
}

const LinkWebsiteModal = ({ isOpen, onClose, existingUrl }: LinkWebsiteModalProps) => {
  const [url, setUrl] = useState(existingUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (val: string) => {
    const stripped = val.replace(/^https?:\/\//i, "");
    setUrl(stripped);
  };

  const isValid = url.trim().length > 0 && /^[^\s]+\.[^\s]{2,}/.test(url.trim());

  const handleProceed = async () => {
    if (!isValid) {
      toast.error("Please enter a valid website URL");
      return;
    }

    const fullUrl = `https://${url.trim()}`;
    setLoading(true);

    try {
      const res = await fetch("/api/user/website", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: fullUrl }),
      });

      if (!res.ok) throw new Error("Failed to save website URL");

      setSaved(true);
      toast.success("Website linked successfully!");

      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1400);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUrl(existingUrl ?? "");
    setSaved(false);
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/*
        Modal container:
        - Mobile:   flex-col (stacked rows)
        - Desktop:  flex-row (image left | form right)
        max-w-xl gives comfortable two-column width on md+
      */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-fadeIn flex flex-col sm:flex-row">

        {/* ── LEFT / TOP: Image panel ───────────────────────────────── */}
        <div className="relative sm:w-2/5 w-full h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-primary/10">
          <img
            src="/images/LinkWebsite2.png"
            alt="Link your website"
            // className="h-full w-auto object-cover"
            className="h-full w-auto object-fill"
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r" />
        </div>

        {/* ── RIGHT / BOTTOM: Form panel ───────────────────────────── */}
        <div className="flex-1 p-6 flex flex-col">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Link your website</h2>
              <p className="text-xs text-themegray mt-0.5">
                This link will be visible in <strong>All Properties</strong> you posted
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-themegray hover:text-gray-600 transition mt-0.5 ml-3 flex-shrink-0"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* URL input */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-themegray uppercase tracking-wide mb-1.5">
              Website URL
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition">
              <span className="px-3 py-2.5 text-sm text-themegray bg-gray-50 border-r border-gray-300 select-none whitespace-nowrap">
                https://
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleProceed()}
                placeholder="yourwebsite.com"
                className="flex-1 px-3 py-2.5 text-sm text-gray-700 outline-none bg-white min-w-0"
                autoFocus
              />
            </div>
            <p className="text-xs text-themegray mt-1.5">
              Enter your live domain — no paths or trailing slashes needed.
            </p>
          </div>

          {/* Preview */}
          {url.trim().length > 0 && (
            <div className="mt-3 mb-4 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
              <FiGlobe className="text-themegray text-sm shrink-0" />
              <span className="text-xs text-themegray truncate">https://{url.trim()}</span>
            </div>
          )}

          {/* Spacer to push actions to bottom */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-sm border border-gray-300 text-gray-600 px-5 py-2 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={!isValid || loading || saved}
              className={`flex items-center gap-1.5 text-sm px-5 py-2 rounded-full transition font-medium
                ${saved
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary-dull disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : saved ? (
                <><FiCheck /> Saved!</>
              ) : (
                "Proceed"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LinkWebsiteModal;