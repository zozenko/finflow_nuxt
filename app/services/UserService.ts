import type { AxiosInstance } from "axios";
import type { User } from "~/types";

export const createUserService = (api: AxiosInstance) => ({
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/user");
    return data;
  },
});
