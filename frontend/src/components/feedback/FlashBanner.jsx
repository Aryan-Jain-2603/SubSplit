import { useEffect } from "react";
import { useFlash } from "../../app/useFlash";

const toneStyles = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-[0_16px_40px_-24px_rgba(16,185,129,0.55)]",
  error:
    "border-rose-200 bg-rose-50 text-rose-900 shadow-[0_16px_40px_-24px_rgba(244,63,94,0.5)]",
  info:
    "border-sky-200 bg-sky-50 text-sky-900 shadow-[0_16px_40px_-24px_rgba(14,165,233,0.5)]",
};

function FlashBanner() {
  const { flash, clearFlash } = useFlash();

  useEffect(() => {
    if (!flash) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearFlash();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [clearFlash, flash]);

  if (!flash) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={[
          "flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border px-4 py-3 text-sm font-medium animate-[var(--animate-fade-in)]",
          toneStyles[flash.tone] || toneStyles.info,
        ].join(" ")}
        role="status"
      >
        <p>{flash.message}</p>
        <button
          type="button"
          onClick={clearFlash}
          className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default FlashBanner;
