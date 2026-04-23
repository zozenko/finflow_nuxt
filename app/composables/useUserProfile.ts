import { useQuery, useQueryClient } from "@tanstack/vue-query";

export const useUserProfile = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: $services.user.getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const clearProfile = () => {
    queryClient.removeQueries({ queryKey: ["user-profile"] });
  };

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isPending,
    isError: profileQuery.isError,
    fetchProfile: profileQuery.refetch,
    clearProfile,
  };
};
