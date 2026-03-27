import { apiClient } from "./client";

export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/api/auth/me");
    return response.data.user;
  } catch (error) {
    if (error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function loginUser(credentials) {
  const params = new URLSearchParams();
  params.set("username", credentials.username);
  params.set("password", credentials.password);

  const response = await apiClient.post("/api/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function signupUser(payload) {
  const params = new URLSearchParams();
  params.set("username", payload.username);
  params.set("email", payload.email);
  params.set("password", payload.password);

  const response = await apiClient.post("/api/auth/signup", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
}
