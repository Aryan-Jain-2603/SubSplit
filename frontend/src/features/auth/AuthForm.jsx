import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function AuthForm({
  title,
  description,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  onSubmit,
  isPending,
  error,
  submitLabel,
  children,
}) {
  return (
    <Card className="overflow-hidden border-[color:var(--color-border-strong)] bg-white/95">
      <CardHeader className="space-y-3 border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,255,0.92))]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-primary-strong)]">
          Account access
        </p>
        <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <form className="space-y-5" onSubmit={onSubmit}>
          {children}
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? "Please wait..." : submitLabel}
          </Button>
        </form>
        <p className="mt-6 text-sm text-[color:var(--color-text-muted)]">
          {footerPrompt}{" "}
          <Link
            to={footerLinkTo}
            className="font-semibold text-[color:var(--color-primary-strong)] transition hover:text-[color:var(--color-primary)]"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default AuthForm;
