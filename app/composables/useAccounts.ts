import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreateAccountData,
  DeleteAccountPayload,
  UpdateAccountData,
} from "~/types";

export const useAccounts = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-sum-groups"] });
    queryClient.invalidateQueries({
      queryKey: ["transactions-sum-categories"],
    });
  };

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => $services.accounts.getAll(),
  });

  const getAccountById = (id: number | null) => {
    return accountsQuery.data.value?.find((c) => c.id === id);
  };

  const addAccountMutation = useMutation({
    mutationFn: (payload: CreateAccountData) =>
      $services.accounts.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAccountData }) =>
      $services.accounts.update(id, payload),
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({
        queryKey: ["accounts", updatedAccount.id],
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: DeleteAccountPayload;
    }) => $services.accounts.delete(id, payload),
    onSuccess: refreshData,
  });

  const totalBalance = computed(() => {
    return (
      accountsQuery.data.value?.reduce((total, acc) => {
        return total + (Number(acc.balance) || 0);
      }, 0) || 0
    );
  });

  return {
    accounts: accountsQuery.data,
    isLoading: accountsQuery.isPending,
    isError: accountsQuery.isError,
    totalBalance,

    fetchAccounts: accountsQuery.refetch,
    getAccountById,
    addAccount: addAccountMutation.mutate,
    updateAccount: updateAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,

    isAdding: addAccountMutation.isPending,
    isUpdating: updateAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
  };
};
