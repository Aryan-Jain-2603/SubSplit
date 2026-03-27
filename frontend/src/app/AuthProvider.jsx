import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, loginUser, logoutUser, signupUser } from "../api/auth";
import { useFlash } from "./useFlash";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { showFlash } = useFlash();

  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: getCurrentUser,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (payload) => {
      queryClient.setQueryData(["auth", "session"], payload.user);
      showFlash(payload.message, "success");
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (payload) => {
      queryClient.setQueryData(["auth", "session"], payload.user);
      showFlash(payload.message, "success");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (payload) => {
      queryClient.setQueryData(["auth", "session"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      showFlash(payload.message, "success");
    },
  });

  const value = {
    user: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading,
    isRefreshing: sessionQuery.isFetching,
    isAuthenticated: Boolean(sessionQuery.data),
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refetchSession: sessionQuery.refetch,
    loginState: loginMutation,
    signupState: signupMutation,
    logoutState: logoutMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
