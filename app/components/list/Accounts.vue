<script setup lang="ts">
const { t } = useI18n();
const { accounts } = useAccounts();
const modalStore = useModalStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-xl font-medium tracking-tight text-foreground">
      {{ $t("Lists.AccountList.title") }}
    </h2>
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

        <SharedEntityActions
          @edit="modalStore.openAccount(account)"
          @delete="modalStore.openDeleteAccount(account)"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
