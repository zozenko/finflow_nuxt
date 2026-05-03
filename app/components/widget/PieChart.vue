<script setup lang="ts">
import type { SumByCategoriesParams, SumByGroupsParams } from "~/types";

const { t } = useI18n();

const { accounts } = useAccounts();
const { groups } = useGroups();
const { getSumByGroupsQuery, getSumByCategoriesQuery } = useTransactions();

const selectedAccountId = ref<number | null>(null);
const selectedGroupId = ref<number | null>(null);
const selectedType = ref<"expense" | "income">("expense");
const selectedPeriod = ref<string>("last_30_days");

const groupFilters = computed<SumByGroupsParams>(() => ({
  period: selectedPeriod.value,
  account_id: selectedAccountId.value,
  type: selectedType.value,
}));

const categoryFilters = computed<SumByCategoriesParams>(() => ({
  period: selectedPeriod.value,
  account_id: selectedAccountId.value,
  group_id: selectedGroupId.value,
  type: selectedType.value,
}));

const { data: rawGroupSums } = getSumByGroupsQuery(groupFilters);
const { data: rawCategoriesSums } = getSumByCategoriesQuery(categoryFilters);

const groupStats = computed(() =>
  (rawGroupSums.value ?? []).map((s) => ({ id: s.groupId, amount: s.amount })),
);

const categoryStats = computed(() =>
  (rawCategoriesSums.value ?? []).map((s) => ({
    id: s.categoryId,
    amount: s.amount,
  })),
);

const selectedAccountName = computed(() => {
  if (!selectedAccountId.value) return t("statistics.all_accounts");
  const account = (accounts.value || []).find(
    (a) => a.id === selectedAccountId.value,
  );
  return account?.name || t("statistics.all_accounts");
});

const selectedGroupName = computed(() => {
  if (!selectedGroupId.value) return "";
  const group = (groups.value || []).find(
    (g) => g.id === selectedGroupId.value,
  );
  return group?.name || "";
});

watch(
  rawGroupSums,
  (stats) => {
    selectedGroupId.value = stats?.[0]?.groupId ?? null;
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="flex flex-col sm:flex-row w-full sm:items-center justify-between gap-4"
    >
      <h2 class="text-xl font-medium tracking-tight text-foreground">
        {{
          t("statistics.title_for_period", {
            period: t(`statistics.period.${selectedPeriod}`),
          })
        }}
      </h2>

      <StatisticFilters
        v-model:account-id="selectedAccountId"
        v-model:group-id="selectedGroupId"
        v-model:period="selectedPeriod"
        v-model:type="selectedType"
      />
    </div>
    <div class="grid w-full grid-cols-1 md:grid-cols-2 gap-8">
      <StatisticDonutChart
        :title="
          t(`PieChart.${selectedType}_groups`, { account: selectedAccountName })
        "
        :stats="groupStats"
        type="group"
      />
      <StatisticDonutChart
        :title="
          t(`PieChart.${selectedType}_categories`, { group: selectedGroupName })
        "
        :stats="categoryStats"
        type="category"
      />
    </div>
  </div>
</template>
