import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import {
  AccountSchema,
  type Account,
  type CreateAccountData,
  type UpdateAccountData,
} from "~/types";

export const createAccountService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;
  const ERR_CODE = "[ACCOUNT_SCHEMA_ERR]";

  return {
    async getAll(): Promise<Account[]> {
      const { data } = await api.get("/accounts");
      const res = AccountSchema.array().safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return [];
      }
      return res.data;
    },

    async create(payload: CreateAccountData): Promise<Account> {
      const { data } = await api.post("/accounts", payload);
      toast.success(t("notifications.account.created"));
      return data;
    },

    async update(id: number, payload: UpdateAccountData): Promise<Account> {
      const { data } = await api.put(`/accounts/${id}`, payload);
      toast.success(t("notifications.account.updated"));
      return data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/accounts/${id}`);
      toast.success(t("notifications.account.deleted"));
    },

    async getById(id: number): Promise<Account | null> {
      const { data } = await api.get(`/accounts/${id}`);
      const res = AccountSchema.safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        return null;
      }
      return res.data;
    },
  };
};
