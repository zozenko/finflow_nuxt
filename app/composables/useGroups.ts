import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreateGroupData,
  DeleteGroupPayload,
  UpdateGroupData,
} from "~/types";

export const useGroups = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-sum-groups"] });
    queryClient.invalidateQueries({
      queryKey: ["transactions-sum-categories"],
    });
  };

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
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: DeleteGroupPayload;
    }) => $services.groups.delete(id, payload),
    onSuccess: refreshData,
  });

  const getGroupById = (id: number | null) => {
    return groupsQuery.data.value?.find((c) => c.id === id);
  };

  return {
    groups: groupsQuery.data,
    isLoading: groupsQuery.isPending,
    isError: groupsQuery.isError,

    getGroupById,

    addGroup: addGroupMutation.mutate,
    updateGroup: updateGroupMutation.mutate,
    deleteGroup: deleteGroupMutation.mutate,

    isAdding: addGroupMutation.isPending,
    isUpdating: updateGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
  };
};
