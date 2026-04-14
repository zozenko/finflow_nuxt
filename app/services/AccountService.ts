import type { AxiosInstance } from "axios";
import type { Account, CreateAccountData, UpdateAccountData } from "~/types";

export const createAccountService = (api: AxiosInstance) => ({
  async getAll(): Promise<Account[]> {
    const { data } = await api.get<Account[]>("/accounts");
    return data;
  },

  async create(payload: CreateAccountData): Promise<Account> {
    const { data } = await api.post<Account>("/accounts", payload);
    return data;
  },

  async update(id: number, payload: UpdateAccountData): Promise<Account> {
    const { data } = await api.put<Account>(`/accounts/${id}`, payload);
    return data;
  },

  async getById(id: number): Promise<Account> {
    const { data } = await api.get<Account>(`/accounts/${id}`);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
});
