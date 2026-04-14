import type {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "~/types";

export const useTransactionStore = defineStore("transaction", () => {
  // --- Context ---
  const accountStore = useAccountStore();
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const transactions = ref<Transaction[]>([]);

  // --- Getters ---
  const getTransactionsByAccountId = computed(() => {
    return (accountId: number) =>
      transactions.value.filter((t) => t.account_id === accountId);
  });

  const getTransactionsByCategoryId = computed(() => {
    return (categoryId: number) =>
      transactions.value.filter((t) => t.category_id === categoryId);
  });

  const getTransactionsByGroupId = computed(() => {
    return (categoryIds: number[]): Transaction[] => {
      return transactions.value.filter(
        (t) => t.category_id !== null && categoryIds.includes(t.category_id),
      );
    };
  });

  // --- Actions ---
  async function fetchTransactions() {
    const data = await execute(() => $services.transactions.getAll());
    if (data) transactions.value = data;
  }

  async function addTransaction(payload: CreateTransactionData) {
    const newTransaction = await execute(() =>
      $services.transactions.create(payload),
    );
    if (newTransaction) {
      transactions.value.unshift(newTransaction);
      await accountStore.fetchAccounts();
      return newTransaction;
    }
  }

  async function updateTransaction(id: number, payload: UpdateTransactionData) {
    const updated = await execute(() =>
      $services.transactions.update(id, payload),
    );
    if (updated) {
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = updated;
      }
      await accountStore.fetchAccounts();
      return updated;
    }
  }

  async function toggleFavorite(id: number) {
    const response = await execute(() =>
      $services.transactions.toggleFavorite(id),
    );
    if (response) {
      const transaction = transactions.value.find((t) => t.id === id);
      if (transaction) {
        transaction.is_favorite = response.is_favorite;
      }
    }
  }

  async function deleteTransaction(id: number) {
    await execute(() => $services.transactions.delete(id));
    transactions.value = transactions.value.filter((t) => t.id !== id);
    await accountStore.fetchAccounts();
  }

  return {
    transactions,
    isLoading,
    getTransactionsByAccountId,
    getTransactionsByCategoryId,
    getTransactionsByGroupId,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    toggleFavorite,
    deleteTransaction,
  };
});
