import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreateTransactionData,
  SumByCategoriesParams,
  SumByGroupsParams,
  UpdateTransactionData,
} from "~/types";

export const useTransactions = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: $services.transactions.getAll,
  });

  const recentTransactions = useQuery({
    queryKey: ["recent_transactions"],
    queryFn: $services.transactions.getRecent,
  });

  const refreshFinancialData = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  const addMutation = useMutation({
    mutationFn: (payload: CreateTransactionData) =>
      $services.transactions.create(payload),
    onSuccess: refreshFinancialData,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTransactionData;
    }) => $services.transactions.update(id, payload),
    onSuccess: refreshFinancialData,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (id: number) => $services.transactions.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => $services.transactions.delete(id),
    onSuccess: refreshFinancialData,
  });

  // --- Обчислювальні значення (Getters) ---
  const getTransactionsByAccountId = (accountId: number) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.filter(
          (t) => t.account_id === accountId,
        ) || []
      );
    });

  const getTransactionsByCategoryId = (categoryId: number) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.filter(
          (t) => t.category_id === categoryId,
        ) || []
      );
    });

  const getTransactionsByGroupId = (categoryIds: number[]) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.filter(
          (t) => t.group_id !== null && categoryIds.includes(t.group_id),
        ) || []
      );
    });

  const getSumByGroupsQuery = (
    filters: Ref<SumByGroupsParams> | SumByGroupsParams,
  ) => {
    return useQuery({
      queryKey: ["transactions-sum-groups", filters],
      queryFn: () => $services.transactions.getSumByGroups(unref(filters)),
      select: (data) => data.stats,
    });
  };

  const getSumByCategoriesQuery = (
    filters: Ref<SumByCategoriesParams> | SumByCategoriesParams,
  ) => {
    return useQuery({
      queryKey: ["transactions-sum-categories", filters],
      queryFn: () => $services.transactions.getSumByCategories(unref(filters)),
      enabled: computed(() => !!unref(filters).group_id),
      select: (data) => data.stats,
    });
  };

  return {
    transactions: transactionsQuery.data,
    isLoading: transactionsQuery.isPending,
    isError: transactionsQuery.isError,

    recentTransactions: recentTransactions.data,
    isRecentLoading: recentTransactions.isPending,
    isRecentError: recentTransactions.isError,

    getTransactionsByAccountId,
    getTransactionsByCategoryId,
    getTransactionsByGroupId,
    getSumByGroupsQuery,
    getSumByCategoriesQuery,

    addTransaction: addMutation.mutate,
    updateTransaction: updateMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    deleteTransaction: deleteMutation.mutate,

    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleFavoriteMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
