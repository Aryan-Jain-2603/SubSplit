import { useRef } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function useRazorpay() {
  const loadingPromiseRef = useRef(null);

  async function ensureLoaded() {
    if (window.Razorpay) {
      return true;
    }

    if (!loadingPromiseRef.current) {
      loadingPromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

        if (existingScript) {
          existingScript.addEventListener("load", () => resolve(true), { once: true });
          existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay")), {
            once: true,
          });
          return;
        }

        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
      });
    }

    return loadingPromiseRef.current;
  }

  return {
    ensureLoaded,
  };
}
