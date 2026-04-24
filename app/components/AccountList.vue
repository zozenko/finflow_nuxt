<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

const { t } = useI18n();
const { accounts } = useAccounts();

const accountTypeMap: Record<string, { icon: string; color: string }> = {
  cash: { icon: "Banknote", color: "#FDE68A" },
  card: { icon: "CreditCard", color: "#7DD3FC" },
  savings: { icon: "PiggyBank", color: "#6EE7B7" },
  credit: { icon: "Flame", color: "#FCA5A5" },
};

const getAccountConfig = (type: string) => {
  return accountTypeMap[type] || { icon: "Wallet", color: "#6B7280" };
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <UiCard
      v-for="account in accounts"
      :key="account.id"
      class="shadow-sm py-4"
    >
      <UiCardContent class="flex items-center w-full gap-4 px-4">
        <div class="flex items-center justify-center">
          <component
            :is="getIcon(getAccountConfig(account.type).icon)"
            class="w-6 h-6"
            :style="{ color: getAccountConfig(account.type).color }"
          />
        </div>

        <div class="flex-1 flex flex-col">
          <span class="text-lg font-medium">
            {{ account.name }}
          </span>
        </div>

        <EntityActions></EntityActions>
      </UiCardContent>
    </UiCard>

    <div
      v-if="!accounts || accounts.length === 0"
      class="text-sm text-gray-400 py-4 text-center border-2 border-dashed border-gray-200 rounded-lg"
    >
      {{ t("Lists.AccountList.empty") }}
    </div>
  </div>
</template>
