import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { CreateBudgetData, UpdateBudgetData } from "~/types";

export const useBudgets = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const budgetsQuery = useQuery({
    queryKey: ["budgets"],
    queryFn: $services.budgets.getAll,
  });

  const addBudgetMutation = useMutation({
    mutationFn: (payload: CreateBudgetData) =>
      $services.budgets.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBudgetData }) =>
      $services.budgets.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: number) => $services.budgets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  return {
    budgets: budgetsQuery.data,
    isLoading: budgetsQuery.isPending,
    isError: budgetsQuery.isError,

    addBudget: addBudgetMutation.mutate,
    updateBudget: updateBudgetMutation.mutate,
    deleteBudget: deleteBudgetMutation.mutate,

    isAdding: addBudgetMutation.isPending,
    isUpdating: updateBudgetMutation.isPending,
    isDeleting: deleteBudgetMutation.isPending,
  };
};
