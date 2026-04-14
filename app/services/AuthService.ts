import type { AxiosInstance } from "axios";

import type { AuthResponse, LoginCredentials } from "~/types";

export const createAuthService = (api: AxiosInstance) => ({
  async register(payload: any): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/register", payload);
    return data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/login", {
      email: credentials.login,
      password: credentials.password,
    });
    return data;
  },

  async logout(): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/logout");
    return data;
  },
});
