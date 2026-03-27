import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useAuth } from "../app/useAuth";

function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Frontend migration"
        title="A cleaner subscription marketplace shell is now in place."
        description="The React foundation, session bootstrap, and protected navigation are live. Browse, create, dashboard, and profile flows will be layered into this shell next."
        actions={
          <>
            <Button asChild>
              <Link to={isAuthenticated ? "/dashboard/subscriptions" : "/signup"}>
                {isAuthenticated ? "View your dashboard" : "Create an account"}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">See product overview</Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[var(--radius-xl)] border border-[color:var(--color-border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary-strong)]">
            What changed
          </p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[color:var(--color-text-muted)]">
            <p>
              The app now boots through a shared provider tree, uses a centralized axios client
              with credentialed requests, and resolves current user state from the backend session.
            </p>
            <p>
              Navigation, flash messaging, protected routes, and auth pages are componentized so
              later feature pages can reuse the same structure instead of reintroducing page-level
              styling and redirect logic.
            </p>
            {isAuthenticated ? (
              <p className="rounded-2xl bg-[color:var(--color-primary-soft)] px-4 py-3 font-medium text-[color:var(--color-primary-strong)]">
                Signed in as {user?.username}. Protected routes are active and ready for the next
                feature phases.
              </p>
            ) : null}
          </div>
        </div>

        <EmptyState
          title="Browse page arrives in the next phase"
          description="This route already matches the long-term React URL structure. The plans grid, search, filters, prediction CTA, and join flow will be implemented on top of this shell next."
          action={
            <Button variant="secondary" asChild>
              <Link to={isAuthenticated ? "/plans/new" : "/login"}>
                {isAuthenticated ? "Check protected create route" : "Sign in to continue"}
              </Link>
            </Button>
          }
        />
      </section>
    </div>
  );
}

export default HomePage;
