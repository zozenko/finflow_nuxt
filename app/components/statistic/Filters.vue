<script setup lang="ts">
import { Filter } from "lucide-vue-next";

const { t } = useI18n();
const { accounts } = useAccounts();
const { groups } = useGroups();

const accountId = defineModel<number | null>("accountId");
const groupId = defineModel<number | null>("groupId");
const period = defineModel<string>("period");
const type = defineModel<"expense" | "income">("type");

const chartPeriods = computed(() => [
  { value: "today", label: t("statistics.period.today") },
  { value: "current_week", label: t("statistics.period.current_week") },
  { value: "current_month", label: t("statistics.period.current_month") },
  { value: "last_7_days", label: t("statistics.period.last_7_days") },
  { value: "last_30_days", label: t("statistics.period.last_30_days") },
]);
</script>

<template>
  <div class="flex items-center gap-3">
    <UiTabs v-model="type">
      <UiTabsList class="h-9 bg-section border">
        <UiTabsTrigger
          value="expense"
          class="data-[state=active]:bg-red-50 px-2 transition-colors"
        >
          {{ t("statistics.expense") }}
        </UiTabsTrigger>
        <UiTabsTrigger
          value="income"
          class="data-[state=active]:bg-green-50 px-2 transition-colors"
        >
          {{ t("statistics.income") }}
        </UiTabsTrigger>
      </UiTabsList>
    </UiTabs>

    <UiPopover>
      <UiPopoverTrigger as-child>
        <UiButton variant="outline" class="gap-2 px-3">
          <Filter class="size-4" />
          <span class="hidden sm:inline">{{ t("common.filters") }}</span>
        </UiButton>
      </UiPopoverTrigger>

      <UiPopoverContent align="end" class="w-60 p-4 shadow-xl border-border/50">
        <div class="grid gap-4">
          <div class="space-y-1">
            <h4 class="font-medium leading-none">
              {{ t("common.filters") }}
            </h4>
            <p class="text-xs text-muted-foreground">
              {{ t("statistics.filters.description") }}
            </p>
          </div>

          <div class="grid gap-3">
            <div class="flex flex-col gap-1.5">
              <UiLabel class="text-sm">
                {{ t("statistics.filters.account") }}
              </UiLabel>
              <UiSelect v-model="accountId">
                <UiSelectTrigger class="bg-section h-8 w-full text-sm">
                  <UiSelectValue />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem :value="null">{{
                    t("statistics.all_accounts")
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
            </div>

            <div class="flex flex-col gap-1.5">
              <UiLabel class="text-sm">
                {{ t("statistics.filters.group") }}
              </UiLabel>
              <UiSelect v-model="groupId">
                <UiSelectTrigger class="bg-section h-8 w-full text-sm">
                  <UiSelectValue :placeholder="t('statistics.select_group')" />
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
            </div>

            <div class="flex flex-col gap-1.5">
              <UiLabel class="text-sm">
                {{ t("statistics.filters.period") }}
              </UiLabel>
              <UiSelect v-model="period">
                <UiSelectTrigger class="bg-section h-8 w-full text-sm">
                  <UiSelectValue :placeholder="t('statistics.select_period')" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="p in chartPeriods"
                    :key="p.value"
                    :value="p.value"
                  >
                    {{ p.label }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </div>
          </div>
        </div>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>
