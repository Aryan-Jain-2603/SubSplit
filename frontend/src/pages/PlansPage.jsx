import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FunnelIcon, PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { deletePlan, getPlans, joinPlan, predictPlan } from "../api/plans";
import { createPaymentOrder, getAppConfig } from "../api/profile";
import { useAuth } from "../app/useAuth";
import { useFlash } from "../app/useFlash";
import Button from "../components/ui/Button";
import CategoryChips from "../components/ui/CategoryChips";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import FilterPanel from "../components/ui/FilterPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import PaymentButton from "../components/ui/PaymentButton";
import PlanCard from "../components/ui/PlanCard";
import PlanGrid from "../components/ui/PlanGrid";
import SearchBar from "../components/ui/SearchBar";
import { PLAN_CATEGORIES } from "../lib/constants";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

function PlansPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { isAuthenticated, user, refetchSession } = useAuth();
  const { showFlash } = useFlash();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("query") || "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [predictions, setPredictions] = useState({});
  const debouncedQuery = useDebouncedValue(searchValue, 350);

  const filters = useMemo(
    () => ({
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "",
      type: searchParams.get("type") || "",
      availability: searchParams.get("availability") || "",
    }),
    [searchParams],
  );

  useEffect(() => {
    if (debouncedQuery === filters.query) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (debouncedQuery) {
      nextParams.set("query", debouncedQuery);
    } else {
      nextParams.delete("query");
    }

    setSearchParams(nextParams, { replace: true });
  }, [debouncedQuery, filters.query, searchParams, setSearchParams]);

  const plansQuery = useQuery({
    queryKey: ["plans", filters],
    queryFn: () => getPlans(filters),
  });

  const configQuery = useQuery({
    queryKey: ["app-config"],
    queryFn: getAppConfig,
    enabled: isAuthenticated,
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

  function updateFilter(field, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(field, value);
    } else {
      nextParams.delete(field);
    }

    setSearchParams(nextParams, { replace: true });
  }

  function clearFilters() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("category");
    nextParams.delete("type");
    nextParams.delete("availability");
    setSearchParams(nextParams, { replace: true });
  }

  async function handlePrediction(plan) {
    setPredictions((current) => ({
      ...current,
      [plan._id]: { isPending: true, value: "", error: "" },
    }));

    try {
      const result = await predictPlan({
        price: plan.price,
        slots: plan.slots,
        type: plan.type,
        categories: plan.categories,
      });

      setPredictions((current) => ({
        ...current,
        [plan._id]: {
          isPending: false,
          value: result.prediction,
          error: "",
        },
      }));
    } catch (error) {
      setPredictions((current) => ({
        ...current,
        [plan._id]: {
          isPending: false,
          value: "",
          error: error.message,
        },
      }));
    }
  }

  async function handleJoin(plan) {
    await joinPlan(plan._id);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["plans"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] }),
      queryClient.invalidateQueries({ queryKey: ["profile"] }),
      refetchSession(),
    ]);
    showFlash(`You joined ${plan.name} successfully.`, "success");
  }

  const plans = plansQuery.data?.plans || [];
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <div className="space-y-8">
      <section className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <PageHeader
          eyebrow="Browse plans"
          title="Discover shared subscriptions without losing the details that matter."
          description="Search, filter, compare, predict, and join from one consistent marketplace screen. Owners get fast management actions without leaving the browse context."
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
              </Button>
              {isAuthenticated ? (
                <Button asChild>
                  <Link to="/plans/new">
                    <PlusIcon className="h-4 w-4" />
                    Create plan
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/signup">Create account</Link>
                </Button>
              )}
            </>
          }
        />
      </section>

      <section className="space-y-5 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <SearchBar value={searchValue} onChange={setSearchValue} />
        <CategoryChips
          categories={PLAN_CATEGORIES}
          activeCategory={filters.category}
          onSelect={(value) => updateFilter("category", value)}
        />
      </section>

      <section className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)] xl:items-start 2xl:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} />
            </div>
          </aside>

          <section className="space-y-6">
            {plansQuery.isLoading ? (
              <LoadingState
                title="Loading plans"
                description="We are preparing the latest subscription marketplace results."
              />
            ) : plansQuery.isError ? (
              <EmptyState
                title="Could not load plans"
                description={plansQuery.error.message}
                action={<Button onClick={() => plansQuery.refetch()}>Try again</Button>}
              />
            ) : plans.length === 0 ? (
              <EmptyState
                title="No plans matched your filters"
                description="Try adjusting search, category, or availability to broaden the marketplace results."
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Reset filters
                  </Button>
                }
              />
            ) : (
              <PlanGrid>
                {plans.map((plan) => {
                  const predictionState = predictions[plan._id] || {};

                  return (
                    <PlanCard
                      key={plan._id}
                      plan={plan}
                      prediction={predictionState.value}
                      predictionPending={predictionState.isPending}
                      predictionError={predictionState.error}
                      footer={
                        <div className="space-y-3">
                          {plan.isOwner ? (
                            <div className="grid grid-cols-2 gap-3">
                              <Button variant="secondary" asChild>
                                <Link to={`/plans/${plan._id}/edit`}>Edit</Link>
                              </Button>
                              <Button variant="danger" onClick={() => setPlanToDelete(plan)}>
                                Delete
                              </Button>
                            </div>
                          ) : !isAuthenticated ? (
                            <Button className="w-full" asChild>
                              <Link to="/login" state={{ redirectTo }}>
                                Sign in to join
                              </Link>
                            </Button>
                          ) : (
                            <>
                              <Button
                                className="w-full"
                                variant="secondary"
                                onClick={() => handlePrediction(plan)}
                                disabled={predictionState.isPending}
                              >
                                <SparklesIcon className="h-4 w-4" />
                                {predictionState.isPending ? "Checking..." : "Is it worth it?"}
                              </Button>
                              <PaymentButton
                                className="w-full"
                                amount={plan.price}
                                description={`Join ${plan.name}`}
                                prefill={{
                                  name: user?.username,
                                  email: user?.email,
                                }}
                                razorpayKeyId={configQuery.data?.razorpayKeyId}
                                createOrder={createPaymentOrder}
                                onPaymentAuthorized={() => handleJoin(plan)}
                                onError={(error) => showFlash(error.message, "error")}
                                disabled={plan.slots < 1}
                              >
                                {plan.slots < 1 ? "No slots left" : "Join plan"}
                              </PaymentButton>
                            </>
                          )}
                        </div>
                      }
                    />
                  );
                })}
              </PlanGrid>
            )}
          </section>
        </div>
      </section>

      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-end justify-center p-4">
          <DialogPanel className="w-full max-w-lg rounded-[var(--radius-xl)] bg-[color:var(--color-surface)] p-4">
            <FilterPanel filters={filters} onChange={updateFilter} onClear={clearFilters} />
            <Button className="mt-4 w-full" variant="ghost" onClick={() => setMobileFiltersOpen(false)}>
              Close filters
            </Button>
          </DialogPanel>
        </div>
      </Dialog>

      <ConfirmDialog
        open={Boolean(planToDelete)}
        onClose={() => setPlanToDelete(null)}
        title="Delete this plan?"
        description={
          planToDelete ? `This will remove ${planToDelete.name} from your hosted plans.` : ""
        }
        confirmLabel="Delete plan"
        onConfirm={() => deleteMutation.mutate(planToDelete._id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

export default PlansPage;
