import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import MobileNavDialog from "../components/navigation/MobileNavDialog";
import FlashBanner from "../components/feedback/FlashBanner";
import { useAuth } from "../app/useAuth";
import { cn } from "../lib/utils";

function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPlansRoute = location.pathname === "/plans";

  const links = useMemo(
    () =>
      isAuthenticated
        ? [
            { to: "/plans", label: "Browse plans" },
            { to: "/plans/new", label: "Create plan" },
            { to: "/dashboard/subscriptions", label: "My subscriptions" },
            { to: "/dashboard/profile", label: "Profile" },
            { to: "/about", label: "About" },
          ]
        : [
            { to: "/plans", label: "Browse plans" },
            { to: "/about", label: "About" },
            { to: "/login", label: "Login" },
            { to: "/signup", label: "Create account" },
          ],
    [isAuthenticated],
  );

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)]">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(86,111,255,0.18),transparent_54%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%)]" />
      <Navbar onOpenMobileNav={() => setMobileNavOpen(true)} />
      <MobileNavDialog
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={links}
      />
      <FlashBanner />
      <main
        className={cn(
          "flex w-full flex-1 flex-col py-8",
          isPlansRoute
            ? "max-w-none px-0"
            : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        )}
      >
        <Outlet />
      </main>
      <footer className="border-t border-[color:var(--color-border)] bg-white/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-[color:var(--color-text-muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>CraveCart is migrating to a faster, component-driven React frontend.</p>
          <p className="font-medium text-[color:var(--color-text-strong)]">
            Session auth stays on Express. UI moves here.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AppShell;
