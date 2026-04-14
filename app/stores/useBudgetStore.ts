import type { Budget, CreateBudgetData, UpdateBudgetData } from "~/types";

export const useBudgetStore = defineStore("budget", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const budgets = ref<Budget[]>([]);

  // --- Actions ---
  async function fetchBudgets() {
    const data = await execute(() => $services.budgets.getAll());
    if (data) budgets.value = data;
  }

  async function addBudget(payload: CreateBudgetData) {
    const newBudget = await execute(() => $services.budgets.create(payload));
    if (newBudget) {
      budgets.value.push(newBudget);
      return newBudget;
    }
  }

  async function updateBudget(id: number, payload: UpdateBudgetData) {
    const updated = await execute(() => $services.budgets.update(id, payload));
    if (updated) {
      const index = budgets.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        budgets.value[index] = updated;
      }
      return updated;
    }
  }

  async function deleteBudget(id: number) {
    await execute(() => $services.budgets.delete(id));
    budgets.value = budgets.value.filter((b) => b.id !== id);
  }

  return {
    budgets,
    isLoading,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
});
