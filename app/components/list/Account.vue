<script setup lang="ts">
const { t } = useI18n();
const { accounts } = useAccounts();
const modalStore = useModalStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <UiCard
      v-for="account in accounts"
      :key="account.id"
      class="shadow-sm py-2.5"
    >
      <UiCardContent class="flex items-center w-full gap-4 px-4">
        <div class="flex items-center justify-center">
          <component
            :is="getIcon(getAccountConfig(account.type).icon)"
            class="size-6"
            :style="{ color: getAccountConfig(account.type).color }"
          />
        </div>

        <div class="flex-1 flex flex-col text-lg font-medium">
          <span>{{ account.name }}</span>
          <span class="text-sm text-muted-foreground">{{
            t(`account.type.${account.type}`)
          }}</span>
        </div>

        <div class="text-lg font-medium">
          {{
            Number(account.balance).toLocaleString("uk-UA", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
          ₴
        </div>

        <EntityActions @edit="modalStore.openAccount(account)" />
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
