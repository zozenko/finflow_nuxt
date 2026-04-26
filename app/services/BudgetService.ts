import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import {
  BudgetSchema,
  type Budget,
  type CreateBudgetData,
  type UpdateBudgetData,
} from "~/types";

export const createBudgetService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;
  const ERR_CODE = "[BUDGET_SCHEMA_ERR]";

  return {
    async getAll(): Promise<Budget[]> {
      const { data } = await api.get("/budgets");
      const res = BudgetSchema.array().safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return [];
      }
      return res.data;
    },

    async getById(id: number): Promise<Budget | null> {
      const { data } = await api.get(`/budgets/${id}`);
      const res = BudgetSchema.safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return null;
      }
      return res.data;
    },

    async create(payload: CreateBudgetData): Promise<Budget> {
      const { data } = await api.post("/budgets", payload);
      toast.success(t("notifications.budget.created"));
      return data;
    },

    async update(id: number, payload: UpdateBudgetData): Promise<Budget> {
      const { data } = await api.put(`/budgets/${id}`, payload);
      toast.success(t("notifications.budget.updated"));
      return data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/budgets/${id}`);
      toast.success(t("notifications.budget.deleted"));
    },
  };
};
