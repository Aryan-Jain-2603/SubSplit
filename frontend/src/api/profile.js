import { apiClient } from "./client";

export async function getProfile() {
  const response = await apiClient.get("/api/profile");
  return response.data;
}

export async function getAppConfig() {
  const response = await apiClient.get("/api/config");
  return response.data;
}

export async function createPaymentOrder(amount) {
  const response = await apiClient.post("/api/payment/order", { amount });
  return response.data;
}

export async function topUpWallet(amount) {
  const response = await apiClient.post("/api/wallet/top-up", { amount });
  return response.data;
}
