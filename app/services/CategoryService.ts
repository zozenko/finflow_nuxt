import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import {
  CategorySchema,
  type Category,
  type CreateCategoryData,
  type UpdateCategoryData,
} from "~/types";

export const createCategoryService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;
  const ERR_CODE = "[CATEGORY_SCHEMA_ERR]";

  return {
    async getAll(): Promise<Category[]> {
      const { data } = await api.get("/categories");
      const res = CategorySchema.array().safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return [];
      }
      return res.data;
    },

    async create(payload: CreateCategoryData): Promise<Category> {
      const { data } = await api.post("/categories", payload);
      toast.success(t("notifications.category.created"));
      return data;
    },

    async update(id: number, payload: UpdateCategoryData): Promise<Category> {
      const { data } = await api.put(`/categories/${id}`, payload);
      toast.success(t("notifications.category.updated"));
      return data;
    },

    async getById(id: number): Promise<Category | null> {
      const { data } = await api.get(`/categories/${id}`);
      const res = CategorySchema.safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        return null;
      }
      return res.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/categories/${id}`);
      toast.success(t("notifications.category.deleted"));
    },
  };
};
