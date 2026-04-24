<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

const { t } = useI18n();
const { getCategoriesByGroupId } = useCategories();

const props = defineProps<{
  groupId: number;
}>();

const categories = getCategoriesByGroupId(props.groupId);
</script>

<template>
  <div class="flex flex-col gap-2 mt-2">
    <UiCard
      v-for="category in categories"
      :key="category.id"
      class="shadow-sm py-4"
    >
      <UiCardContent class="flex items-center w-full px-4 gap-4">
        <component
          :is="getIcon(category.icon_key)"
          class="w-5 h-5"
          :style="{ color: category.color || '#6B7280' }"
        />

        <div class="flex-1 text-lg font-medium">
          {{ category.name }}
        </div>

        <EntityActions></EntityActions>
      </UiCardContent>
    </UiCard>

    <div v-if="categories.length === 0" class="text-sm text-gray-400 py-2 pl-2">
      {{ t("Lists.CategoryList.empty") }}
    </div>
  </div>
</template>
