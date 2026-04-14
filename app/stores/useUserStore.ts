import type { User } from "~/types";

export const useUserStore = defineStore("user", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const profile = ref<User | null>(null);

  // --- Actions ---
  async function fetchProfile() {
    const data = await execute(() => $services.user.getProfile());
    if (data) {
      profile.value = data;
      return data;
    }
  }

  function clearProfile() {
    profile.value = null;
  }

  return {
    profile,
    isLoading,
    fetchProfile,
    clearProfile,
  };
});
