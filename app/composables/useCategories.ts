import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type {
  CreateCategoryData,
  DeleteCategoryPayload,
  UpdateCategoryData,
} from "~/types";

export const useCategories = () => {
  const { $services } = useNuxtApp();
  const queryClient = useQueryClient();
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["recent_transactions"] });
    queryClient.invalidateQueries({ queryKey: ["transactions-sum-groups"] });
    queryClient.invalidateQueries({
      queryKey: ["transactions-sum-categories"],
    });
  };

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: $services.categories.getAll,
  });

  const addCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryData) =>
      $services.categories.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCategoryData;
    }) => $services.categories.update(id, payload),
    onSuccess: refreshData,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: DeleteCategoryPayload;
    }) => $services.categories.delete(id, payload),
    onSuccess: refreshData,
  });

  const standaloneCategories = computed(() => {
    return (
      categoriesQuery.data.value?.filter(
        (c) => !c.group_id || c.group_id === 0,
      ) || []
    );
  });

  const getCategoryById = (id: number | null) => {
    return categoriesQuery.data.value?.find((c) => c.id === id);
  };

  const getCategoriesByGroupId = (groupId: number) =>
    computed(() => {
      return (
        categoriesQuery.data.value?.filter((c) => c.group_id === groupId) || []
      );
    });

  return {
    categories: categoriesQuery.data,
    isLoading: categoriesQuery.isPending,
    isError: categoriesQuery.isError,

    standaloneCategories,
    getCategoryById,
    getCategoriesByGroupId,

    addCategory: addCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,

    isAdding: addCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
