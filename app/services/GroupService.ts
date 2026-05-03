import type { AxiosInstance } from "axios";
import { toast } from "vue-sonner";
import type { DeleteGroupPayload } from "~/types";
import {
  GroupSchema,
  type Group,
  type CreateGroupData,
  type UpdateGroupData,
} from "~/types/group";

export const createGroupService = (api: AxiosInstance) => {
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;

  const ERR_CODE = "[GROUP_SCHEMA_ERR]";

  return {
    async getAll(): Promise<Group[]> {
      const { data } = await api.get("/groups");
      const res = GroupSchema.array().safeParse(data);
      if (!res.success) {
        toast.warning(ERR_CODE, {
          description: t("notifications.errors.schema_mismatch"),
        });
        console.error(ERR_CODE, res.error);
        return [];
      }
      return res.data;
    },

    async create(payload: CreateGroupData): Promise<Group> {
      const { data } = await api.post("/groups", payload);
      toast.success(t("notifications.group.created"));
      return data;
    },

    async update(id: number, payload: UpdateGroupData): Promise<Group> {
      const { data } = await api.put(`/groups/${id}`, payload);
      toast.success(t("notifications.group.updated"));
      return data;
    },

    async delete(id: number, payload: DeleteGroupPayload): Promise<void> {
      await api.delete(`/groups/${id}`, { data: payload });
      toast.success(t("notifications.group.deleted"));
    },
  };
};
