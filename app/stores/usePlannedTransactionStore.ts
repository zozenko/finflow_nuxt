import type {
  PlannedTransaction,
  CreatePlannedTransactionData,
  UpdatePlannedTransactionData,
} from "~/types";

export const usePlannedTransactionStore = defineStore(
  "plannedTransaction",
  () => {
    // --- Context ---
    const { $services } = useNuxtApp();
    const { isLoading, execute } = useApi();

    // --- State ---
    const plannedTransactions = ref<PlannedTransaction[]>([]);

    // --- Actions ---
    async function fetchPlannedTransactions() {
      const data = await execute(() => $services.plannedTransactions.getAll());
      if (data) plannedTransactions.value = data;
    }

    async function addPlannedTransaction(
      payload: CreatePlannedTransactionData,
    ) {
      const newData = await execute(() =>
        $services.plannedTransactions.create(payload),
      );
      if (newData) {
        plannedTransactions.value.push(newData);
        return newData;
      }
    }

    async function updatePlannedTransaction(
      id: number,
      payload: UpdatePlannedTransactionData,
    ) {
      const updated = await execute(() =>
        $services.plannedTransactions.update(id, payload),
      );
      if (updated) {
        const index = plannedTransactions.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          plannedTransactions.value[index] = updated;
        }
        return updated;
      }
    }

    async function toggleStatus(id: number) {
      const response = await execute(() =>
        $services.plannedTransactions.toggleStatus(id),
      );
      if (response) {
        const item = plannedTransactions.value.find((p) => p.id === id);
        if (item) {
          item.is_active = response.is_active;
        }
      }
    }

    async function deletePlannedTransaction(id: number) {
      await execute(() => $services.plannedTransactions.delete(id));
      plannedTransactions.value = plannedTransactions.value.filter(
        (p) => p.id !== id,
      );
    }

    return {
      plannedTransactions,
      isLoading,
      fetchPlannedTransactions,
      addPlannedTransaction,
      updatePlannedTransaction,
      toggleStatus,
      deletePlannedTransaction,
    };
  },
);
