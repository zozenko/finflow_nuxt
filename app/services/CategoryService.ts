import type { AxiosInstance } from "axios";
import type { Category, CreateCategoryData, UpdateCategoryData } from "~/types";

export const createCategoryService = (api: AxiosInstance) => ({
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/categories");
    return data;
  },

  async create(payload: CreateCategoryData): Promise<Category> {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  async update(id: number, payload: UpdateCategoryData): Promise<Category> {
    const { data } = await api.put<Category>(`/categories/${id}`, payload);
    return data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/categories/${id}`);
    return data;
  },
});
