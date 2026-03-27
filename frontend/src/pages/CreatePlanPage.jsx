import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPlan } from "../api/plans";
import { useFlash } from "../app/useFlash";
import PlanForm from "../features/plans/PlanForm";

function CreatePlanPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showFlash } = useFlash();
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createPlan,
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

  async function handleSubmit(values) {
    setError("");
    await createMutation.mutateAsync(values);
  }

  return (
    <PlanForm
      title="Create a new shared plan"
      description="Structure the listing clearly so subscribers can evaluate the offer quickly and join with confidence."
      submitLabel="Create plan"
      initialValues={{}}
      onSubmit={handleSubmit}
      isPending={createMutation.isPending}
      error={error}
    />
  );
}

export default CreatePlanPage;
