import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPaymentOrder, getProfile, topUpWallet } from "../api/profile";
import { useAuth } from "../app/useAuth";
import { useFlash } from "../app/useFlash";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import PaymentButton from "../components/ui/PaymentButton";
import StatCard from "../components/ui/StatCard";
import { WALLET_PRESETS } from "../lib/constants";
import { formatCurrency } from "../lib/formatters";

function ProfilePage() {
  const queryClient = useQueryClient();
  const { refetchSession } = useAuth();
  const { showFlash } = useFlash();
  const [amount, setAmount] = useState(500);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  if (profileQuery.isLoading) {
    return (
      <LoadingState
        title="Loading profile"
        description="We are preparing your account and wallet details."
      />
    );
  }

  if (profileQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[color:var(--color-text-muted)]">{profileQuery.error.message}</p>
          <Button onClick={() => profileQuery.refetch()}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  const { user, razorpayKeyId } = profileQuery.data;
  const safeAmount = Number(amount) || 0;

  async function handleWalletUpdate() {
    if (safeAmount < 1) {
      throw new Error("Enter a valid amount before starting payment.");
    }

    const result = await topUpWallet(safeAmount);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["profile"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] }),
      refetchSession(),
    ]);
    showFlash(result.message || "Wallet updated successfully", "success");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile and wallet"
        title="Keep your account context and wallet balance visible in one place."
        description="The wallet flow now lives in React but still uses the existing backend session and Razorpay order creation."
        actions={
          <Button variant="ghost" asChild>
            <Link to="/dashboard/subscriptions">Open subscriptions dashboard</Link>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Username" value={user.username} description="Your account identity in CraveCart." />
        <StatCard label="Email" value={user.email} description="Primary contact used for account access." />
        <StatCard
          label="Wallet balance"
          value={formatCurrency(user.money)}
          description="Current funds available for shared plan joins."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[color:var(--color-text-muted)]">
            <p>
              Signed in as <span className="font-semibold text-[color:var(--color-text-strong)]">{user.username}</span>.
            </p>
            <p>
              Listings owned: <span className="font-semibold text-[color:var(--color-text-strong)]">{user.listingsCount || 0}</span>
            </p>
            <p>
              Subscriptions joined: <span className="font-semibold text-[color:var(--color-text-strong)]">{user.subscriptionsCount || 0}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet top-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-[color:var(--color-text-strong)]">Quick amounts</p>
              <div className="flex flex-wrap gap-3">
                {WALLET_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    variant={safeAmount === preset ? "secondary" : "ghost"}
                    onClick={() => setAmount(preset)}
                  >
                    {formatCurrency(preset)}
                  </Button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--color-text-strong)]">Custom amount</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-subtle)] px-4 text-sm text-[color:var(--color-text-strong)] outline-none transition focus:border-[color:var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[color:var(--color-primary-soft)]"
              />
            </label>

            <PaymentButton
              className="w-full"
              amount={safeAmount}
              description="Wallet Top-Up"
              prefill={{ name: user.username, email: user.email }}
              razorpayKeyId={razorpayKeyId}
              createOrder={createPaymentOrder}
              onPaymentAuthorized={handleWalletUpdate}
              onError={(error) => showFlash(error.message, "error")}
              disabled={safeAmount < 1}
            >
              Add {formatCurrency(safeAmount || 0)} to wallet
            </PaymentButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
