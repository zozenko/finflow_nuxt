<script setup lang="ts">
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import {
  ChartTooltipContent,
  componentToString,
  type ChartConfig,
} from "@/components/ui/chart";

interface StatItem {
  id: number;
  amount: number;
}

const props = defineProps<{
  title: string;
  stats: StatItem[];
  type: "group" | "category";
}>();

const { t } = useI18n();
const { groups } = useGroups();
const { categories } = useCategories();

const entities = computed(() =>
  props.type === "group"
    ? (groups.value ?? []).map((g) => ({ id: g.id, name: g.name, color: g.color }))
    : (categories.value ?? []).map((c) => ({ id: c.id, name: c.name, color: c.color })),
);

const fallbackLabel = (id: number) =>
  props.type === "group"
    ? t("PieChart.unknown_group")
    : `${t("PieChart.category")} ${id}`;

const chartData = computed(() =>
  props.stats.map((item) => {
    const entity = entities.value.find((e) => e.id === item.id);
    return {
      [props.type]: entity?.name ?? fallbackLabel(item.id),
      amount: item.amount,
      color: entity?.color ?? "var(--chart-1)",
      fill: entity?.color ?? "var(--chart-1)",
    };
  }),
);

const chartConfig = computed<ChartConfig>(() => {
  const config: Record<string, { label: string; color?: string }> = {
    amount: { label: t("PieChart.amount") },
  };
  props.stats.forEach((item, index) => {
    const entity = entities.value.find((e) => e.id === item.id);
    const key =
      props.type === "group"
        ? (entity?.name ?? `group_${item.id}`)
        : `category_${item.id}`;
    config[key] = {
      label: entity?.name ?? fallbackLabel(item.id),
      color: entity?.color ?? `var(--chart-${(index % 5) + 1})`,
    };
  });
  return config as ChartConfig;
});

const total = computed(() =>
  props.stats.reduce((acc, curr) => acc + curr.amount, 0),
);
</script>

<template>
  <UiCard class="border-none shadow-md">
    <UiCardHeader class="items-center">
      <UiCardTitle>{{ title }}</UiCardTitle>
    </UiCardHeader>
    <UiCardContent>
      <UiChartContainer
        :config="chartConfig"
        class="mx-auto aspect-square max-h-62.5"
      >
        <VisSingleContainer :data="chartData">
          <VisDonut
            :value="(d: any) => d.amount"
            :color="(d: any) => d.color || 'var(--chart-1)'"
            :arc-width="30"
            :central-label="total.toLocaleString() + ' ₴'"
            :central-sub-label="t('PieChart.total')"
          />
          <UiChartTooltip
            :triggers="{
              [Donut.selectors.segment]: componentToString(
                chartConfig,
                ChartTooltipContent,
                { labelKey: type },
              )!,
            }"
          />
        </VisSingleContainer>
      </UiChartContainer>
    </UiCardContent>
  </UiCard>
</template>
