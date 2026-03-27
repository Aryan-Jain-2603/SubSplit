import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { useAuth } from "../../app/useAuth";

const guestLinks = [
  { to: "/plans", label: "Browse plans" },
  { to: "/about", label: "About" },
];

const authLinks = [
  { to: "/plans", label: "Browse plans" },
  { to: "/plans/new", label: "Create plan" },
  { to: "/dashboard/subscriptions", label: "My subscriptions" },
  { to: "/dashboard/profile", label: "Profile" },
];

function linkClass({ isActive }) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary-strong)]"
      : "text-[color:var(--color-text-muted)] hover:bg-white hover:text-[color:var(--color-text-strong)]",
  ].join(" ");
}

function Navbar({ onOpenMobileNav }) {
  const { isAuthenticated, logout, logoutState, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = isAuthenticated ? authLinks : guestLinks;

  async function handleLogout() {
    await logout();
    navigate("/plans", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[4.5rem] w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[color:var(--color-text-strong)] shadow-sm transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary-strong)] lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <NavLink
            to="/plans"
            className="inline-flex items-center text-[color:var(--color-text-strong)]"
          >
            <span className="text-[1.75rem] font-extrabold tracking-[-0.05em] text-[color:var(--color-primary-strong)]">
              SubSplit
            </span>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-center shadow-sm sm:block">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  Signed in
                </p>
                <p className="text-sm font-semibold text-[color:var(--color-text-strong)]">
                  {user?.username}
                </p>
              </div>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={handleLogout}
                disabled={logoutState.isPending}
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                {logoutState.isPending ? "Signing out..." : "Logout"}
              </Button>
            </>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Button
                variant={location.pathname === "/login" ? "secondary" : "ghost"}
                asChild
              >
                <NavLink to="/login">Login</NavLink>
              </Button>
              <Button
                variant={location.pathname === "/signup" ? "secondary" : "primary"}
                asChild
              >
                <NavLink to="/signup">Create account</NavLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
