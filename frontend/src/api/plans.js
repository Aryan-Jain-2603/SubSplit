import { apiClient } from "./client";

export async function getPlans(filters = {}) {
  const response = await apiClient.get("/api/plans", {
    params: filters,
  });

  return response.data;
}

export async function getPlan(id) {
  const response = await apiClient.get(`/api/plans/${id}`);
  return response.data;
}

export async function createPlan(payload) {
  const response = await apiClient.post("/api/plans", payload);
  return response.data;
}

export async function updatePlan(id, payload) {
  const response = await apiClient.put(`/api/plans/${id}`, payload);
  return response.data;
}

export async function deletePlan(id) {
  const response = await apiClient.delete(`/api/plans/${id}`);
  return response.data;
}

export async function joinPlan(id) {
  const response = await apiClient.post(`/api/plans/${id}/join`);
  return response.data;
}

export async function predictPlan(payload) {
  const response = await apiClient.post("/api/predict", payload);
  return response.data;
}
