import { computed, unref, type Ref } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreateTransactionData,
  SumByCategoriesParams,
  SumByGroupsParams,
  UpdateTransactionData,
} from "~/types";

export interface UseTransactionsParams {
  page: Ref<number>;
  perPage: Ref<number>;
  sortKey: Ref<string>;
  sortOrder: Ref<"asc" | "desc">;
}

export const useTransactions = (params?: UseTransactionsParams) => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: [
      "transactions",
      params
        ? {
            page: params.page,
            perPage: params.perPage,
            sortKey: params.sortKey,
            sortOrder: params.sortOrder,
          }
        : {},
    ],

    queryFn: () => {
      if (!params) return $services.transactions.getAll();

      return $services.transactions.getAll({
        page: params.page.value,
        per_page: params.perPage.value,
        sort_by: params.sortKey.value,
        sort_dir: params.sortOrder.value,
      });
    },
  });

  const recentTransactions = useQuery({
    queryKey: ["recent_transactions"],
    queryFn: $services.transactions.getRecent,
  });

  const refreshFinancialData = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions"] });
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-sum-groups"] });
    queryClient.invalidateQueries({
      queryKey: ["transactions-sum-categories"],
    });
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

  const getTransactionsByAccountId = (accountId: number) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.data.filter(
          (t) => t.account_id === accountId,
        ) || []
      );
    });

  const getTransactionsByCategoryId = (categoryId: number) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.data.filter(
          (t) => t.category_id === categoryId,
        ) || []
      );
    });

  const getTransactionsByGroupId = (categoryIds: number[]) =>
    computed(() => {
      return (
        transactionsQuery.data.value?.data.filter(
          (t) => t.group_id !== null && categoryIds.includes(t.group_id),
        ) || []
      );
    });

  const getTransactionById = (id: Ref<number | null | undefined>) => {
    return useQuery({
      queryKey: ["transaction", id],
      queryFn: () => $services.transactions.getById(id.value!),
      enabled: computed(() => !!id.value),
    });
  };

  const getSumByGroupsQuery = (
    filters: Ref<SumByGroupsParams> | SumByGroupsParams,
  ) => {
    return useQuery({
      queryKey: ["transactions-sum-groups", filters],
      queryFn: () => $services.transactions.getSumByGroups(unref(filters)),
      select: (data) => data?.stats ?? [],
    });
  };

  const getSumByCategoriesQuery = (
    filters: Ref<SumByCategoriesParams> | SumByCategoriesParams,
  ) => {
    return useQuery({
      queryKey: ["transactions-sum-categories", filters],
      queryFn: () => $services.transactions.getSumByCategories(unref(filters)),
      enabled: computed(() => !!unref(filters).group_id),
      select: (data) => data?.stats ?? [],
    });
  };

  return {
    transactions: computed(() => transactionsQuery.data.value?.data || []),
    totalPages: computed(() => transactionsQuery.data.value?.last_page || 1),
    totalItems: computed(() => transactionsQuery.data.value?.total || 0),

    isLoading: transactionsQuery.isPending,
    isError: transactionsQuery.isError,

    recentTransactions: recentTransactions.data,
    isRecentLoading: recentTransactions.isPending,
    isRecentError: recentTransactions.isError,

    getTransactionsByAccountId,
    getTransactionsByCategoryId,
    getTransactionsByGroupId,
    getTransactionById,
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
