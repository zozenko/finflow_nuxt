import type { Account, CreateAccountData, UpdateAccountData } from "~/types";

export const useAccountStore = defineStore("account", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);

  // --- Getters ---
  const totalBalance = computed(() => {
    return accounts.value.reduce((total, acc) => {
      const val = Number(acc.balance) || 0;
      return total + val;
    }, 0);
  });

  // --- Actions ---
  async function fetchAccounts() {
    const data = await execute(() => $services.accounts.getAll());
    if (data) accounts.value = data;
  }

  async function fetchAccountById(id: number) {
    const account = await execute(() => $services.accounts.getById(id));
    if (account) {
      const index = accounts.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        accounts.value[index] = account;
      } else {
        accounts.value.push(account);
      }
      currentAccount.value = account;
      return account;
    }
  }

  async function addAccount(payload: CreateAccountData) {
    const newAccount = await execute(() => $services.accounts.create(payload));
    if (newAccount) {
      accounts.value.push(newAccount);
      return newAccount;
    }
  }

  async function updateAccount(id: number, payload: UpdateAccountData) {
    const updated = await execute(() => $services.accounts.update(id, payload));
    if (updated) {
      const index = accounts.value.findIndex((a) => a.id === id);
      if (index !== -1) accounts.value[index] = updated;
      if (currentAccount.value?.id === id) currentAccount.value = updated;
      return updated;
    }
  }

  async function deleteAccount(id: number) {
    await execute(() => $services.accounts.delete(id));
    accounts.value = accounts.value.filter((a) => a.id !== id);
    if (currentAccount.value?.id === id) currentAccount.value = null;
  }

  return {
    accounts,
    currentAccount,
    isLoading,
    totalBalance,
    fetchAccounts,
    fetchAccountById,
    addAccount,
    updateAccount,
    deleteAccount,
  };
});
