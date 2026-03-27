import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPlan, updatePlan } from "../api/plans";
import { useFlash } from "../app/useFlash";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import PlanForm from "../features/plans/PlanForm";

function EditPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showFlash } = useFlash();
  const [error, setError] = useState("");

  const planQuery = useQuery({
    queryKey: ["plans", "edit", id],
    queryFn: () => getPlan(id),
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updatePlan(id, values),
    onSuccess: (payload) => {
      showFlash(payload.message, "success");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] });
      navigate("/dashboard/subscriptions", { replace: true });
    },
    onError: (submissionError) => {
      setError(submissionError.message);
    },
  });

  if (planQuery.isLoading) {
    return (
      <LoadingState
        title="Loading plan"
        description="We are fetching the hosted plan details for editing."
      />
    );
  }

  if (planQuery.isError) {
    return (
      <EmptyState title="Could not load this plan" description={planQuery.error.message} />
    );
  }

  async function handleSubmit(values) {
    setError("");
    await updateMutation.mutateAsync(values);
  }

  const plan = planQuery.data.plan;

  return (
    <PlanForm
      key={plan._id}
      title={`Edit ${plan.name}`}
      description="Keep the hosted listing current without breaking the existing backend business logic."
      submitLabel="Update plan"
      initialValues={{
        ...plan,
        expDate: plan.expDate?.split?.("T")?.[0] || plan.expDate,
      }}
      onSubmit={handleSubmit}
      isPending={updateMutation.isPending}
      error={error}
    />
  );
}

export default EditPlanPage;
