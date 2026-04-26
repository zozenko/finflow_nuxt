import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import {
  TransactionSchema,
  SumByGroupsResponseSchema,
  SumByCategoriesResponseSchema,
  type Transaction,
  type CreateTransactionData,
  type UpdateTransactionData,
  type SumByGroupsParams,
  type SumByCategoriesParams,
  type SumByGroupsResponse,
  type SumByCategoriesResponse,
} from "~/types";

export const createTransactionService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;
  const ERR_CODE = "[TRANSACTION_SCHEMA_ERR]";

  return {
    async getAll(): Promise<Transaction[]> {
      const { data } = await api.get("/transactions");
      const items = Array.isArray(data) ? data : data?.data || [];
      const res = TransactionSchema.array().safeParse(items);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(`${ERR_CODE} [getAll]`, res.error);
        return [];
      }
      return res.data;
    },

    async getRecent(): Promise<Transaction[]> {
      const { data } = await api.get("/transactions/recent");
      const items = Array.isArray(data) ? data : data?.data || [];
      const res = TransactionSchema.array().safeParse(items);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(`${ERR_CODE} [Recent]`, res.error);
        return [];
      }
      return res.data;
    },

    async create(payload: CreateTransactionData): Promise<Transaction> {
      const { data } = await api.post("/transactions", payload);
      toast.success(t("notifications.transaction.created"));
      return data;
    },

    async update(
      id: number,
      payload: UpdateTransactionData,
    ): Promise<Transaction> {
      const { data } = await api.put(`/transactions/${id}`, payload);
      toast.success(t("notifications.transaction.updated"));
      return data;
    },

    async toggleFavorite(id: number): Promise<{ is_favorite: boolean }> {
      const { data } = await api.patch(`/transactions/${id}/favorite`);
      return data;
    },

    async getSumByGroups(
      params: SumByGroupsParams = {},
    ): Promise<SumByGroupsResponse | null> {
      const { data } = await api.get("/transactions/sum-by-groups", { params });
      const res = SumByGroupsResponseSchema.safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(`${ERR_CODE} [SumByGroups]`, res.error);
        return null;
      }
      return res.data;
    },

    async getSumByCategories(
      params: SumByCategoriesParams,
    ): Promise<SumByCategoriesResponse | null> {
      const { data } = await api.get("/transactions/sum-by-categories", {
        params,
      });
      const res = SumByCategoriesResponseSchema.safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(`${ERR_CODE} [SumByCategories]`, res.error);
        return null;
      }
      return res.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/transactions/${id}`);
      toast.success(t("notifications.transaction.deleted"));
    },
  };
};
