import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { CreateGroupData, UpdateGroupData } from "~/types";

export const useGroups = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: $services.groups.getAll,
  });

  const addGroupMutation = useMutation({
    mutationFn: (payload: CreateGroupData) => $services.groups.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGroupData }) =>
      $services.groups.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (id: number) => $services.groups.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    groups: groupsQuery.data,
    isLoading: groupsQuery.isPending,
    isError: groupsQuery.isError,

    addGroup: addGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,

    isAdding: addGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};
