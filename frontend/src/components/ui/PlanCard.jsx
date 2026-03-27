import { CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import Badge from "./Badge";
import { formatCurrency, formatDate } from "../../lib/formatters";

function PlanCard({ plan, prediction, predictionPending, predictionError, footer }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-[color:color-mix(in srgb,var(--color-border) 78%,white)] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="aspect-[16/10] overflow-hidden bg-[color:var(--color-surface-subtle)]">
        <img
          src={plan.image}
          alt={plan.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
        />
      </div>
      <CardHeader className="space-y-5 p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <Badge tone="primary">{plan.categories}</Badge>
            <CardTitle className="text-[1.75rem] leading-9">{plan.name}</CardTitle>
          </div>
          <Badge tone={plan.slots > 0 ? "success" : "warning"}>{plan.type}</Badge>
        </div>
        <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">
          {plan.description ||
            "Shared subscription access with clear pricing, slot count, and expiry information."}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 px-7 pb-7 pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[var(--radius-lg)] border border-[color:color-mix(in_srgb,var(--color-border)_68%,white)] bg-[color:var(--color-surface-subtle)] px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-soft)]">
              Price
            </p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">
              {formatCurrency(plan.price)}
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[color:color-mix(in_srgb,var(--color-border)_68%,white)] bg-[color:var(--color-surface-subtle)] px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-soft)]">
              Slots left
            </p>
            <p className="mt-1 font-semibold text-[color:var(--color-text-strong)]">
              {plan.slots}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 rounded-[var(--radius-lg)] bg-[color:color-mix(in_srgb,var(--color-surface-subtle)_72%,white)] px-4 py-3.5 text-sm text-[color:var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-4 w-4" />
            <span>Hosted by {plan.owner?.username || "Unknown host"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Expires {formatDate(plan.expDate)}</span>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[color:color-mix(in_srgb,var(--color-border)_70%,white)] bg-[color:color-mix(in_srgb,var(--color-surface-subtle)_82%,white)] px-4 py-3.5 text-sm">
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
