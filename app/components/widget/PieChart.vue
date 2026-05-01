<script setup lang="ts">
import type { SumByCategoriesParams, SumByGroupsParams } from "~/types";

const { t } = useI18n();

const { accounts } = useAccounts();
const { groups } = useGroups();
const { getSumByGroupsQuery, getSumByCategoriesQuery } = useTransactions();

const selectedAccountId = ref<number | null>(null);
const selectedGroupId = ref<number | null>(null);
const selectedType = ref<"expense" | "income">("expense");
const selectedPeriod = ref<string>("current_month");

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
    <div class="flex gap-4">
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
      <UiSelect v-model="selectedPeriod">
        <UiSelectTrigger class="bg-section">
          <UiSelectValue :placeholder="t('PieChart.select_period')" />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="today">{{
            t("PieChart.period.today")
          }}</UiSelectItem>
          <UiSelectItem value="current_week">{{
            t("PieChart.period.current_week")
          }}</UiSelectItem>
          <UiSelectItem value="current_month">{{
            t("PieChart.period.current_month")
          }}</UiSelectItem>
          <UiSelectItem value="last_7_days">{{
            t("PieChart.period.last_7_days")
          }}</UiSelectItem>
          <UiSelectItem value="last_30_days">{{
            t("PieChart.period.last_30_days")
          }}</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
      <UiRadioGroup v-model="selectedType" class="flex gap-0">
        <div>
          <UiRadioGroupItem
            id="type-expense"
            value="expense"
            class="peer sr-only"
          />
          <UiLabel
            for="type-expense"
            class="flex h-9 items-center font-medium bg-section justify-center rounded-l-xl border border-r-0 px-4 py-2 transition-colors hover:bg-destructive hover:text-primary-foreground peer-data-[state=checked]:bg-destructive peer-data-[state=checked]:text-primary-foreground cursor-pointer"
          >
            {{ t("transaction.type.expense") }}
          </UiLabel>
        </div>
        <div>
          <UiRadioGroupItem
            id="type-income"
            value="income"
            class="peer sr-only"
          />
          <UiLabel
            for="type-income"
            class="flex h-9 items-center font-medium bg-section justify-center rounded-r-xl border px-4 py-2 transition-colors hover:bg-primary hover:text-primary-foreground peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer"
          >
            {{ t("transaction.type.income") }}
          </UiLabel>
        </div>
      </UiRadioGroup>
    </div>
    <div class="grid w-full grid-cols-1 lg:grid-cols-2 gap-8">
      <StatisticDonutChart
        :title="t('PieChart.expense_groups')"
        :stats="groupStats"
        type="group"
      />
      <StatisticDonutChart
        :title="t('PieChart.expense_categories')"
        :stats="categoryStats"
        type="category"
      />
    </div>
  </div>
</template>
