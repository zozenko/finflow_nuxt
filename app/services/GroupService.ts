import type { AxiosInstance } from "axios";
import type { Group, CreateGroupData, UpdateGroupData } from "~/types";

export const createGroupService = (api: AxiosInstance) => ({
  async getAll(): Promise<Group[]> {
    const { data } = await api.get<Group[]>("/groups");
    return data;
  },

  async create(payload: CreateGroupData): Promise<Group> {
    const { data } = await api.post<Group>("/groups", payload);
    return data;
  },

  async update(id: number, payload: UpdateGroupData): Promise<Group> {
    const { data } = await api.put<Group>(`/groups/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/groups/${id}`);
    return data;
  },
});
