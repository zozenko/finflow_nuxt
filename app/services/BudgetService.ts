import type { AxiosInstance } from "axios";
import type { Budget, CreateBudgetData, UpdateBudgetData } from "~/types";

export const createBudgetService = (api: AxiosInstance) => ({
  async getAll(): Promise<Budget[]> {
    const { data } = await api.get<Budget[]>("/budgets");
    return data;
  },

  async create(payload: CreateBudgetData): Promise<Budget> {
    const { data } = await api.post<Budget>("/budgets", payload);
    return data;
  },

  async update(id: number, payload: UpdateBudgetData): Promise<Budget> {
    const { data } = await api.put<Budget>(`/budgets/${id}`, payload);
    return data;
  },

  async getById(id: number): Promise<Budget> {
    const { data } = await api.get<Budget>(`/budgets/${id}`);
    return data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/budgets/${id}`);
    return data;
  },
});
