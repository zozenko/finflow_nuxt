import type { AxiosInstance } from "axios";
import type {
  PlannedTransaction,
  CreatePlannedTransactionData,
  UpdatePlannedTransactionData,
} from "~/types";

export const createPlannedTransactionService = (api: AxiosInstance) => ({
  async getAll(): Promise<PlannedTransaction[]> {
    const { data } = await api.get<PlannedTransaction[]>(
      "/planned-transactions",
    );
    return data;
  },

  async create(
    payload: CreatePlannedTransactionData,
  ): Promise<PlannedTransaction> {
    const { data } = await api.post<PlannedTransaction>(
      "/planned-transactions",
      payload,
    );
    return data;
  },

  async update(
    id: number,
    payload: UpdatePlannedTransactionData,
  ): Promise<PlannedTransaction> {
    const { data } = await api.put<PlannedTransaction>(
      `/planned-transactions/${id}`,
      payload,
    );
    return data;
  },

  async toggleStatus(id: number): Promise<{ is_active: boolean }> {
    const { data } = await api.patch<{ is_active: boolean }>(
      `/planned-transactions/${id}/status`,
    );
    return data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(
      `/planned-transactions/${id}`,
    );
    return data;
  },
});
