import type {
  User,
  LoginCredentials,
  AuthResponse,
  RegisterPayload,
} from "~/types";

export const useAuthStore = defineStore("auth", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("auth_token"));

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // --- Actions ---
  function setAuth(data: AuthResponse) {
    user.value = data.user;
    token.value = data.token;
    localStorage.setItem("auth_token", data.token);
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    const lang = localStorage.getItem("user-lang") || "uk";
    navigateTo(`/${lang}/login`);
  }

  async function register(payload: RegisterPayload) {
    const data = await execute(() => $services.auth.register(payload));
    if (data) {
      setAuth(data);
      return data;
    }
  }

  async function login(credentials: LoginCredentials) {
    const data = await execute(() => $services.auth.login(credentials));
    if (data) {
      setAuth(data);
      return data;
    }
  }

  async function logout() {
    try {
      await execute(() => $services.auth.logout());
    } finally {
      clearAuth();
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    clearAuth,
  };
});
