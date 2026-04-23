<script setup lang="ts">
import { Donut } from "@unovis/ts";
import { VisDonut, VisSingleContainer } from "@unovis/vue";
import {
  ChartTooltipContent,
  componentToString,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SumByCategoriesParams } from "~/types";

const { t } = useI18n();

const { accounts } = useAccounts();
const { groups } = useGroups();
const { categories } = useCategories();
const { getSumByGroupsQuery, getSumByCategoriesQuery } = useTransactions();

const selectedAccountId = ref<number | null>(null);
const selectedGroupId = ref<number | null>(null);

const groupFilters = computed(() => ({
  account_id: selectedAccountId.value,
}));

const categoryFilters = computed<SumByCategoriesParams>(() => ({
  account_id: selectedAccountId.value,
  group_id: selectedGroupId.value,
  type: "expense",
}));

const { data: rawGroupSums } = getSumByGroupsQuery(groupFilters);
const { data: rawCategoriesSums } = getSumByCategoriesQuery(categoryFilters);

const chartData = computed(() => {
  const stats = rawGroupSums.value || [];

  return stats.map((item, index) => {
    const groupInfo = (groups.value || []).find((g) => g.id === item.groupId);

    return {
      group: groupInfo?.name || `group_${item.groupId}`,
      amount: item.amount,
      color: groupInfo?.color || `var(--chart-1)`,
      fill: groupInfo?.color || `var(--chart-1)`,
    };
  });
});

const chartConfig = computed<ChartConfig>(() => {
  const config: Record<string, { label: string; color?: string }> = {
    amount: { label: t("PieChart.amount") },
  };

  const stats = rawGroupSums.value || [];
  const groupsList = groups.value || [];

  stats.forEach((item, index) => {
    const groupInfo = groupsList.find((g) => g.id === item.groupId);
    const key = groupInfo?.name || `group_${item.groupId}`;

    config[key] = {
      label: groupInfo?.name || t("PieChart.unknown_group"),
      color: groupInfo?.color || `var(--chart-1)`,
    };
  });

  return config as ChartConfig;
});

const chartCategoriesData = computed(() => {
  const stats = rawCategoriesSums.value || [];
  const categoriesList = categories.value || [];

  return stats.map((item, index) => {
    const catInfo = categoriesList.find((c) => c.id === item.categoryId);

    return {
      category: catInfo?.name || `${t("PieChart.category")} ${item.categoryId}`,
      amount: item.amount,
      color: catInfo?.color || `var(--chart-1)`,
      fill: catInfo?.color || `var(--chart-1)`,
    };
  });
});

const categoriesConfig = computed<ChartConfig>(() => {
  const config: Record<string, { label: string; color?: string }> = {
    amount: { label: t("PieChart.sum") },
  };

  (rawCategoriesSums.value || []).forEach((item, index) => {
    const catInfo = (categories.value || []).find(
      (c) => c.id === item.categoryId,
    );
    const key = `category_${item.categoryId}`;

    config[key] = {
      label: catInfo?.name || `${t("PieChart.category")} ${item.categoryId}`,
      color: catInfo?.color || `var(--chart-${(index % 5) + 1})`,
    };
  });
  return config as ChartConfig;
});

const totalAmount = computed(() =>
  chartData.value.reduce((acc, curr) => acc + curr.amount, 0),
);

watch(
  rawGroupSums,
  (newStats) => {
    selectedGroupId.value = newStats?.[0]?.groupId ?? null;
  },
  { immediate: true },
);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="flex flex-col gap-4">
      <UiSelect v-model="selectedAccountId">
        <UiSelectTrigger class="bg-section">
          <UiSelectValue />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem :value="null">{{
            t("PieChart.all_accounts")
          }}</UiSelectItem>
          <UiSelectItem
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
          >
            {{ account.name }}
          </UiSelectItem>
        </UiSelectContent>
      </UiSelect>

      <UiCard class="border-none shadow-md">
        <UiCardHeader class="items-center">
          <UiCardTitle>{{ t("PieChart.expense_groups") }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <UiChartContainer
            :config="chartConfig"
            class="mx-auto aspect-square max-h-62.5"
          >
            <VisSingleContainer :data="chartData">
              <VisDonut
                :value="(d: any) => d.amount"
                :color="
                  (d: any) => {
                    return d.color || 'var(--chart-1)';
                  }
                "
                :arc-width="30"
                :central-label="totalAmount.toLocaleString() + ' ₴'"
                :central-sub-label="t('PieChart.total')"
              />
              <UiChartTooltip
                :triggers="{
                  [Donut.selectors.segment]: componentToString(
                    chartConfig,
                    ChartTooltipContent,
                    { labelKey: 'group' },
                  )!,
                }"
              />
            </VisSingleContainer>
          </UiChartContainer>
        </UiCardContent>
      </UiCard>
    </div>

    <div class="flex flex-col gap-4">
      <UiSelect v-model="selectedGroupId">
        <UiSelectTrigger class="bg-section">
          <UiSelectValue :placeholder="t('PieChart.select_group')" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem
            v-for="group in groups"
            :key="group.id"
            :value="group.id"
          >
            {{ group.name }}
          </UiSelectItem>
        </UiSelectContent>
      </UiSelect>

      <UiCard class="border-none shadow-md">
        <UiCardHeader class="items-center">
          <UiCardTitle>{{ t("PieChart.expense_categories") }}</UiCardTitle>
        </UiCardHeader>
        <UiCardContent>
          <UiChartContainer
            :config="categoriesConfig"
            class="mx-auto aspect-square max-h-62.5"
          >
            <VisSingleContainer :data="chartCategoriesData">
              <VisDonut
                :value="(d: any) => d.amount"
                :color="
                  (d: any) => {
                    return d.color || 'var(--chart-1)';
                  }
                "
                :arc-width="30"
                :central-label="totalAmount.toLocaleString() + ' ₴'"
                :central-sub-label="t('PieChart.total')"
              />
              <UiChartTooltip
                :triggers="{
                  [Donut.selectors.segment]: componentToString(
                    categoriesConfig,
                    ChartTooltipContent,
                    {
                      labelKey: 'category',
                    },
                  )!,
                }"
              />
            </VisSingleContainer>
          </UiChartContainer>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
