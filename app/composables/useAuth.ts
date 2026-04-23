import { useMutation } from "@tanstack/vue-query";
import type { LoginCredentials, RegisterPayload, AuthResponse } from "~/types";

export const useAuth = () => {
  const { $services } = useNuxtApp();
  const authStore = useAuthStore();
  const localePath = useLocalePath();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      $services.auth.login(credentials),
    onSuccess: (data: AuthResponse) => {
      authStore.setAuth(data);
      navigateTo(localePath("/"));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => $services.auth.register(payload),
    onSuccess: (data: AuthResponse) => {
      authStore.setAuth(data);
      navigateTo(localePath("/"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => $services.auth.logout(),
    onSettled: () => {
      authStore.clearAuth();
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isProcessing: computed(
      () => loginMutation.isPending.value || registerMutation.isPending.value,
    ),
    error: loginMutation.error,
  };
};
