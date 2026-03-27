import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deletePlan } from "../api/plans";
import { getSubscriptionsDashboard } from "../api/dashboard";
import { useFlash } from "../app/useFlash";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CredentialRevealCard from "../components/ui/CredentialRevealCard";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import PlanCard from "../components/ui/PlanCard";
import PlanGrid from "../components/ui/PlanGrid";
import SectionTabs from "../components/ui/SectionTabs";
import StatCard from "../components/ui/StatCard";
import { formatCurrency } from "../lib/formatters";

function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const { showFlash } = useFlash();
  const [planToDelete, setPlanToDelete] = useState(null);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", "subscriptions"],
    queryFn: getSubscriptionsDashboard,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: (payload) => {
      showFlash(payload.message, "success");
      setPlanToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] });
    },
    onError: (error) => {
      showFlash(error.message, "error");
    },
  });

  if (dashboardQuery.isLoading) {
    return (
      <LoadingState
        title="Loading dashboard"
        description="We are preparing your hosted and joined subscription overview."
      />
    );
  }

  if (dashboardQuery.isError) {
    return (
      <EmptyState
        title="Could not load dashboard"
        description={dashboardQuery.error.message}
        action={<Button onClick={() => dashboardQuery.refetch()}>Try again</Button>}
      />
    );
  }

  const { hostedPlans, joinedPlans, summary } = dashboardQuery.data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Subscriptions dashboard"
        title="Manage the plans you host and the subscriptions you already joined."
        description="Hosted plans prioritize management actions. Joined plans prioritize secure credential access and renewal context."
        actions={
          <Button asChild>
            <Link to="/plans/new">Create a new plan</Link>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Hosted plans"
          value={summary.hostedCount}
          description="Listings you currently manage as an owner."
        />
        <StatCard
          label="Joined plans"
          value={summary.joinedCount}
          description="Subscriptions you can reveal credentials for."
        />
        <StatCard
          label="Wallet balance"
          value={formatCurrency(summary.walletBalance)}
          description="Available funds for new joins or wallet top-ups."
        />
      </div>

      <SectionTabs
        tabs={[
          {
            label: "Hosted plans",
            content:
              hostedPlans.length === 0 ? (
                <EmptyState
                  title="No hosted plans yet"
                  description="Create your first listing to start recovering costs from unused subscription slots."
                  action={
                    <Button asChild>
                      <Link to="/plans/new">Create plan</Link>
                    </Button>
                  }
                />
              ) : (
                <PlanGrid>
                  {hostedPlans.map((plan) => (
                    <PlanCard
                      key={plan._id}
                      plan={plan}
                      footer={
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="secondary" asChild>
                            <Link to={`/plans/${plan._id}/edit`}>Edit</Link>
                          </Button>
                          <Button variant="danger" onClick={() => setPlanToDelete(plan)}>
                            Delete
                          </Button>
                        </div>
                      }
                    />
                  ))}
                </PlanGrid>
              ),
          },
          {
            label: "Joined plans",
            content:
              joinedPlans.length === 0 ? (
                <EmptyState
                  title="No joined plans yet"
                  description="Browse the marketplace to join a shared subscription and unlock its credentials here."
                  action={
                    <Button variant="secondary" asChild>
                      <Link to="/plans">Browse plans</Link>
                    </Button>
                  }
                />
              ) : (
                <PlanGrid>
                  {joinedPlans.map((plan) => (
                    <CredentialRevealCard key={plan._id} plan={plan} />
                  ))}
                </PlanGrid>
              ),
          },
        ]}
      />

      <ConfirmDialog
        open={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        title="Delete this hosted plan?"
        description={
          planToDelete
            ? `This removes ${planToDelete.name} from your hosted inventory.`
            : ""
        }
        confirmLabel="Delete plan"
        onConfirm={() => deleteMutation.mutate(planToDelete._id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

export default SubscriptionsPage;
