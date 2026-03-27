import { useCallback, useMemo, useState } from "react";
import { FlashContext } from "./flash-context";

export function FlashProvider({ children }) {
  const [flash, setFlash] = useState(null);

  const clearFlash = useCallback(() => {
    setFlash(null);
  }, []);

  const showFlash = useCallback((message, tone = "info") => {
    setFlash({ message, tone });
  }, []);

  const value = useMemo(
    () => ({
      flash,
      clearFlash,
      showFlash,
    }),
    [clearFlash, flash, showFlash],
  );

  return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
}
