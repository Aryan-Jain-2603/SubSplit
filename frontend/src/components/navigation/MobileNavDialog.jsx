import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../app/useAuth";

function itemClass({ isActive }) {
  return [
    "rounded-2xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary-strong)]"
      : "text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-surface-subtle)]",
  ].join(" ");
}

function MobileNavDialog({ isOpen, onClose, links }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout, logoutState, user } = useAuth();

  async function handleLogout() {
    await logout();
    onClose();
    navigate("/plans", { replace: true });
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm transition data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex">
        <DialogPanel className="flex h-full w-full max-w-xs flex-col gap-6 overflow-y-auto border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-6 shadow-2xl transition data-[closed]:-translate-x-full">
          <div className="space-y-2">
            <p className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[color:var(--color-primary-strong)]">
              SubSplit
            </p>
            {isAuthenticated ? (
              <p className="text-sm text-[color:var(--color-text-muted)]">
                Signed in as {user?.username}
              </p>
            ) : (
              <p className="text-sm text-[color:var(--color-text-muted)]">
                Browse, compare, and manage shared plans with a faster frontend shell.
              </p>
            )}
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={itemClass} onClick={onClose}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            {isAuthenticated ? (
              <Button
                className="w-full"
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutState.isPending}
              >
                {logoutState.isPending ? "Signing out..." : "Logout"}
              </Button>
            ) : (
              <>
                <Button className="w-full" variant="ghost" asChild>
                  <NavLink to="/login" onClick={onClose}>
                    Login
                  </NavLink>
                </Button>
                <Button className="w-full" asChild>
                  <NavLink to="/signup" onClick={onClose}>
                    Create account
                  </NavLink>
                </Button>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default MobileNavDialog;
