import { useContext } from "react";
import { FlashContext } from "./flash-context";

export function useFlash() {
  const context = useContext(FlashContext);

  if (!context) {
    throw new Error("useFlash must be used within FlashProvider");
  }

  return context;
}
