import type { AxiosInstance } from "axios";
import type {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "~/types";

export const createTransactionService = (api: AxiosInstance) => ({
  async getAll(): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>("/transactions");
    return data;
  },

  async create(payload: CreateTransactionData): Promise<Transaction> {
    const { data } = await api.post<Transaction>("/transactions", payload);
    return data;
  },

  async update(
    id: number,
    payload: UpdateTransactionData,
  ): Promise<Transaction> {
    const { data } = await api.put<Transaction>(`/transactions/${id}`, payload);
    return data;
  },

  async toggleFavorite(id: number): Promise<{ is_favorite: boolean }> {
    const { data } = await api.patch<{ is_favorite: boolean }>(
      `/transactions/${id}/favorite`,
    );
    return data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(
      `/transactions/${id}`,
    );
    return data;
  },
});
