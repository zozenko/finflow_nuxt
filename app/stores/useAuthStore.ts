import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, AuthResponse } from "~/types";

const getInitialUser = (): User | null => {
  const saved = localStorage.getItem("auth_user");
  if (!saved) return null;
  try {
    return JSON.parse(saved) as User;
  } catch {
    localStorage.removeItem("auth_user");
    return null;
  }
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(getInitialUser());
  const token = ref<string | null>(localStorage.getItem("auth_token"));
  const isAuthenticated = computed(() => !!token.value);

  function setAuth(data: AuthResponse) {
    user.value = data.user;
    token.value = data.token;
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  }

  function clearAuth() {
    const localePath = useLocalePath();
    user.value = null;
    token.value = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    navigateTo(localePath("/login"));
  }

  return { user, token, isAuthenticated, setAuth, clearAuth };
});
