<script setup lang="ts">
const props = defineProps<{
  title: string;
  stats: { id: number; amount: number }[];
  type: "group" | "category";
}>();

const { groups } = useGroups();
const { categories } = useCategories();

const totalAmount = computed(() =>
  props.stats.reduce((acc, curr) => acc + curr.amount, 0),
);

const getItemData = (id: number) => {
  if (props.type === "group") {
    const group = groups.value?.find((g) => g.id === id);
    return { name: group?.name || "—", color: group?.color };
  }
  const category = categories.value?.find((c) => c.id === id);
  return { name: category?.name || "—", color: category?.color };
};

const sortedStats = computed(() =>
  [...props.stats].sort((a, b) => b.amount - a.amount),
);
</script>

<template>
  <UiCard class="border-none shadow-none">
    <UiCardHeader>
      <UiCardTitle>{{ title }}</UiCardTitle>
    </UiCardHeader>
    <UiCardContent>
      <div class="space-y-5">
        <div
          v-for="item in sortedStats"
          :key="item.id"
          class="flex flex-col gap-2"
        >
          <div class="flex justify-between text-sm font-medium">
            <span class="truncate pr-2">{{ getItemData(item.id).name }}</span>
            <span class="whitespace-nowrap text-sm font-medium">
              {{
                (item.amount ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }}
              ₴

              <span
                class="text-xs text-muted-foreground inline-block text-right ml-2 min-w-8.5"
              >
                {{
                  totalAmount > 0
                    ? Math.round((item.amount / totalAmount) * 100)
                    : 0
                }}%
              </span>
            </span>
          </div>

          <UiProgress
            :model-value="
              totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
            "
            :indicator-color="getItemData(item.id).color ?? undefined"
            class="h-4 border"
          />
        </div>

        <div
          v-if="sortedStats.length === 0"
          class="py-10 text-center text-sm text-muted-foreground"
        >
          {{ $t("common.no_data") }}
        </div>
      </div>
    </UiCardContent>
  </UiCard>
</template>
