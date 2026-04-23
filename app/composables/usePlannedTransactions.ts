import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreatePlannedTransactionData,
  UpdatePlannedTransactionData,
} from "~/types";

export const usePlannedTransactions = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const plannedQuery = useQuery({
    queryKey: ["planned-transactions"],
    queryFn: $services.plannedTransactions.getAll,
  });

  const addMutation = useMutation({
    mutationFn: (payload: CreatePlannedTransactionData) =>
      $services.plannedTransactions.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-transactions"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdatePlannedTransactionData;
    }) => $services.plannedTransactions.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-transactions"] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => $services.plannedTransactions.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-transactions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => $services.plannedTransactions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-transactions"] });
    },
  });

  return {
    plannedTransactions: plannedQuery.data,
    isLoading: plannedQuery.isPending,
    isError: plannedQuery.isError,

    addPlannedTransaction: addMutation.mutate,
    updatePlannedTransaction: updateMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
    deletePlannedTransaction: deleteMutation.mutate,

    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
