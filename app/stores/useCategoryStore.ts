import type { Category, CreateCategoryData, UpdateCategoryData } from "~/types";

export const useCategoryStore = defineStore("category", () => {
  // --- Context ---
  const { $services } = useNuxtApp();
  const { isLoading, execute } = useApi();

  // --- State ---
  const categories = ref<Category[]>([]);

  // --- Getters ---
  const standaloneCategories = computed(() => {
    return categories.value.filter((c) => !c.group_id || c.group_id === 0);
  });

  const getCategoriesByGroupId = computed(() => {
    return (groupId: number) =>
      categories.value.filter((c) => c.group_id === groupId);
  });

  // --- Actions ---
  async function fetchCategories() {
    const data = await execute(() => $services.categories.getAll());
    if (data) categories.value = data;
  }

  async function addCategory(payload: CreateCategoryData) {
    const newCategory = await execute(() =>
      $services.categories.create(payload),
    );
    if (newCategory) {
      categories.value.push(newCategory);
      return newCategory;
    }
  }

  async function updateCategory(id: number, payload: UpdateCategoryData) {
    const updated = await execute(() =>
      $services.categories.update(id, payload),
    );
    if (updated) {
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = updated;
      }
      return updated;
    }
  }

  async function deleteCategory(id: number) {
    await execute(() => $services.categories.delete(id));
    categories.value = categories.value.filter((c) => c.id !== id);
  }

  return {
    categories,
    isLoading,
    standaloneCategories,
    getCategoriesByGroupId,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
