import { Card, CardContent, CardHeader, CardTitle } from "./Card";

function StatCard({ label, value, description }) {
  return (
    <Card>
      <CardHeader className="space-y-1 pb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="pt-0 text-sm leading-6 text-[color:var(--color-text-muted)]">
          {description}
        </CardContent>
      ) : null}
    </Card>
  );
}

export default StatCard;
