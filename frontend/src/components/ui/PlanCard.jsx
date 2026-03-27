import { CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import Badge from "./Badge";
import { formatCurrency, formatDate } from "../../lib/formatters";

function PlanCard({ plan, prediction, predictionPending, predictionError, footer }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden bg-[color:var(--color-surface-subtle)]">
        <img src={plan.image} alt={plan.name} className="h-full w-full object-cover" />
      </div>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone="primary">{plan.categories}</Badge>
            <CardTitle className="mt-3 text-2xl">{plan.name}</CardTitle>
          </div>
          <Badge tone={plan.slots > 0 ? "success" : "warning"}>{plan.type}</Badge>
        </div>
        <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">
          {plan.description ||
            "Shared subscription access with clear pricing, slot count, and expiry information."}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-3xl bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <p className="text-[color:var(--color-text-muted)]">Price</p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">
              {formatCurrency(plan.price)}
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--color-surface-subtle)] px-4 py-3">
            <p className="text-[color:var(--color-text-muted)]">Slots left</p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">
              {plan.slots}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-4 w-4" />
            <span>Hosted by {plan.owner?.username || "Unknown host"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Expires {formatDate(plan.expDate)}</span>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 py-3 text-sm">
          {predictionPending ? (
            <p className="font-medium text-[color:var(--color-text-strong)]">Checking prediction...</p>
          ) : prediction ? (
            <>
              <p className="text-[color:var(--color-text-muted)]">Prediction</p>
              <p className="mt-1 font-semibold text-[color:var(--color-primary-strong)]">
                {prediction}
              </p>
            </>
          ) : predictionError ? (
            <p className="font-medium text-rose-700">{predictionError}</p>
          ) : (
            <p className="text-[color:var(--color-text-muted)]">
              Request the prediction model before joining if you want an extra signal.
            </p>
          )}
        </div>

        <div className="mt-auto">{footer}</div>
      </CardContent>
    </Card>
  );
}

export default PlanCard;
