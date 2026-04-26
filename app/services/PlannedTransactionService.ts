import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import {
  PlannedTransactionSchema,
  type PlannedTransaction,
  type CreatePlannedTransactionData,
  type UpdatePlannedTransactionData,
} from "~/types";

export const createPlannedTransactionService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;
  const ERR_CODE = "[PLANNED_TX_SCHEMA_ERR]";

  return {
    async getAll(): Promise<PlannedTransaction[]> {
      const { data } = await api.get("/planned-transactions");
      const res = PlannedTransactionSchema.array().safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return [];
      }
      return res.data;
    },

    async create(
      payload: CreatePlannedTransactionData,
    ): Promise<PlannedTransaction> {
      const { data } = await api.post("/planned-transactions", payload);
      toast.success(t("notifications.planned_transaction.created"));
      return data;
    },

    async update(
      id: number,
      payload: UpdatePlannedTransactionData,
    ): Promise<PlannedTransaction> {
      const { data } = await api.put(`/planned-transactions/${id}`, payload);
      toast.success(t("notifications.planned_transaction.updated"));
      return data;
    },

    async toggleStatus(id: number): Promise<{ is_active: boolean }> {
      const { data } = await api.patch(`/planned-transactions/${id}/status`);
      return data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/planned-transactions/${id}`);
      toast.success(t("notifications.planned_transaction.deleted"));
    },
  };
};
