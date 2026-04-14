import type { Group, CreateGroupData, UpdateGroupData } from "~/types";

export const useGroupStore = defineStore("group", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const groups = ref<Group[]>([]);

  // --- Actions ---
  async function fetchGroups() {
    const data = await execute(() => $services.groups.getAll());
    if (data) groups.value = data;
  }

  async function addGroup(payload: CreateGroupData) {
    const newGroup = await execute(() => $services.groups.create(payload));
    if (newGroup) {
      groups.value.push(newGroup);
      return newGroup;
    }
  }

  async function updateGroup(id: number, payload: UpdateGroupData) {
    const updatedGroup = await execute(() =>
      $services.groups.update(id, payload),
    );
    if (updatedGroup) {
      const index = groups.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        groups.value[index] = updatedGroup;
      }
      return updatedGroup;
    }
  }

  async function deleteGroup(id: number) {
    await execute(() => $services.groups.delete(id));
    groups.value = groups.value.filter((g) => g.id !== id);
  }

  return {
    groups,
    isLoading,
    fetchGroups,
    addGroup,
    updateGroup,
    deleteGroup,
  };
});
