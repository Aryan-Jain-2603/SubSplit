import { apiClient } from "./client";

export async function getSubscriptionsDashboard() {
  const response = await apiClient.get("/api/dashboard/subscriptions");
  return response.data;
}
