import { useState } from "react";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import Badge from "./Badge";
import Button from "./Button";
import { formatCurrency, formatDate, maskSecret } from "../../lib/formatters";

function CredentialRevealCard({ plan }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
              Hosted by {plan.owner?.username || "Unknown host"}
            </p>
          </div>
          <Badge tone="primary">{plan.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-3xl bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <p className="text-[color:var(--color-text-muted)]">Price</p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">{formatCurrency(plan.price)}</p>
          </div>
          <div className="rounded-3xl bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <p className="text-[color:var(--color-text-muted)]">Expires</p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">{formatDate(plan.expDate)}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] p-4">
          <div className="flex items-center gap-3 text-sm">
            <EnvelopeIcon className="h-5 w-5 text-[color:var(--color-text-muted)]" />
            <span className="font-medium text-[color:var(--color-text-strong)]">
              {revealed ? plan.email : maskSecret(plan.email)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <KeyIcon className="h-5 w-5 text-[color:var(--color-text-muted)]" />
            <span className="font-medium text-[color:var(--color-text-strong)]">
              {revealed ? plan.password : maskSecret(plan.password)}
            </span>
          </div>
        </div>

        <Button className="w-full" variant="secondary" onClick={() => setRevealed((current) => !current)}>
          {revealed ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {revealed ? "Hide credentials" : "Reveal credentials"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default CredentialRevealCard;
