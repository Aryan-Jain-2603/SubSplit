import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";

const pillars = [
  {
    title: "Browse real offers",
    body: "Explore hosted plans across streaming, music, gaming, productivity, and education without losing visibility into price, slots, and renewal timing.",
  },
  {
    title: "Join with confidence",
    body: "CraveCart keeps the existing session and payment logic intact while presenting a cleaner, faster marketplace and dashboard experience.",
  },
  {
    title: "Manage with clarity",
    body: "Owners can create, edit, and track hosted plans while subscribers can reveal credentials only when they intentionally need them.",
  },
];

const steps = [
  "Browse plans, search by need, and narrow by category or availability.",
  "Join through the wallet-backed checkout flow and keep account access inside your dashboard.",
  "Host your own plans to recover costs from slots that would otherwise stay unused.",
];

function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="About CraveCart"
        title="A cleaner way to split subscription costs without rebuilding the backend from scratch."
        description="CraveCart helps people host and join shared subscriptions with clearer pricing, better dashboards, and a more intentional UI while preserving the proven backend business logic."
        actions={
          <>
            <Button asChild>
              <Link to="/plans">Browse plans</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/signup">Join now</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <Card key={pillar.title}>
            <CardHeader>
              <CardTitle>{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm leading-7 text-[color:var(--color-text-muted)]">
              {pillar.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[color:var(--color-text-muted)]">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-[var(--radius-lg)] bg-[color:var(--color-surface-subtle)] px-4 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary-strong)] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why this product feels different now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[color:var(--color-text-muted)]">
            <p>
              The frontend is being rebuilt around reusable React components, stronger hierarchy, and
              consistent state handling instead of page-level Bootstrap patterns.
            </p>
            <p>
              That means browse, dashboard, profile, wallet, dialogs, and filters all behave like one
              product instead of a collection of separate templates.
            </p>
            <Button asChild>
              <Link to="/signup">Create your account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AboutPage;
